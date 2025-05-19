"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, set } from "date-fns";
import { cn } from "@/lib/utils";
import { ConfigureSchema } from "@/lib/validation";
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
import { useAuth } from "@/store/useAuth";
import { generateKey } from "crypto";

type FormData = z.infer<typeof ConfigureSchema>;

export default function ConfigureForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [examKey, setExamKey] = useState("");
  const [totalScore, setTotalScore] = useState<number>(0);
  const { exam, setExam } = useExamStore();
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const questions = exam?.questions ?? [];
    const calculatedTotal = questions.reduce(
      (acc, question) => acc + (question.score || 0),
      0
    );
    setTotalScore(calculatedTotal || exam?.totalScore || 0);
  }, [exam?.questions, exam?.totalScore]);
  useEffect(() => {
    const initialize = () => {
      if (!user) return;
      const id = user._id;
      if (id) {
        setUserId(id);
      } else {
        console.warn("Хэрэглэгчийн ID олдсонгүй");
      }
      const key = generateExamKey();
      setExamKey(key);
    };
    try {
      initialize();
    } catch (err) {
      console.error(
        "💥 localStorage-с хэрэглэгчийн мэдээлэл авахад алдаа:",
        err
      );
    }
  }, []);
  const resetExamForm = useCallback(() => {
    router.push("/teacher/exams");
    localStorage.removeItem("exam-storage");
    setExamKey("");
    setTotalScore(0);
  }, [router]);

  const onSubmit = async (data: FormData) => {
    const now = new Date();
    const selected = new Date(data.dateTime);
    if (selected < now) {
      toast.error("Өнгөрсөн хугацаанд шалгалт товлох боломжгүй.");
      return;
    }
    try {
      setLoading(true);

      const { title, description } = data;

      const duration =
        typeof data.time === "string" ? parseInt(data.time) : Number(data.time);
      const dateTime =
        data.dateTime instanceof Date ? data.dateTime : new Date(data.dateTime);
      const examData = await createExam({
        title,
        description: description as string,
        dateTime,
        duration,
        totalScore,
        status: "active",
        key: examKey,
        questions: exam?.questions || [],
        createUserById: userId as string,
        createdAt: new Date(),
      });
      if (!examData) {
        throw new Error("Шалгалт үүсгэхэд алдаа гарлаа.");
      }

      toast.success("Шалгалт амжилттай үүсгэгдлээ!");
      setTimeout(() => {
        resetExamForm();
      }, 1000);
    } catch (error) {
      toast.error("Шалгалт үүсгэхэд алдаа гарлаа.", {
        description: "Таны бүх өгөгдөл хадгалагдсан байна. Дахин оролдоно уу.",
      });
    } finally {
      setLoading(false);
    }
  };

  const form = useForm<FormData>({
    resolver: zodResolver(ConfigureSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      dateTime: undefined,
      time: 0,
    },
  });

  return (
    <div className="max-w-3xl mx-auto border rounded-2xl p-5 mt-[10vh]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-8">
            <FormField
              control={form.control}
              name="title"
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
              name="description"
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
              name="dateTime"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel>Шалгалтын хуваарь</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[280px] justify-start text-left font-normal cursor-pointer",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP HH:mm:ss")
                        ) : (
                          <span>Хуваарь</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        disabled={{ before: new Date() }}
                      />
                      <div className="p-3 border-t border-border">
                        <TimePicker
                          setDate={field.onChange}
                          date={field.value}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Шалгалт эхлэх өдрөө оруулна уу!.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
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
          <Button type="submit" className="bg-green-500" disabled={loading}>
            {loading ? "Ачааллаж байна..." : "Шалгалт үүсгэх"}
          </Button>
        </form>
      </Form>
    </div>
  );

  function CustomFormItem({
    label,
    children,
  }: {
    label: string;
    children: React.ReactNode;
  }) {
    return (
      <div className="flex flex-col items-start">
        <label className="font-semibold">{label}</label>
        {children}
      </div>
    );
  }
}
