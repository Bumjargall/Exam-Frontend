import mongoose, { ObjectId, Types } from "mongoose";
import { ExamInput } from "@/lib/types/interface";
import { Carter_One } from "next/font/google";
import { RegisterInput } from "./validation";
//import { useParams } from "next/navigation";

// Сервертэй холбогдож байгаа эсэхийг шалгах
const getBackendUrl = (): string => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backendUrl) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL тодорхойлогдоогүй байна.");
  }
  //console.log("Backend URL: ", backendUrl);
  return backendUrl;
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Серверээс хариу ирсэнгүй");
  }
  return await response.json();
};

// API-тай холбогдох функц
export const fetchHelloMessage = async () => {
  try {
    const response = await fetch(getBackendUrl());
    return await handleResponse(response);
  } catch (err) {
    console.log("Алдаа: ", err);
    throw err;
  }
};

{
  /*USER*/
}

export const registerUser = async (data: RegisterInput) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Бүртгэхэд алдаа гарлаа");
  }
  return await res.json();
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await fetch(`${getBackendUrl()}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    return await handleResponse(response);
  } catch (err) {
    console.error("Нэвтрэх үед алдаа гарлаа:", err);
    throw err;
  }
};

//Нууц үг мартсан тохиолдолд
//await forgotPassword("example@email.com");
export const forgotPassword = async (email: string) => {
  try {
    const response = await fetch(`${getBackendUrl()}/users/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) throw new Error("Алдаа");
    return await handleResponse(response);
  } catch (err) {
    console.error("Нууц үг мартсан үед алдаа гарлаа:", err);
    throw err;
  }
};
export const checkPassword = async (userId: string, password: string) => {
  try {
    const response = await fetch(`${getBackendUrl()}/users/check-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, password }),
    });
    return await response.json();
  } catch (err) {
    console.error("checkPassword алдаа", err);
    throw err;
  }
};
//Нууц үг шинэчлэхcheckPassword
//await resetPassword(tokenFromEmail, "newStrongPassword123");
//http://localhost:8000/reset-password/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZWEzMWEwMzkzZGZiZjRkNThlNWMyMSIsImlhdCI6MTc0NjQxODQ4NCwiZXhwIjoxNzQ2NDE5Mzg0fQ.ecIyu9xCzdu7_x6lLNCoEpboDoFOQ63cRsiDIOuY2rE

export const resetPassword = async (token: string, password: string) => {
  try {
    const response = await fetch(`${getBackendUrl()}/reset-password/${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });
    console.log(response);
    if (!response.ok) throw new Error("Алдаа");
    return await handleResponse(response);
  } catch (err) {
    console.error("Нууц үг шинэчлэх үед алдаа гарлаа:", err);
    throw err;
  }
};
// Имэйлээр сэргээх холбоос илгээх
export const sendResetEmail = async (toEmail: string, resetLink: string) => {
  try {
    const response = await fetch(`${getBackendUrl()}/api/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ toEmail, resetLink }),
    });
    return await handleResponse(response);
  } catch (err) {
    console.error("Имэйл илгээх үед алдаа гарлаа:", err);
    throw err;
  }
};

//role -р нь хэрэглэгчийн тоог буцаах
export const getRoleByUserCount = async (role: string) => {
  try {
    const res = await fetch(`${getBackendUrl()}/users/role?role=${role}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await handleResponse(res);
  } catch (err) {
    console.error("Role илгээх үед алдаа гарлаа:", err);
    throw err;
  }
};

{
  /* EXAM */
}

export const getByUserAllExams = async (userId: string) => {
  try {
    const response = await fetch(`${getBackendUrl()}/exams/user/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await handleResponse(response);
  } catch (err) {
    console.error("Хэрэглэгчийн шалгалтуудыг авахад алдаа гарлаа:", err);
    throw err;
  }
};
// Багшийн createByUserId - аар шалгалт шүүх
export const getExamCreateByUser = async (userId: string) => {
  try {
    const response = await fetch(
      `${getBackendUrl()}/exams/createByteacher/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("api response", response);
    return await handleResponse(response);
  } catch (err) {
    console.error("Багшын шалгалтуудыг авахад алдаа гарлаа:", err);
    throw err;
  }
};

// Шалтгалт үүсгэх
export const createExam = async (examData: ExamInput) => {
  try {
    const examDataWithUserId = {
      ...examData,
      createUserById: examData.createUserById, // Энд зүгээр string хэлбэрээр үлдээнэ
    };
    console.log("examDataWithUserId", examDataWithUserId);

    const response = await fetch(`${getBackendUrl()}/exams/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(examDataWithUserId),
    });
    return await handleResponse(response);
  } catch (err) {
    console.error("Шалгалт үүсгэхэд алдаа гарлаа:", err);
    throw err;
  }
};
// Шалтгалтын жагсаалтыг авах
export const getExams = async () => {
  try {
    const response = await fetch(`${getBackendUrl()}/exams`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await handleResponse(response);
  } catch (err) {
    console.error("Шалтгалтын жагсаалтыг авахад алдаа гарлаа:", err);
    throw err;
  }
};

// Шалгалтын мэдээллийг авах - examId
export const getExamById = async (examId: string) => {
  try {
    const response = await fetch(`${getBackendUrl()}/exams/${examId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await handleResponse(response);
  } catch (err) {
    console.error("Шалгалтын мэдээллийг авахад алдаа гарлаа:", err);
    throw err;
  }
};

export const deleteExam = async (examId: mongoose.Types.ObjectId) => {
  try {
    const response = await fetch(`${getBackendUrl()}/exams/${examId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const result = await handleResponse(response);
    return result;
  } catch (err) {
    console.error("Шалгалтын мэдээллийг авахад алдаа гарлаа:", err);
    throw err;
  }
};
//Шалгалтаас key авах
///exams/by-key/:key
export const getExamByKey = async (key: string) => {
  try {
    const response = await fetch(`${getBackendUrl()}/exams/by-key/${key}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await handleResponse(response);
  } catch (err) {
    console.error("Шалгалтын мэдээллийг авахад алдаа гарлаа:", err);
    throw err;
  }
};

export const getExamCount = async () => {
  const res = await fetch(`${getBackendUrl()}/exams/count`);
  return await handleResponse(res);
};

export const getRecentExams = async (limit = 5) => {
  const res = await fetch(`${getBackendUrl()}/exams/recent?limit=${limit}`);
  //console.log("api/res----->",res)
  if (!res.ok) throw new Error("Сүүлийн шалгалтыг татаж чадсангүй");
  const data = await res.json();
  //console.log("getRecentExams API хариу:", data.data);
  return data;
};

//exams chart data
export const getExamChartData = async ()=> {
  const res = await fetch(`${getBackendUrl()}/exams/chart`)
  if(!res.ok) throw new Error("Chart өгөгдөл татахад алдаа гарлаа");
  console.log("res--------> ",res)
  return await res.json()
}

export const getTeachers = async () => {
  const res = await fetch(`${getBackendUrl()}/users/role-teachers`);
  if (!res.ok) throw new Error("Багш нарын мэдээлэл татаж чадсангүй");
  const data = await res.json()
  console.log("teachers=------>", data)
  return data;
};

{
  /* RESULT */
}
//All Result => createrUserId === login userId
export const getResultByCreateUser = async (userId: string) => {
  try {
    const response = await fetch(
      `${getBackendUrl()}/monitoring/by-creator/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return await handleResponse(response);
  } catch (err) {
    console.error("Шалгалтын мэдээллийг авахад алдаа гарлаа:", err);
    throw err;
  }
};
// Шалгалтын мэдээллийг шинэчлэх
export const updateExam = async (examId: string, examData: ExamInput) => {
  try {
    const response = await fetch(`${getBackendUrl()}/exams/${examId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(examData),
    });
  } catch (err) {
    console.error("Шалгалтын мэдээллийг шинэчлэхэд алдаа гарлаа:", err);
    throw err;
  }
};
//зөвхөн шалгалтын төлөв өөрчлөх
export const updateExamStatus = async (examId: string, status: string) => {
  try {
    const response = await fetch(`${getBackendUrl()}/exams/${examId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ status }),
    });
    return await handleResponse(response);
  } catch (err) {
    console.error("Шалгалтын төлвийг шинэчлэхэд алдаа гарлаа:", err);
    throw err;
  }
};
export const getExamByStudent = async (studentId: string) => {
  try {
    const response = await fetch(`${getBackendUrl()}/exams/user/${studentId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await handleResponse(response);
  } catch (err) {
    console.error("Шалгалтын мэдээллийг авахад алдаа гарлаа:", err);
    throw err;
  }
};

// Шалгалт өгсөн оюутнуудын мэдээлэл, шалгалтыг авах
export const getResultByUsers = async (examId: string) => {
  try {
    const response = await fetch(
      `${getBackendUrl()}/monitoring/by-exam/${examId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const json = await response.json();
    console.log("✅ getResultByUsers response:", json);
    return json;
  } catch (err) {
    console.error("Шалгалт өгсөн оюутны мэдээллийг авахад алдаа гарлаа:", err);
    throw err;
  }
};

export const updateUser = async (userId: string, userData: any) => {
  try {
    const response = await fetch(`${getBackendUrl()}/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(userData),
    });
    return await handleResponse(response);
  } catch (err) {
    console.error("Хэрэглэгчийн мэдээллийг шинэчлэхэд алдаа гарлаа:", err);
    throw err;
  }
};
//result доторх шалгалтууд
export const getSubmittedExams = async () => {
  try {
    const response = await fetch(
      `${getBackendUrl()}/monitoring/submitted/exams`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return await handleResponse(response);
  } catch (err) {
    console.error("Шалгалт өгсөн шалгалтуудыг авахад алдаа гарлаа:", err);
    throw err;
  }
};

//Сурагчын өгсөн шалгалт
export const getResultByUserId = async (userId: string) => {
  try {
    const response = await fetch(
      `${getBackendUrl()}/monitoring/by-user/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return await handleResponse(response);
  } catch (err) {
    console.error("Шалгалт өгсөн оюутны мэдээллийг авахад алдаа гарлаа:", err);
    throw err;
  }
};

export const deleteByUser = async (userId: string) => {
  try {
    const response = await fetch(
      `${getBackendUrl()}/users/${userId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return await handleResponse(response);
  } catch (err) {
    console.error("Шалгалт өгсөн оюутны мэдээллийг авахад алдаа гарлаа:", err);
    throw err;}
}
export const updateByUser = async (userId: string, userData: any) => {
  try {
    const response = await fetch(
      `${getBackendUrl()}/users/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );
    return await handleResponse(response);
  } catch (err) {
    console.error("Шалгалт өгсөн оюутны мэдээллийг авахад алдаа гарлаа:", err);
    throw err;}
}
//Бүх шалгалтын мэдээлэл
export const getResults = async () => {
  try {
    const response = await fetch(`${getBackendUrl()}/monitoring`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await handleResponse(response);
  } catch (err) {
    console.error("Шалтгалтын жагсаалтыг авахад алдаа гарлаа:", err);
    throw err;
  }
};
//examId, studentId хоёр байх юм бол тухайн шалгалтаас хэрэглэгчийн хасах
export const deleteResultByExamUser = async (
  examId: string,
  studentId: string
) => {
  try {
    const response = await fetch(
      `${getBackendUrl()}/monitoring/by-exam-user/${examId}/${studentId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const deleteExam = await handleResponse(response);
    return deleteExam;
  } catch (err) {
    console.error("Шалгалтын мэдээллийг авахад алдаа гарлаа:", err);
    throw err;
  }
};
// Шинэ шалгалт үүсгэх
export const createResult = async (createResult: any) => {
  try {
    const res = await fetch(`${getBackendUrl()}/monitoring`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ createResult }),
    });
    return await handleResponse(res);
  } catch (err) {
    console.error("Шалгалтын мэдээлэл үүсгэх үед алдаа гарлаа:", err);
    throw err;
  }
};
//submit дарах үед database руу result шинэчлэх
export const updateResult = async (resultId: string, examData: any) => {
  try {
    const response = await fetch(`${getBackendUrl()}/monitoring/${resultId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(examData),
    });
    const updateExam = await handleResponse(response);
    return updateExam;
  } catch (err) {
    console.error("Шалгалтын мэдээллийг авахад алдаа гарлаа:", err);
    throw err;
  }
};

//examID, studentId 2-ыг match хийж байвал true, байхгүй бол false илгээх, шалгах функц
// Шалгалтыг өгсөн бол дахиж өгөхгүй байх функц
export const checkedResultByExamUser = async (
  examId: string,
  studentId: string
) => {
  try {
    const response = await fetch(
      `${getBackendUrl()}/monitoring/checkedResult/${examId}/${studentId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const json = await handleResponse(response);
    return json.status;
  } catch (err) {
    console.error("Оюутны шалгалтын статусыг авахад алдаа гарлаа", err);
    throw err;
  }
};
{
  /*
  
  {
    "exists": true    //false
}
  */
}

export const getExamTakenCount = async () => {
  const res = await fetch(`${getBackendUrl()}/monitoring/taken-count`);
  return await handleResponse(res);
};
