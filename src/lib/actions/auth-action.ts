import { z } from "zod";
import { RegisterSchema, LoginSchema } from "@/lib/validation";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { signIn } from "next-auth/react";
import AuthError from "next-auth";
import { error } from "console";
export async function register(values: z.infer<typeof RegisterSchema>) {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: validatedFields.error.errors[0].message };
  }
  const { lastName, firstName, email, organization, password, role } =
    validatedFields.data;
  try {
    await connectDB();

    const userExists = await User.findOne({ email });

    if (userExists) {
      return { error: "Таны оруулсан имейл хаяг бүртгэлтэй байна!" };
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      lastName,
      firstName,
      email,
      organization,
      password: hashedPassword,
      role,
    });
    return { success: "User registered successfully" };
  } catch (error) {
    console.log("Registration error:", error);
    return {
      error: "Failed to register user",
    };
  }
}
export async function login(values: z.infer<typeof LoginSchema>) {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: validatedFields.error.errors[0].message };
  }
  const { email, password } = validatedFields.data;
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return { success: "User logged in successfully" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };
        default:
          return { error: "Something went wrong" };
      }
    }
    return {error:"Failed to login user"}
  }
}
export async function checkIsAdmin(userId:string){
    try{
        await connectDB();
        const user = await User.findById(userId);
        return user?.role === "admin";
    }catch(error){
        return false;
    }
}
