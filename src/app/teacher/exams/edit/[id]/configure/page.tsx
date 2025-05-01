"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, set } from "date-fns";
import { cn } from "@/lib/utils";
import { ConfigureSchema } from "@/lib/validation"; // таны schema файл
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
import { useEffect, useState } from "react";
import { TimePicker } from "@/components/time/time-picker";
import { createExam, updateExam } from "@/lib/api";
import { generateExamKey } from "@/lib/utils";
import { useExamStore } from "@/store/ExamStore";
import { useRouter } from "next/navigation";
import { ExamInput as ImportedExamInput } from "@/lib/types/interface";
type FormData = z.infer<typeof ConfigureSchema>;

export default function ConfigureForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { exam, setExam } = useExamStore();
  const [totalScore, setTotalScore] = useState<number>(exam?.totalScore || 0);
  const router = useRouter();

  useEffect(() => {
    const questions = exam?.questions ?? [];
    if (questions && questions.length > 0) {
      const total = questions.reduce(
        (acc: number, question: { score?: number | undefined }) =>
          acc + (question.score || 0),
        0
      );
      setTotalScore(total);
    } else {
      setTotalScore(exam?.totalScore || 0);
    }
  }, [exam?.questions]);

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);

      const examData: ImportedExamInput = {
        _id: exam?._id || "",
        title: exam?.title || "",
        description: exam?.description || "",
        questions: exam?.questions || [],
        dateTime: form.getValues("dateTime"),
        duration: form.getValues("time"),
        totalScore: totalScore,
        status: "active",
        key: exam?.key || generateExamKey(),
        createUserById: exam?.createUserById || "",
        createdAt: exam?.createdAt || new Date(),
        updatedAt: new Date(),
      };
      const updateData = await updateExam(exam?._id as string, examData);

      if (updateData) {
        console.log("Шалгалт амжилттай үүсгэгдлээ!");
      }
      router.push("/teacher/exams");
      localStorage.removeItem("exam-storage");
      setTotalScore(0);
    } catch (error) {
      console.error("Алдаа:", error);
      setError("Шалгалт үүсгэхэд алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  const form = useForm<FormData>({
    resolver: zodResolver(ConfigureSchema),
    defaultValues: {
      description: "",
      dateTime: undefined,
      time: 0,
    },
  });

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
          </div>
          <Button type="submit" disabled={loading}>
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
