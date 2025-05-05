"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, set } from "date-fns";
import { cn } from "@/lib/utils";
import { UserSchema } from "@/lib/validation";
import { number, z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCallback, useEffect, useState } from "react";
import { TimePicker } from "@/components/time/time-picker";
import { createExam } from "@/lib/api";
import { generateExamKey } from "@/lib/utils";
import { useExamStore } from "@/store/ExamStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type FormData = z.infer<typeof UserSchema>;

export default function ConfigureForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const router = useRouter();
  const [isEditingName, setIsEditingName] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user || !user.user._id) {
      console.error("Хэрэглэгчийн бүртгэл...");
    }
    setUserId(user.user._id);
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);

      const { firstName, lastName, email, phone } = data;
      toast.success("Шалгалт амжилттай үүсгэгдлээ!");
    } catch (error) {
      console.error("Алдаа:", error);
      setError("Шалгалт үүсгэхэд алдаа гарлаа.");
      toast.error("Шалгалт үүсгэхэд алдаа гарлаа.", {
        description: "Таны бүх өгөгдөл хадгалагдсан байна. Дахин оролдоно уу.",
      });
    } finally {
      setLoading(false);
    }
  };

  const form = useForm<FormData>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: undefined,
      email: "",
    },
  });

  return (
    <div className="max-w-4xl mx-auto border rounded-2xl p-5 mt-[10vh]">
      <p className="text-center text-2xl mb-10 border-b pb-5">
        Хэрэглэгчийн мэдээлэл
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-8">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel>Шалгалтын нэр</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="title"
                      placeholder="Шалгалтын нэрээ оруулна уу!"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel>Шалгалтын тайлбар</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="description"
                      placeholder="Тайлбараа оруулна уу!"
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
                <FormItem className="flex flex-col items-start">
                  <FormLabel>Шалгалтын хугацаа</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="Хугацаа (минут)!"
                    />
                  </FormControl>
                  <FormDescription>
                    Шалгалт хугацаагаа оруулна уу!.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel>Шалгалтын хугацаа</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="Хугацаа (минут)!"
                    />
                  </FormControl>
                  <FormDescription>
                    Шалгалт хугацаагаа оруулна уу!.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Ачааллаж байна..." : "Шалгалт үүсгэх"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
