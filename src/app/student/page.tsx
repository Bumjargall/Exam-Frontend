"use client";
import { useEffect, useState } from "react";
import { Eye, Printer, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StudentWithExamInfo, User } from "@/lib/types/interface";
import { updateUser, getResultByUserId } from "@/lib/api";
import { toast } from "sonner";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [studentCode, setStudentCode] = useState("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [exams, setExams] = useState<StudentWithExamInfo[]>([]);
  const [studentId, setStudentId] = useState<string | null>(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    if (!userData || !userData.user?._id) return;
    const { user } = userData;
    setUser(user);
    setFirstName(user.firstName || "");
    setLastName(user.lastName || "");
    setEmail(user.email || "");
    setStudentCode(user.studentCode || "");
    setStudentId(user._id);
  }, []);
  useEffect(() => {
    const fetchExams = async () => {
      if (!studentId) return;
      try {
        const response = await getResultByUserId(studentId);
        console.log("--------", response.data);
        setExams(response.data);
      } catch (err) {
        console.error("Алдаа:", err);
      }
    };
    fetchExams();
  }, [studentId]);

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};
    if (!lastName.trim()) newErrors.lastName = "Овог хоосон байна";
    if (!firstName.trim()) newErrors.firstName = "Нэр хоосон байна";
    if (!studentCode.trim()) newErrors.studentCode = "Оюутны код шаардлагатай";
    if (!email.trim()) {
      newErrors.email = "Имэйл хоосон байна";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Имэйл хаяг буруу байна";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!user) return;
    if (!validateFields()) return;

    try {
      const updated = { firstName, lastName, email, studentCode };
      const response = await updateUser(user._id as string, updated);
      if (response.success) {
        const updatedUser = { ...user, ...updated };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify({ user: updatedUser }));
        toast.success(
          "Амжилттай хэрэглэгчийн мэдээлэл амжилттай шинэчлэгдлээ "
        );
        setIsEditing(false);
        setErrors({});
      } else {
        alert("Хадгалах үед алдаа гарлаа.");
      }
    } catch (err) {
      console.error("Холболтын алдаа:", err);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-8 space-x-5">
        {/* Profile Panel */}
        <div className="col-start-1 col-end-3 mt-5 border border-gray-900 bg-gray-white rounded-lg">
          <div className="flex flex-col space-y-3 p-5">
            <div className="flex flex-col items-center space-y-3">
              <img
                className="h-24 rounded-full"
                src="/profile.jpg"
                alt="Profile"
              />
              <p className="font-medium">
                {lastName} {firstName}
              </p>
            </div>

            {[
              {
                name: "lastName",
                label: "Овог",
                value: lastName,
                setter: setLastName,
              },
              {
                name: "firstName",
                label: "Нэр",
                value: firstName,
                setter: setFirstName,
              },
              {
                name: "email",
                label: "Цахим шуудан",
                value: email,
                setter: setEmail,
              },
              {
                name: "studentCode",
                label: "Оюутны код",
                value: studentCode,
                setter: setStudentCode,
              },
            ].map((field, idx) => (
              <div
                key={idx}
                className="space-y-1 border-b border-b-gray-300 pb-4"
              >
                <label className="text-gray-500">{field.label}</label>
                <input
                  type="text"
                  className={`py-2 w-full border rounded-xl pl-2 ${
                    errors[field.name] ? "border-red-500" : "border-gray-900"
                  }`}
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  readOnly={!isEditing}
                />
                {errors[field.name] && (
                  <p className="text-sm text-red-500">{errors[field.name]}</p>
                )}
              </div>
            ))}

            <Button
              variant={isEditing ? "destructive" : "outline"}
              onClick={() => {
                if (isEditing) handleSave();
                else setIsEditing(true);
              }}
            >
              {isEditing ? "Хадгалах" : "Засварлах"}
            </Button>
          </div>
        </div>

        {/* Exam Panel - unchanged */}
        <div className="col-span-4 col-start-3 bg-white mx-auto mt-5 rounded-lg">
          <div className="text-center text-xl text-black font-medium py-4 border-t border-l border-r border-gray-200">
            <h1>Шалгалтын мэдээлэл</h1>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full table-fixed border-separate border-spacing-x-1 border-spacing-y-2 bg-white shadow-md border rounded-b-lg">
              <thead>
                <tr className="text-gray-700 text-sm">
                  <th className="px-4 py-1 text-left">Шалгалтын нэр</th>
                  <th className="px-4 py-1 text-left">Шалгалтын код</th>
                  <th className="px-4 py-1 text-left">Үүсгэсэн хугацаа</th>
                  <th className="px-4 py-1 text-left">Оноо</th>
                  <th className="px-4 py-1 text-left"></th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam, index) => (
                  <tr key={index}>
                    <td className="px-4 py-1 rounded-2xl">
                      {exam.examInfo.title}
                    </td>
                    <td className="px-4 py-1 bg-gray-100 rounded-lg text-center hover:bg-gray-200">
                      {exam.examInfo.key}
                    </td>
                    <td className="px-4 py-1">
                      {new Date(exam.examInfo.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-1">
                      {exam.score}/{exam.examInfo.totalScore}
                    </td>
                    <td className="px-4 py-1">
                      <div className="flex space-x-3 text-gray-900">
                        <Link
                          href={`/student/view/${exam._id}`}
                          className="border p-2 rounded-lg hover:bg-white"
                        >
                          <Eye size={16} />
                        </Link>
                        <Link
                          href=""
                          className="border p-2 rounded-lg hover:bg-white"
                        >
                          <Printer size={16} />
                        </Link>
                        <Link
                          href=""
                          className="border p-2 rounded-lg hover:bg-white"
                        >
                          <Trash2 size={16} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
