# Galeria App - Complete Setup Guide

## Features Implemented

### 1. Authentication System
- ✅ User Registration with password hashing (bcryptjs)
- ✅ User Login with secure password verification
- ✅ Session management using localStorage
- ✅ Logout functionality with session clearing
- ✅ Protected routes (redirects to login if not authenticated)

### 2. Post Management
- ✅ Create posts with image and description
- ✅ View all posts from all users (Feed)
- ✅ View only your own posts (My Posts)
- ✅ Delete your own posts
- ✅ Image upload with multer

### 3. Comments
- ✅ Add comments to posts
- ✅ View comments on posts
- ✅ Delete your own comments
- ✅ Comments display with username

### 4. Likes
- ✅ Like/Unlike posts
- ✅ Like counter on posts
- ✅ Toggle like state

## Project Structure

```
client/
├── src/
│   ├── Components/
│   │   ├── PostForm.jsx          # Form to create new posts
│   │   ├── Post.jsx              # Post display component
│   │   ├── CommentSection.jsx    # Comments display and form
│   │   └── VerticalAutoSlider.jsx
│   ├── Page/
│   │   ├── MainPage.jsx          # Feed (all posts)
│   │   ├── MyPosts.jsx           # User's posts
│   │   ├── Login.jsx             # Login page
│   │   ├── Register.jsx          # Registration page
│   │   └── LandingPage.jsx
│   └── Routes/
│       └── Approuter.jsx

server/
├── database.js                    # Express server with all endpoints
├── galeria.sql                    # Database schema
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user

### Posts
- `POST /api/posts` - Create new post (multipart/form-data with image)
- `GET /api/posts` - Get all posts
- `GET /api/posts/:user_id` - Get user's posts
- `DELETE /api/posts/:post_id` - Delete post

### Comments
- `POST /api/comments` - Add comment to post
- `GET /api/comments/:post_id` - Get comments for post
- `DELETE /api/comments/:comment_id` - Delete comment

### Likes
- `POST /api/posts/:post_id/like` - Like a post
- `POST /api/posts/:post_id/unlike` - Unlike a post

## Installation & Running

### Prerequisites
- Node.js installed
- MySQL database running
- `.env` file in server directory with:
  ```
  MYSQL_HOST=localhost
  MYSQL_USER=your_username
  MYSQL_PASSWORD=your_password
  MYSQL_DATABASE=galeria
  ```

### Setup Database
1. Run the SQL commands from `galeria.sql` in your MySQL client
2. Ensure the `galeria` database is created and tables exist

### Install Dependencies

**Server:**
```bash
cd server
npm install
```

**Client:**
```bash
cd client
npm install
```

### Start the Application

**Terminal 1 - Start Server:**
```bash
cd server
npm run dev
```
Server will run on `http://localhost:8080`

**Terminal 2 - Start Client:**
```bash
cd client
npm run dev
```
Client will run on `http://localhost:5173`

## How to Use

### Registration
1. Navigate to `/register`
2. Fill in username, email, password, and confirm password
3. Click "Register"
4. You'll be redirected to login page

### Login
1. Navigate to `/login`
2. Enter username and password
3. Click "Login"
4. You'll be taken to the Feed

### Creating Posts
1. On Feed or My Posts page, fill out the "Create a Post" form
2. Add a description
3. Select an image
4. Click "Post"

### Interacting with Posts
**Like:**
- Click the heart icon to like/unlike posts

**Comment:**
- Click the comment button to open/close comments section
- Type your comment and click "Post"
- Delete your own comments with the "Delete" button

**Delete (My Posts only):**
- Click "Delete" button on your posts to remove them

## Database Schema Notes

- **users** table stores user information with hashed passwords
- **posts** table stores posts with user_id, description, imagePath, and likes count
- **comment** table stores comments linked to posts and users
- Images are stored in `/public/uploads` and referenced by path

## Important Notes

1. **Image Upload**: Images are stored on the server in `/public/uploads` directory
2. **Password Security**: Passwords are hashed using bcryptjs before storing
3. **Session Management**: User data is stored in browser localStorage
4. **Protected Routes**: MainPage and MyPosts redirect to login if user not authenticated
5. **CORS**: Server allows requests only from `http://localhost:5173`

## Troubleshooting

### Images not loading
- Ensure `/public/uploads` directory exists
- Check that the server is running on port 8080
- Verify image paths in database are correct

### Database connection errors
- Check `.env` file has correct credentials
- Ensure MySQL is running
- Verify `galeria` database exists

### Upload not working
- Check file size isn't too large
- Ensure only image files are uploaded
- Check server has write permissions to `/public/uploads`
