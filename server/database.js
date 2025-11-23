import express from 'express'
import mysql from 'mysql2'
import dotenv from 'dotenv'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const app = express()
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const corsOptions = {
  origin: ['http://localhost:5173'],
}
app.use(cors(corsOptions))
app.use(express.json())

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads'))
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)
    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  }
})

app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')))

export const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
}).promise()

export async function getUser(user_id) {
  const [result] = await pool.query(
    'SELECT * FROM users WHERE user_id = ?',
    [user_id]
  )
  return result[0]
}

export async function createUser(username, password, email) {
  const hashedPassword = await bcrypt.hash(password, 10)
  const [result] = await pool.query(
    'INSERT INTO users(username, password, email) VALUES (?, ?, ?)',
    [username, hashedPassword, email]
  )
  const id = result.insertId
  return getUser(id)
}

export async function getUserByUsername(username) {
  const [result] = await pool.query(
    'SELECT * FROM users WHERE username = ?',
    [username]
  )
  return result[0]
}

export async function getUserByEmail(email) {
  const [result] = await pool.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  )
  return result[0]
}

export async function users() {
  const [result] = await pool.query('SELECT * FROM users')
  return result
}

app.get('/api', async (req, res) => {
  try {
    const allUsers = await users()
    res.json({ users: allUsers })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Database error' })
  }
})

app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const existingUser = await getUserByUsername(username)
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' })
    }

    const existingEmail = await getUserByEmail(email)
    if (existingEmail) {
      return res.status(400).json({ error: 'An account with this email already exists. Please use a different email.' })
    }

    const user = await createUser(username, password, email)
    const { password: _, ...userWithoutPassword } = user
    res.status(201).json({ 
      message: 'User registered successfully',
      user: userWithoutPassword 
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Registration failed' })
  }
})

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: 'Missing username or password' })
    }

    const user = await getUserByUsername(username)
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' })
    }

    const { password: _, ...userWithoutPassword } = user
    res.json({ 
      message: 'Login successful',
      user: userWithoutPassword 
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Login failed' })
  }
})

app.post('/api/posts', upload.single('image'), async (req, res) => {
  try {
    const { user_id, description } = req.body
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null

    if (!user_id || !description) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const [result] = await pool.query(
      'INSERT INTO posts(user_id, description, imagePath, likes) VALUES (?, ?, ?, ?)',
      [user_id, description, imagePath, 0]
    )

    const post = await getPost(result.insertId)
    res.status(201).json({ message: 'Post created successfully', post })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create post' })
  }
})

app.get('/api/posts', async (req, res) => {
  try {
    const [posts] = await pool.query(
      `SELECT p.*, u.username FROM posts p 
       JOIN users u ON p.user_id = u.user_id 
       ORDER BY p.post_id DESC`
    )
    res.json({ posts })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch posts' })
  }
})

app.get('/api/posts/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params
    const [posts] = await pool.query(
      `SELECT p.*, u.username FROM posts p 
       JOIN users u ON p.user_id = u.user_id 
       WHERE p.user_id = ? 
       ORDER BY p.post_id DESC`,
      [user_id]
    )
    res.json({ posts })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch user posts' })
  }
})

app.delete('/api/posts/:post_id', async (req, res) => {
  try {
    const { post_id } = req.params

    await pool.query('DELETE FROM comment WHERE post_id = ?', [post_id])

    await pool.query('DELETE FROM posts WHERE post_id = ?', [post_id])

    res.json({ message: 'Post deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete post' })
  }
})

app.post('/api/comments', async (req, res) => {
  try {
    const { post_id, user_id, commentText } = req.body

    if (!post_id || !user_id || !commentText) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const [result] = await pool.query(
      'INSERT INTO comment(post_id, user_id, commentText) VALUES (?, ?, ?)',
      [post_id, user_id, commentText]
    )

    const comment = await getComment(result.insertId)
    res.status(201).json({ message: 'Comment added successfully', comment })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to add comment' })
  }
})

app.get('/api/comments/:post_id', async (req, res) => {
  try {
    const { post_id } = req.params
    const [comments] = await pool.query(
      `SELECT c.*, u.username FROM comment c 
       JOIN users u ON c.user_id = u.user_id 
       WHERE c.post_id = ? 
       ORDER BY c.comment_id DESC`,
      [post_id]
    )
    res.json({ comments })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch comments' })
  }
})

app.delete('/api/comments/:comment_id', async (req, res) => {
  try {
    const { comment_id } = req.params
    await pool.query('DELETE FROM comment WHERE comment_id = ?', [comment_id])
    res.json({ message: 'Comment deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete comment' })
  }
})

app.post('/api/posts/:post_id/like', async (req, res) => {
  try {
    const { post_id } = req.params
    const [result] = await pool.query(
      'SELECT likes FROM posts WHERE post_id = ?',
      [post_id]
    )

    if (result.length === 0) {
      return res.status(404).json({ error: 'Post not found' })
    }

    const currentLikes = result[0].likes || 0
    const newLikes = currentLikes + 1

    await pool.query(
      'UPDATE posts SET likes = ? WHERE post_id = ?',
      [newLikes, post_id]
    )

    res.json({ message: 'Post liked', likes: newLikes })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to like post' })
  }
})

app.post('/api/posts/:post_id/unlike', async (req, res) => {
  try {
    const { post_id } = req.params
    const [result] = await pool.query(
      'SELECT likes FROM posts WHERE post_id = ?',
      [post_id]
    )

    if (result.length === 0) {
      return res.status(404).json({ error: 'Post not found' })
    }

    const currentLikes = result[0].likes || 0
    const newLikes = Math.max(0, currentLikes - 1)

    await pool.query(
      'UPDATE posts SET likes = ? WHERE post_id = ?',
      [newLikes, post_id]
    )

    res.json({ message: 'Post unliked', likes: newLikes })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to unlike post' })
  }
})

async function getPost(post_id) {
  const [result] = await pool.query(
    `SELECT p.*, u.username FROM posts p 
     JOIN users u ON p.user_id = u.user_id 
     WHERE p.post_id = ?`,
    [post_id]
  )
  return result[0]
}

async function getComment(comment_id) {
  const [result] = await pool.query(
    `SELECT c.*, u.username FROM comment c 
     JOIN users u ON c.user_id = u.user_id 
     WHERE c.comment_id = ?`,
    [comment_id]
  )
  return result[0]
}

app.listen(8080, () => {
  console.log('Server started on port 8080')
})
