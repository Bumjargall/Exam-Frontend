import Email from "next-auth/providers/email";
import * as z from "zod";

export const RegisterSchema = z.object({
  lastName: z
    .string()
    .min(1, {
      message: "Нэр нь хамгийн багадаа 2 тэмдэгттэй байх ёстой!",
    })
    .regex(/^[A-Za-zА-Яа-яЁё\s]+$/, {
      message: "Нэр нь зөвхөн үсэг агуулах ёстой!",
    }),
  firstName: z
    .string()
    .min(1, {
      message: "Нэр нь хамгийн багадаа 2 тэмдэгттэй байх ёстой!",
    })
    .regex(/^[A-Za-zА-Яа-яЁё\s]+$/, {
      message: "Нэр нь зөвхөн үсэг агуулах ёстой!",
    }),
  email: z.string().email({
    message: "Таны оруулсан имейл хаяг алдаатай байна!",
  }),
  organization: z
    .string()
    .min(1, { message: "Хамгийн багадаа 2 тэмдэгттэй байх ёстой!" })
    .regex(/^[A-Za-zА-Яа-яЁё\s]+$/, {
      message: "Нэр нь зөвхөн үсэг агуулах ёстой!",
    }),
  password: z
    .string()
    .min(4, { message: "Нууц үгээ шалгана уу!" })
    .regex(/[0-9]/, "Нууц үг тоо агуулсан байх ёстой!"),
  role: z.enum(["admin", "student", "teacher"]),
});
export const LoginSchema = z.object({
  email: z.string().email({
    message: "Таны оруулсан имейл хаяг алдаатай байна!",
  }),
  password: z
    .string()
    .min(4, { message: "Нууц үгээ шалгана уу!" })
    .regex(/[0-9]/, "Нууц үг тоо агуулсан байх ёстой!"),
});
export const ConfigureSchema = z.object({
  title: z.string().min(1, {
    message: "Шалгалтын нэрийг оруулна уу!",
  }),
  description: z.string().optional(),
  dateTime: z.coerce.date({
    required_error: "Шалгалтын огноог оруулна уу!",
    invalid_type_error: "Огнооны формат буруу байна!",
  }),
  time: z.coerce
    .number()
    .min(1, { message: "Хугацаа хамгийн багадаа 1 минут байх ёстой" }),
});
export const UserSchema = z.object({
  lastName: z
    .string()
    .min(1, {
      message: "Нэр нь хамгийн багадаа 2 тэмдэгттэй байх ёстой!",
    })
    .regex(/^[A-Za-zА-Яа-яЁё\s]+$/, {
      message: "Нэр нь зөвхөн үсэг агуулах ёстой!",
    }),
  firstName: z
    .string()
    .min(1, {
      message: "Нэр нь хамгийн багадаа 2 тэмдэгттэй байх ёстой!",
    })
    .regex(/^[A-Za-zА-Яа-яЁё\s]+$/, {
      message: "Нэр нь зөвхөн үсэг агуулах ёстой!",
    }),
  phone: z.number().min(8, { message: "Утасны дугаар 8 оронтой байх ёстой!" }),
  email: z.string().email({
    message: "Таны оруулсан имейл хаяг алдаатай байна!",
  }),
  password: z
    .string()
    .min(4, { message: "Нууц үгээ шалгана уу!" })
    .regex(/[0-9]/, "Нууц үг тоо агуулсан байх ёстой!"),
});
export type UserSchema = z.infer<typeof UserSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type ConfigureSchema = z.infer<typeof ConfigureSchema>;
