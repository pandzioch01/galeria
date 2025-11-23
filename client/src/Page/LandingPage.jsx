import { Link } from 'react-router'
import VerticalAutoSlider from '../Components/VerticalAutoSlider'
export default function LandingPage(){
    const photos = [
    "src/assets/photo1.jpeg",
    "src/assets/photo2.jpg",
    "src/assets/photo3.jpg",
    "src/assets/photo4.jpg",
  ];
    return(
        <div className="w-screen h-screen bg-primary flex flex-row">
            <div className="p-30 flex flex-col justify-between">
                <div className="flex flex-col gap-15">
                    <p className="text-text font-black text-7xl">
                        Share your memories with others. <br />Simply.
                    </p>
                    <p className="text-text text-3xl font-semibold">
                        GalleReal is a safe space to store and organise your memories.<br />It’s a virtual album created to be simple and pretty to watch. <br />All of your photos in one place.  <br />Like. Share. Comment.
                    </p>
                </div>
                <div className="flex flex-row gap-5 text-secondText">
                    <div className="flex flex-col items-center gap-1">
                        <p>First time?</p>
                        <Link to='/register' className="bg-text text-black rounded-lg text-2xl font-bold pl-12 pr-12 pt-2 pb-2">Register</Link>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <p>Got an account?</p>
                        <Link to="/login" className="bg-secondText text-black rounded-lg text-2xl font-bold pl-12 pr-12 pt-2 pb-2">Login</Link>
                    </div>
                </div>
            </div>
            <div>
                <VerticalAutoSlider
                images={photos}
                width="w-full"  
                height="h-full"
                speed={60}
                direction='up'/>
            </div>
        </div>
    )
}