"use client";
import { RegisterSchema, RegisterInput } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CardWrapper from "./card-wrapper";
import { Label } from "@/components/ui/label";

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
import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { registerUser } from "@/lib/api";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { error } from "console";

const RegisterForm = () => {
  const router = useRouter();
  const form = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      organization: "",
      phone: "",
      password: "",
      role: "student",
    },
  });
  const onSubmit = async (data: RegisterInput) => {
    try {
      if (data.organization) {
        data.organization = "NaN";
      }
      const newUser = await registerUser(data);
      if (!newUser) {
        toast.error("Хэрэглэгчийн бүртгэл үүсгэх үед алдаа гарлаа: ");
      }
      console.log("new user------->>>>>>", newUser);
      const data2 = newUser.json();
      console.log("new user------->>>>>>", data2);

      toast.success(`Хэрэглэгчийн бүртгэл амжилттай үүслээ.`);
      router.push("/login");
    } catch (err: any) {
      console.log("eererere------->>>>>>", err);
      toast.error(
        err.message || "Бүртгэл үүсгэхэд алдаа гарлаа. Та түр хүлээнэ үү..."
      );
    }
  };
  return (
    <CardWrapper
      label=""
      title="Бүртгүүлэх"
      backButtonHref="/login"
      backButtonLabel="Та бүртгэлтэй юу? Нэвтрэх"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="flex space-x-4">
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Овог</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Овгоо оруулна уу!" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Нэр</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Нэрээ оруулна уу!" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Утасны дугаараа оруулна уу!</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="phone"
                      placeholder="Утасны дугаараа оруулна уу!"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="organization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Organization оруулна уу!" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Хэрэглэгчийн төрөл</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="teacher" id="teacher" />
                        <Label htmlFor="teacher">Багш</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="student" id="student" />
                        <Label htmlFor="student">Сурагч</Label>
                      </div>
                    </RadioGroup>
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
          <Button type="submit" className="w-full">
            Бүртгүүлэх
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default RegisterForm;
