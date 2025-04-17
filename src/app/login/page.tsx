import LoginForm from "@/components/auth/LoginForm";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { redirect } from "next/navigation";
async function login() {
  const session = await getServerSession(authConfig);
  if(session){

  }
  return (
    <div>
        <LoginForm/>
    </div>
  )
}

export default login