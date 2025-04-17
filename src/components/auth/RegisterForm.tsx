"use client"
import { RegisterSchema } from "@/lib/validation"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import CardWrapper from "./card-wrapper"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import { Input } from "../ui/input"
import {Button} from "@/components/ui/button"
import * as z from "zod"
import { useState } from "react"

const RegisterForm = () => {

    const form = useForm({
        resolver: zodResolver(RegisterSchema),
        defaultValues:{
            firstName:"",
            lastName:"",
            email:"",
            organization:"",
            password:""
        }
    })
const onSubmit = (data: z.infer<typeof RegisterSchema>) =>{
}
  return (
    <CardWrapper
    label = "Бүртгэл үүсгэх"
    title = "Бүртгүүлэх"
    backButtonHref="/login"
    backButtonLabel = "Та бүртгэлтэй юу? Нэвтрэх">
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
                                <Input {...field} placeholder="Овгоо оруулна уу!"/>
                            </FormControl>
                            <FormMessage/>
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
                                <Input {...field} placeholder="Нэрээ оруулна уу!"/>
                            </FormControl>
                            <FormMessage/>
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
                                <Input {...field} type="email" placeholder="Цахим шуудангаа оруулна уу!"/>
                            </FormControl>
                            <FormMessage/>
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
                                <Input {...field} placeholder="Organization оруулна уу!"/>
                            </FormControl>
                            <FormMessage/>
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
                                <Input {...field} type="password" placeholder="Нууц үгээ оруулна уу!"/>
                            </FormControl>
                            <FormMessage/>
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
  )
}

export default RegisterForm