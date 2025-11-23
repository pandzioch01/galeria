import { useState } from "react"
import { Link, useNavigate } from 'react-router'
import VerticalAutoSlider from "../Components/VerticalAutoSlider"
import axios from 'axios'

export default function Register(){
    const navigate = useNavigate()
    const [userName, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [repPassword, setRepPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleRegister = async (e) => {
        e.preventDefault()
        setError("")

        if (!userName || !email || !password || !repPassword) {
            setError("All fields are required")
            return
        }

        if (password !== repPassword) {
            setError("Passwords do not match")
            return
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters")
            return
        }

        setLoading(true)
        try {
            const response = await axios.post('http://localhost:8080/api/register', {
                username: userName,
                email: email,
                password: password
            })
            console.log("Registration successful:", response.data)
            navigate("/login")
        } catch (err) {
            console.error("Registration error:", err)
            setError(err.response?.data?.error || "Registration failed. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const photos = [
    "src/assets/photo1.jpeg",
    "src/assets/photo2.jpg",
    "src/assets/photo3.jpg",
    "src/assets/photo4.jpg",
    ];
    const photos2 = [
    "src/assets/photo3.jpg",
    "src/assets/photo4.jpg",
    "src/assets/photo6.jpg",
    "src/assets/photo5.jpg",
    ];
    return(
        <div className="w-screen h-screen flex flex-row">
            <div><VerticalAutoSlider
                    images={photos}
                    width="w-full"  
                    height="h-full"
                    speed={60}
                    direction="down"/></div>
            <div className="flex flex-col bg-secondary pt-10 pb-10 w-full items-center justify-around">
                <div className="flex flex-col items-center gap-5 text-text">
                    <p className=" text-9xl font-extrabold">Welcome.</p>
                    <p className="text-[40px] font-semibold bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 bg-clip-text text-transparent animate-gradient-move bg-200">To GalleReal</p>
                </div>
                <form className="flex flex-col gap-5" onSubmit={handleRegister}>
                    <input className="bg-text p-7 text-3xl rounded-lg border-[1px] border-black" name="username" placeholder="Username..." type="text" required value={userName} onChange={(e) => setUsername(e.target.value)}/>
                    <input className="bg-text p-7 text-3xl rounded-lg border-[1px] border-black" name="email" placeholder="Email..." type="email" required value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <input className="bg-text p-7 text-3xl rounded-lg border-[1px] border-black" name="password" placeholder="Password..." type="password" required value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <input className="bg-text p-7 text-3xl rounded-lg border-[1px] border-black" name="repPassword" placeholder="Confirm Password..." type="password" required value={repPassword} onChange={(e) => setRepPassword(e.target.value)}/>
                    {error && <p className="text-red-600 text-2xl font-semibold">{error}</p>}
                    <button type="submit" disabled={loading} className="text-4xl font-semibold bg-secondText border-[1px] border-black rounded-lg pt-5 pb-5 pl-15 pr-15 hover:opacity-80 disabled:opacity-50">
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>
                <Link to="/login" className="text-2xl font-semibold bg-secondText border-[1px] border-black rounded-lg pt-3 pb-3 pl-10 pr-10 hover:opacity-80">
                    Already have an account? Login
                </Link>
            </div>
            <div>
                <VerticalAutoSlider
                    images={photos2}
                    width="w-full"  
                    height="h-full"
                    speed={60}
                    direction="up"/>
            </div>
        </div>
    )
}