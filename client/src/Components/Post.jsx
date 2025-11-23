import { useState, useEffect } from "react"
import axios from 'axios'
import CommentSection from './CommentSection'

export default function Post({ post, currentUserId, onPostDeleted, showDeleteButton = false }) {
  const [likes, setLikes] = useState(post.likes || 0)
  const [isLiked, setIsLiked] = useState(false)
  const [showComments, setShowComments] = useState(false)

  const handleLike = async () => {
    try {
      if (isLiked) {
        await axios.post(`http://localhost:8080/api/posts/${post.post_id}/unlike`)
        setLikes(prev => Math.max(0, prev - 1))
        setIsLiked(false)
      } else {
        await axios.post(`http://localhost:8080/api/posts/${post.post_id}/like`)
        setLikes(prev => prev + 1)
        setIsLiked(true)
      }
    } catch (err) {
      console.error("Error updating like:", err)
    }
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`http://localhost:8080/api/posts/${post.post_id}`)
        console.log("Post deleted")
        onPostDeleted()
      } catch (err) {
        console.error("Error deleting post:", err)
      }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden border border-gray-300">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-secondText rounded-full flex items-center justify-center">
            <span className="text-primary font-bold">{post.username?.[0]?.toUpperCase() || 'U'}</span>
          </div>
          <div>
            <p className="font-bold text-primary">{post.username || 'Unknown User'}</p>
          </div>
        </div>
        {showDeleteButton && post.user_id === currentUserId && (
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800 font-semibold"
          >
            Delete
          </button>
        )}
      </div>

      {post.imagePath && (
        <img
          src={`http://localhost:8080${post.imagePath}`}
          alt="Post"
          className="w-full object-cover"
          style={{ maxHeight: '500px' }}
        />
      )}

      <div className="p-4 bg-white">
        <p className="text-primary text-lg">{post.description}</p>
      </div>
      <div className="px-4 py-3 border-t border-gray-200 flex gap-6">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 font-semibold transition ${
            isLiked ? 'text-red-600' : 'text-primary hover:text-red-600'
          }`}
        >
          <span>❤️</span>
          <span>{likes} {likes === 1 ? 'Like' : 'Likes'}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-primary hover:text-blue-600 font-semibold transition"
        >
          <span>💬</span>
          <span>Comments</span>
        </button>
      </div>

      {showComments && (
        <CommentSection postId={post.post_id} currentUserId={currentUserId} />
      )}
    </div>
  )
}
