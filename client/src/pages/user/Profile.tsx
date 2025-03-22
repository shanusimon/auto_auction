import Footer from "@/components/footer/Footer"
import Header from "@/components/header/Header"
import ProfileCard from "@/components/user/Profile"


function Profile() {
  return (
    <>
    <Header/>
    <div className="bg-black py-10"> 
            <ProfileCard username="shanu simon" joinedDate="March 20,2025" profileImage="hello" email="shanu@gmail.com"   location="Los Angeles, USA"/>
    </div>

    <Footer/>
    </>
  )
}

export default Profile