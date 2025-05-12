"use client";
import { useEffect, useState } from "react";
import { Eye, Printer, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StudentWithExamInfo, User } from "@/lib/types/interface";
import { updateUser, getResultByUserId } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/store/useAuth";
import { date } from "zod";

export default function Home() {
  const user = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [studentCode, setStudentCode] = useState("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [exams, setExams] = useState<StudentWithExamInfo[]>([]);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [studentPhone, setStudentPhone] = useState("");
  useEffect(() => {
    const data = user.user;
    if (data?._id) {
      setFirstName(data.firstName || "");
      setLastName(data.lastName || "");
      setEmail(data.email || "");
      setStudentCode(data.studentCode || "");
      setStudentId(data._id);
      setStudentPhone(data.phone);
    }
  }, [user]);

  useEffect(() => {
    if (!studentId) return;
    const fetchExams = async () => {
      try {
        const response = await getResultByUserId(studentId);
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
    const data = user.user; // ← нэмж өг
    if (!data || !data._id) return;
    if (!validateFields()) return;

    try {
      const updated = {
        firstName,
        lastName,
        email,
        studentCode,
        phone: Number(studentPhone),
      };
      const response = await updateUser(data._id, updated);
      if (response.success) {
        // optionally update Zustand state
        user.setAuth({ ...data, ...updated }, user.token!);
        toast.success("Хэрэглэгчийн мэдээлэл амжилттай шинэчлэгдлээ");
        setIsEditing(false);
        setErrors({});
      } else {
        toast.error("Хадгалах үед алдаа гарлаа.");
      }
    } catch (err) {
      console.error("Холболтын алдаа:", err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Profile */}
        <div className="w-full lg:w-1/3 bg-white shadow-md rounded-xl p-6 space-y-6 self-start">
          <div className="flex flex-col items-center space-y-3">
            <img
              className="h-24 w-24 rounded-full"
              src="/profile.jpg"
              alt="Profile"
            />
            <p className="font-semibold text-lg">
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
            {
              name: "studentPhone",
              label: "Утасны дугаар",
              value: studentPhone,
              setter: setStudentPhone,
            },
          ].map((field, idx) => (
            <div key={idx} className="space-y-1">
              <label className="text-sm text-gray-600">{field.label}</label>
              <input
                type="text"
                className={`w-full py-2 px-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  errors[field.name] ? "border-red-500" : "border-gray-300"
                }`}
                placeholder={`${field.label} оруулна уу`}
                value={field.value}
                onChange={(e) => field.setter(e.target.value)}
                readOnly={!isEditing}
              />
              {errors[field.name] && (
                <p className="text-xs text-red-500">{errors[field.name]}</p>
              )}
            </div>
          ))}

          <Button
            variant={isEditing ? "destructive" : "outline"}
            className="w-full"
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          >
            {isEditing ? "Хадгалах" : "Засварлах"}
          </Button>
        </div>

        {/* Exam List */}
        <div className="flex-1 bg-white shadow-md rounded-xl">
          <div className="text-center py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-700">
              Шалгалтын мэдээлэл
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-gray-100 text-gray-600 uppercase">
                <tr>
                  <th className="p-3 text-left">Нэр</th>
                  <th className="p-3 text-left">Шалгалтын Код</th>
                  <th className="p-3 text-left">Огноо</th>
                  <th className="p-3 text-left">Оноо</th>
                  <th className="p-3 text-left">Үйлдэл</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3">{exam.examInfo.title}</td>
                    <td className="p-3 text-center bg-gray-50 rounded-lg">
                      {exam.examInfo.key}
                    </td>
                    <td className="p-3">
                      {new Date(exam.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      {exam.score}/{exam.examInfo.totalScore}
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Link
                          href={`/student/view/${exam.examId}`}
                          className="flex items-center space-x-1 border px-2 py-1 rounded hover:bg-gray-100"
                        >
                          <Eye size={14} />
                          <span>Харах</span>
                        </Link>
                        <button
                          onClick={() => alert("Хэвлэх үйлдэл")}
                          className="flex items-center space-x-1 border px-2 py-1 rounded hover:bg-gray-100"
                        >
                          <Printer size={14} />
                          <span>Хэвлэх</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {exams.length === 0 && (
              <p className="text-center py-6 text-gray-500">
                Шалгалтын мэдээлэл алга байна
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
