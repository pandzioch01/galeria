import {Route, Routes} from "react-router"
import Login from "../Page/Login";
import Register from '../Page/Register'
import MainPage from '../Page/MainPage'
import LandingPage from '../Page/LandingPage'
import MyPosts from "../Page/MyPosts"
const Approuter = () =>{
    return(
        <Routes>
            <Route path="/" element={<LandingPage/>}/>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />}/>
            <Route path="/main" element={<MainPage />}/>
            <Route path="/myposts" element={<MyPosts />}/>
        </Routes>
    )
}
export default Approuter;