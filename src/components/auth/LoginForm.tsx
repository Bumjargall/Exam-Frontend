"use client";
import { LoginSchema } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CardWrapper from "./card-wrapper";
import { useAuth } from "@/store/useAuth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import * as z from "zod";
import { login } from "@/lib/actions/auth-action";
import Navbar from "../navbar/NavbarPublic";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
type FormData = z.infer<typeof LoginSchema>;
const LoginForm = () => {
  const { setAuth } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);

    try {
      const userData = await login(data.email, data.password);
      //console.log("Амжилттай нэвтэрлээ:", userData?.user);
      //console.log("Амжилттай нэвтэрлээ:", userData?.token);
      const role = userData?.user.role;
      //localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", userData.token);
      localStorage.setItem("user", JSON.stringify(userData.user));
      setAuth(userData.user, userData.token);

      switch (role) {
        case "teacher":
          window.location.assign("/teacher/exams");
          break;
        case "admin":
          window.location.assign("/admin/exams");
          break;
        case "student":
          window.location.assign("/student");
          break;
        default:
          window.location.assign("/");
          break;
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };
  return (
    <CardWrapper
      label="Хэрэглэгчийн эрхээр нэвтрэх"
      title="Нэвтрэх"
      backButtonHref="/register"
      backButtonLabel="Танд бүртгэл байхгүй юу? Бүртгүүлэх"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Цахим шуудан</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      autoComplete="email"
                      placeholder="Цахим шуудангаа оруулна уу!"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Нууц үг</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Нууц үгээ оруулна уу!"
                      autoComplete="current-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {error && <p className="text-red-500 text-sm my-4">{error}</p>}
          <Button
            type="submit"
            className="w-full bg-green-600"
            disabled={loading}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loading ? "Нэвтэрч байна..." : "Нэвтрэх"}
          </Button>
        </form>
      </Form>
      <p
        className="text-sm text-slate-500 mt-4 text-right cursor-pointer hover:underline"
        onClick={() => router.push("/forgot-password")}
      >
        Нууц үг мартсан уу?
      </p>
    </CardWrapper>
  );
};

export default LoginForm;
