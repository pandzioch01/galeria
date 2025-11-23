import { useState, useEffect } from "react"
import axios from 'axios'

export default function CommentSection({ postId, currentUserId }) {
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingComments, setLoadingComments] = useState(true)

  useEffect(() => {
    fetchComments()
  }, [postId])

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/comments/${postId}`)
      setComments(response.data.comments || [])
    } catch (err) {
      console.error("Error fetching comments:", err)
    } finally {
      setLoadingComments(false)
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()

    if (!commentText.trim()) {
      return
    }

    setLoading(true)
    try {
      const response = await axios.post('http://localhost:8080/api/comments', {
        post_id: postId,
        user_id: currentUserId,
        commentText: commentText
      })

      setComments([response.data.comment, ...comments])
      setCommentText("")
    } catch (err) {
      console.error("Error adding comment:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Delete this comment?")) {
      try {
        await axios.delete(`http://localhost:8080/api/comments/${commentId}`)
        setComments(comments.filter(c => c.comment_id !== commentId))
      } catch (err) {
        console.error("Error deleting comment:", err)
      }
    }
  }

  return (
    <div className="px-4 py-4 bg-gray-50 border-t border-gray-200">
      <form onSubmit={handleAddComment} className="mb-4">
        <div className="flex gap-3 max-w-md mx-auto">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 p-2 border border-gray-300 rounded-lg bg-text text-primary"
          />
          <button
            type="submit"
            disabled={loading || !commentText.trim()}
            className="bg-secondText text-text font-bold py-2 px-4 rounded-lg hover:opacity-80 disabled:opacity-50 transition"
          >
            Post
          </button>
        </div>
      </form>

      {loadingComments ? (
        <p className="text-text text-center">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-500 text-center">No comments yet. Be the first to comment!</p>
      ) : (
        <div className="space-y-3">
          {comments.map(comment => (
            <div key={comment.comment_id} className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-primary">{comment.username}</p>
                  <p className="text-primary text-sm">{comment.commentText}</p>
                </div>
                {comment.user_id === currentUserId && (
                  <button
                    onClick={() => handleDeleteComment(comment.comment_id)}
                    className="text-red-600 hover:text-red-800 text-sm font-semibold"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
