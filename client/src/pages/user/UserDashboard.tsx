import Footer from "@/components/footer/Footer"
import Header from "@/components/header/Header"
import UserSidebar from "@/components/user/Sidebar"


function Profile() {
  return (
    <>
    <Header/>
    <div className="bg-black"> 
            <UserSidebar/>
    </div>

    <Footer/>
    </>
  )
}

export default Profile