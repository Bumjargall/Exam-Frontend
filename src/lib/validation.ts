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
    password: z.string().min(4,{message:"Нууц үгээ шалгана уу!"}).regex(/[0-9]/,"Нууц үг тоо агуулсан байх ёстой!"),
    role: z.enum(["admin","student","teacher"])
})
export const LoginSchema = z.object({
    email: z.string().email({
        message:"Таны оруулсан имейл хаяг алдаатай байна!"
    }),
    password: z.string().min(4,{message:"Нууц үгээ шалгана уу!"}).regex(/[0-9]/,"Нууц үг тоо агуулсан байх ёстой!")
})
export type RegisterInput = z.infer<typeof RegisterSchema>
export type LoginInput = z.infer<typeof LoginSchema>