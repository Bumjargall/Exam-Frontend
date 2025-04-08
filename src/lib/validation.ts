import Email from "next-auth/providers/email"
import * as z from "zod"

export const RegisterSchema = z.object({
    lastName: z.string().min(1,{
        message:"Нэр нь хамгийн багадаа 2 тэмдэгттэй байх ёстой!"
    }).regex(/^[A-Za-zА-Яа-яЁё\s]+$/,{message:"Нэр нь зөвхөн үсэг агуулах ёстой!"}),
    firstName: z.string().min(1,{
        message:"Нэр нь хамгийн багадаа 2 тэмдэгттэй байх ёстой!"
    }).regex(/^[A-Za-zА-Яа-яЁё\s]+$/,{message:"Нэр нь зөвхөн үсэг агуулах ёстой!"}),
    email: z.string().email({
        message:"Таны оруулсан имейл хаяг алдаатай байна!"
    }),
    organization: z.string().min(1,{message:"Хамгийн багадаа 2 тэмдэгттэй байх ёстой!"}).regex(/^[A-Za-zА-Яа-яЁё\s]+$/,{message:"Нэр нь зөвхөн үсэг агуулах ёстой!"}),
    password: z.string().min(6,{message:"Нууц үг сул байна!"}).regex(/[A-Z]/,"Нууц үг тэмдэгт агуулсан байх ёстой!").regex(/[a-z]/,"Нууц үг тэмдэгт агуулсан байх ёстой!").regex(/[0-9]/,"Нууц үг тоо агуулсан байх ёстой!").regex(/[@$%!*?&]/,"Нууц үг тусгай тэмдэгт агуулсан байх шаардлагатай")
})
export const LoginSchema = z.object({
    email: z.string().email({
        message:"Таны оруулсан имейл хаяг алдаатай байна!"
    }),
    password: z.string().min(6,{message:"Нууц үг сул байна!"}).regex(/[A-Z]/,"Нууц үг тэмдэгт агуулсан байх ёстой!").regex(/[a-z]/,"Нууц үг тэмдэгт агуулсан байх ёстой!").regex(/[0-9]/,"Нууц үг тоо агуулсан байх ёстой!").regex(/[@$%!*?&]/,"Нууц үг тусгай тэмдэгт агуулсан байх шаардлагатай")
})