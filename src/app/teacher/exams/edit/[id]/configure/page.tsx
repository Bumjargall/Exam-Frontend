"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { ConfigureSchema } from "@/lib/validation";
import { useExamStore } from "@/store/ExamStore";
import { createExam, updateExam } from "@/lib/api";
import { generateExamKey } from "@/lib/utils";
import { ExamInput } from "@/lib/types/interface";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { TimePicker } from "@/components/time/time-picker";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Question } from "@/lib/types/interface";

type FormData = z.infer<typeof ConfigureSchema>;

export default function ConfigureForm() {
  const { exam } = useExamStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalScore, setTotalScore] = useState<number>(exam?.totalScore || 0);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(ConfigureSchema),
    defaultValues: {
      title: exam?.title || "",
      description: exam?.description || "",
      dateTime: exam?.dateTime ? new Date(exam.dateTime) : undefined,
      time: exam?.duration || 0,
    },
  });
  const convertedQuestions: Question[] = (exam?.questions || []).map((q) => ({
    _id: q._id || uuidv4(), // ← id шаардлагатай бол үүсгэнэ
    question: q.question,
    score: q.score,
    type: q.type,
    answers: q.answers || [],
  }));

  const parseDuration = (input: string): number => {
    const hourMatch = input.match(/(\d+)\s*h/);
    const minuteMatch = input.match(/(\d+)\s*m/);
    const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
    const minutes = minuteMatch ? parseInt(minuteMatch[1]) : 0;
    return hours * 60 + minutes;
  };

  useEffect(() => {
    const questions = exam?.questions ?? [];
    const total = questions.reduce((acc, q) => acc + (q.score || 0), 0);
    setTotalScore(total || exam?.totalScore || 0);
  }, [exam]);

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      setError(null);
      const dateTime = new Date(data.dateTime.toString());
      const examData: ExamInput = {
        title: data.title,
        description: data.description || "",
        dateTime,
        duration:
          typeof data.time === "string"
            ? parseDuration(data.time)
            : Number(data.time),
        totalScore,
        status: exam?.status || "active",
        key: exam?.key || generateExamKey(),
        createUserById: exam?.createUserById ?? "",
        createdAt: exam?.createdAt ?? new Date(),
        updatedAt: new Date(),
        questions: convertedQuestions as any,
      };
      if (!exam?._id) {
        setError("Шалгалтын ID байхгүй байна.");
        return;
      }
      console.log("Шалгалтын мэдээлэл:----", examData);
      await updateExam(exam?._id as string, examData);

      router.push("/teacher/exams");
      useExamStore.persist.clearStorage();
      setTotalScore(0);
      toast.success("Шалгалт амжилттай шинэчлэгдлээ.");
    } catch (error) {
      console.error("Алдаа:", error);
      setError("Шалгалт үүсгэхэд алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl flex content-center mx-auto border rounded-2xl p-5 items-center mt-[10vh]">
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
                          "w-[280px] justify-start text-left font-normal",
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
            {error && <p className="text-red-500 font-medium">{error}</p>}
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Ачааллаж байна..." : "Шалгалт хадгалах"}
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
