"use client";
import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StudentWithExamInfo } from "@/lib/types/interface";
import {
  updateUser,
  getResultByUserId,
  getResultByUserAndExam,
} from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/store/useAuth";

export default function Home() {
  const user = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [studentCode, setStudentCode] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [studentId, setStudentId] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [exams, setExams] = useState<StudentWithExamInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentResult, setStudentResult] = useState<any>(null);

  useEffect(() => {
    const data = user.user;
    if (data?._id) {
      setFirstName(data.firstName || "");
      setLastName(data.lastName || "");
      setEmail(data.email || "");
      setStudentCode(data.studentCode || "");
      setStudentPhone(data.phone || "");
      setStudentId(data._id);
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
      } finally {
        setLoading(false);
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
    const data = user.user;
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
        <div className="w-full lg:w-1/3 bg-white shadow-lg rounded-2xl p-6 space-y-6 self-start border border-gray-100">
          <div className="flex flex-col items-center space-y-3">
            <img
              className="h-24 w-24 rounded-full border-4 border-sky-200 shadow hover:scale-105 transition-transform duration-300"
              src="/profile.jpg"
              alt="Profile"
            />
            <p className="font-bold text-xl text-gray-800">
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
              <label className="text-sm font-semibold text-gray-600">
                {field.label}
              </label>
              <input
                type="text"
                className={`w-full py-2.5 px-4 border rounded-xl text-sm shadow-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-sky-400 ${
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
            className={`w-full py-2 text-sm font-semibold rounded-xl transition cursor-pointer duration-300
    ${
      isEditing
        ? "bg-red-500 hover:bg-red-600 text-white"
        : "bg-green-500 hover:bg-green-600 text-white"
    }`}
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          >
            {isEditing ? "Хадгалах" : "Засварлах"}
          </Button>
        </div>

        {/* Exam List */}
        <div className="flex-1 bg-white shadow-md rounded-xl">
          <div className="text-center py-4 border-b bg-green-500 rounded-t-xl">
            <h2 className="text-xl font-semibold text-white">
              Шалгалтын мэдээлэл
            </h2>
          </div>
          <div className="overflow-x-auto min-w-[600px]">
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-gray-100 text-gray-700 uppercase font-semibold">
                <tr>
                  <th className="p-3 text-left">Нэр</th>
                  <th className="p-3 text-left">Код</th>
                  <th className="p-3 text-left">Огноо</th>
                  <th className="p-3 text-left">Оноо</th>
                  <th className="p-3 text-left">Үйлдэл</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-400">
                      Ачааллаж байна...
                    </td>
                  </tr>
                ) : exams.length > 0 ? (
                  exams.map((exam, index) => (
                    <tr
                      key={index}
                      className="border-b hover:bg-blue-50 transition-colors"
                    >
                      <td className="p-3">{exam.examInfo.title}</td>
                      <td className="p-3">{exam.examInfo.key}</td>
                      <td className="p-3">
                        {new Date(exam.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-green-600 font-medium">
                        {exam.score != null ? exam.score.toFixed(1) : "—"}/
                        {exam.examInfo.totalScore}
                      </td>
                      <td className="p-3">
                        <Link
                          href={`/student/view/${exam.examId}`}
                          className="inline-flex items-center space-x-1 border px-3 py-1 rounded-lg hover:bg-gray-100 text-blue-400 text-sm transition"
                        >
                          <Eye size={14} />
                          <span>Харах</span>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-500">
                      Шалгалтын мэдээлэл алга байна
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
