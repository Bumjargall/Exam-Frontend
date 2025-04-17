"use client";
import { LoginSchema } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CardWrapper from "./card-wrapper";
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
import {login} from "@/lib/actions/auth-action"
import Navbar from "../navbar/NavbarPublic";
import { useRouter } from "next/navigation";
const LoginForm =  () => {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
const router = useRouter();
  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    setLoading(true);
    setError(null);

    try {
      console.log(data)
      const userData = await login(data.email, data.password); // login функцийг дуудах
      console.log("Амжилттай нэвтэрлээ:", userData?.data.user);
      console.log("Амжилттай нэвтэрлээ:", userData?.data.token);
      let role = userData?.data.user.role
      localStorage.setItem("user",JSON.stringify(userData?.data))

      router.push("/")
    } catch (err: any) {
      setError(err.message);
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {error && <p className="text-red-500 text-sm my-4">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Түр хүлээнэ үү..." : "Нэвтрэх"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default LoginForm;
