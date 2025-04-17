import { DefaultSession } from "next-auth";
import { UserRole } from "@/models/User";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }
  
  interface User {
    id: string;
    role: UserRole;
  }
}