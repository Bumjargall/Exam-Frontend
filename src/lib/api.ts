import mongoose, { ObjectId, Types } from "mongoose";
import { ExamInput as ImportedExamInput } from "@/lib/types/interface";

// Сервертэй холбогдож байгаа эсэхийг шалгах
const getBackendUrl = (): string => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backendUrl) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL тодорхойлогдоогүй байна.");
  }
  console.log("Backend URL: ", backendUrl);
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

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await fetch(`${getBackendUrl()}/login`, {
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

// Шалтгалт үүсгэх
export const createExam = async (examData: ImportedExamInput) => {
  try {
    const examDataWithObjectId = {
      ...examData,
      createUserById: new Types.ObjectId(examData.createUserById),
    };

    const response = await fetch(`${getBackendUrl()}/exams/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(examDataWithObjectId),
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
      },
    });
    const deleteExam = await handleResponse(response);
    return deleteExam;
  } catch (err) {
    console.error("Шалгалтын мэдээллийг авахад алдаа гарлаа:", err);
    throw err;
  }
};

{
  /* RESULT */
}
// Шалгалтын мэдээллийг шинэчлэх
export const updateExam = async (
  examId: string,
  examData: ImportedExamInput
) => {
  try {
    const response = await fetch(`${getBackendUrl()}/exams/${examId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(examData),
    });
    return await handleResponse(response);
  } catch (err) {
    console.error("Шалгалтын мэдээллийг шинэчлэхэд алдаа гарлаа:", err);
    throw err;
  }
};

// Шалгалт өгсөн оюутны мэдээллийг авах
export const getResultByUsers = async (examId: string) => {
  try {
    const response = await fetch(`${getBackendUrl()}/monitoring/by-exam/${examId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    const json = await response.json();
    console.log("✅ getResultByUsers response:", json);
    return json;
  } catch (err) {
    console.error("Шалгалт өгсөн оюутны мэдээллийг авахад алдаа гарлаа:", err);
    throw err;
  }
};



export const getStudentByResult = async (examId: string, studentId: string) => {
  try {
    const response = await fetch(`${getBackendUrl()}/users/${examId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await handleResponse(response);
  } catch (err) {
    console.error("Шалгалт өгсөн оюутны мэдээллийг авахад алдаа гарлаа:", err);
    throw err;
  }
};

//Result -ууд авах
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
