import { Link, useNavigate } from "react-router"
import { useEffect, useState } from "react"
import axios from 'axios'
import PostForm from '../Components/PostForm'
import Post from '../Components/Post'

export default function MainPage(){
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loggedInUser = localStorage.getItem('user')
        if (!loggedInUser) {
            navigate('/login')
        } else {
            setUser(JSON.parse(loggedInUser))
            fetchPosts()
        }
    }, [navigate])

    const fetchPosts = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/posts')
            setPosts(response.data.posts || [])
        } catch (err) {
            console.error("Error fetching posts:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('user')
        navigate('/login')
    }

    const handlePostCreated = () => {
        fetchPosts()
    }

    const handlePostDeleted = () => {
        fetchPosts()
    }

    return(
        <div className="w-screen h-screen flex flex-row bg-primary">
            <div className="w-1/5 bg-secondary flex flex-col p-10 justify-between border-r border-gray-300 h-screen">
                <div className="flex gap-3">
                    <img src="src\assets\user.svg"/>
                    <p className="text-2xl font-bold text-black">{user?.username || 'User'}</p>
                </div>
                <div>
                    <div className="flex gap-2 hover:invert transition duration-300 cursor-pointer">
                        <img src="src\assets\map.svg" />
                        <Link to="/myposts" className="text-3xl font-bold text-black">My posts</Link>
                    </div>
                </div>
                <div/>
                <button onClick={handleLogout} className="flex gap-2 hover:invert transition duration-300 bg-none border-none cursor-pointer">
                    <img src="src\assets\logout.svg"/>
                    <span className="text-3xl font-bold text-black">Logout</span>
                </button>
            </div>
            <div className="flex flex-row w-4/5 h-screen">
                <div className="bg-primary flex w-1/6"/>
                <div className="bg-secondary flex flex-col w-2/3 h-screen">
                    <h1 className="font-semibold text-4xl px-11 pt-6 pb-4 text-black bg-secondary border-b border-gray-300 text-center">Feed</h1>
                    <div className="flex-1 overflow-y-auto p-11">
                        <div className="w-full max-w-2xl mx-auto">
                            {user && <PostForm userId={user.user_id} onPostCreated={handlePostCreated} />}

                            {loading ? (
                                <p className="text-text text-xl text-center">Loading posts...</p>
                            ) : posts.length === 0 ? (
                                <p className="text-text text-xl text-center">No posts yet. Be the first to post!</p>
                            ) : (
                                posts.map(post => (
                                    <Post 
                                        key={post.post_id} 
                                        post={post} 
                                        currentUserId={user?.user_id}
                                        onPostDeleted={handlePostDeleted}
                                        showDeleteButton={true}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
                <div className="bg-primary flex w-1/6"/>
            </div>
        </div>
    )
}