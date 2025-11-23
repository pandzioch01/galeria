import { useState } from "react"
import axios from 'axios'

export default function PostForm({ userId, onPostCreated }) {
  const [description, setDescription] = useState("")
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!description.trim()) {
      setError("Please add a description")
      return
    }

    if (!image) {
      setError("Please select an image")
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('user_id', userId)
      formData.append('description', description)
      formData.append('image', image)

      const response = await axios.post('http://localhost:8080/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      console.log("Post created:", response.data)
      setDescription("")
      setImage(null)
      setImagePreview(null)
      onPostCreated()
    } catch (err) {
      console.error("Error creating post:", err)
      setError(err.response?.data?.error || "Failed to create post")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-secondary rounded-lg p-8 mb-8 border-2 border-primary">
      <h2 className="text-3xl font-bold mb-6 text-text text-center">Create a Post</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full p-4 text-xl rounded-lg border border-gray-300 bg-text resize-none focus:outline-none focus:border-secondText focus:border-2"
          rows="3"
        />

        <div className="flex flex-col gap-4">
          <label className="text-lg font-semibold text-text text-center block">Upload Image</label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image-input"
            />
            <label
              htmlFor="image-input"
              className="flex items-center justify-center w-full p-6 border-2 border-dashed border-primary rounded-lg cursor-pointer hover:bg-opacity-70 transition bg-opacity-30 bg-primary"
            >
              <div className="text-center">
                <p className="text-xl font-semibold text-text">Click to upload image</p>
                <p className="text-sm text-gray-600">PNG, JPG, GIF up to 10MB</p>
              </div>
            </label>
          </div>

          {imagePreview && (
            <div className="relative">
              <img src={imagePreview} alt="Preview" className="w-full object-cover rounded-lg border-2 border-primary" />
              <button
                type="button"
                onClick={() => {
                  setImage(null)
                  setImagePreview(null)
                }}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 transition font-bold"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {error && <p className="text-red-600 text-lg font-semibold text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-secondText text-primary font-bold py-3 px-6 rounded-lg hover:opacity-80 disabled:opacity-50 transition"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  )
}
