import NavbarPublic from "@/components/navbar/NavbarPublic"
import NavbarAdmin from "@/components/navbar/NavbarAdmin"
import NavbarStudent from "@/components/navbar/NavbarStudent"
import NavbarTeacher from "@/components/navbar/NavbarTeacher"
const userRole = "student"
export default function Navbar(){
    if(userRole === "teacher") return <NavbarTeacher/>;
    if(userRole === "student") return <NavbarStudent/>
    if(userRole === "admin") return <NavbarAdmin/>
    return <NavbarPublic/>
}
