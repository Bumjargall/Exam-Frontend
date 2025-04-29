export const fetchHelloMessage = async () => {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    // URL-г шалгах
    if (!backendUrl) {
      throw new Error("NEXT_PUBLIC_BACKEND_URL тодорхойлогдоогүй байна.");
    }
    const response = await fetch(backendUrl);
    if (!response.ok) {
      throw new Error("Серверээс хариу ирсэнгүй");
    }
    return await response.json();
  } catch (err) {
    console.log("Алдаа: ", err);
    throw err;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    // URL-г шалгах
    if (!backendUrl) {
      throw new Error("NEXT_PUBLIC_BACKEND_URL тодорхойлогдоогүй байна.");
    }

    const response = await fetch(`${backendUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    // Хариуг шалгах
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Нэвтрэхэд алдаа гарлаа.");
    }

    // JSON өгөгдлийг буцаах
    return await response.json();
  } catch (err) {
    console.error("Нэвтрэхэд алдаа гарлаа:", err);
    throw err;
  }
};

type ExamInput = {
  title: string;
  description: string;
  questions: { question: string; options: string[]; answer: number }[];
  dateTime: Date;
  duration: number;
  totalScore: number;
  status: string;
  key: string;
  createUserById: string;
  createdAt: Date;
}
export const getByUserAllExams = async () => {

}

// Шалтгалт үүсгэх
export const createExam = async (examData:ExamInput) => {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    console.log(examData);
    // URL-г шалгах
    if (!backendUrl) {
      throw new Error(`${process.env.NEXT_PUBLIC_BACKEND_URL} тодорхойлогдоогүй байна.`);
    }

    const response = await fetch(`${backendUrl}/exams/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(examData),
    });
    console.log("Exam created successfully----> ", response);

    // Хариуг шалгах
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Шалтгалт үүсгэхэд алдаа гарлаа...");
    }
    console.log(response.body);
    // JSON өгөгдлийг буцаах
    return await response.json();
  } catch (err) {
    console.error("Шалтгалт үүсгэхэд алдаа гарлаа:", err);
    throw err;
  }
};
// Шалтгалтын жагсаалтыг авах
export const getExams = async () => {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!backendUrl) {
      throw new Error("NEXT_PUBLIC_BACKEND_URL тодорхойлогдоогүй байна.");
    }

    const response = await fetch(`${backendUrl}/exams`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Шалтгалтын жагсаалтыг авахад алдаа гарлаа.");
    }
    return await response.json();
  } catch (err) {
    console.error("Шалтгалтын жагсаалтыг авахад алдаа гарлаа:", err);
    throw err;
  }
}

// Шалгалт өгсөн оюутны мэдээллийг авах
export const getResultByUser = async (examId: string) => {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!backendUrl) {
      throw new Error("NEXT_PUBLIC_BACKEND_URL тодорхойлогдоогүй байна.");
    }

    const response = await fetch(`${backendUrl}/monitoring/${examId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Шалгалт өгсөн оюутны мэдээллийг авахад алдаа гарлаа.");
    }
    return await response.json();
  } catch (err) {
    console.error("Шалгалт өгсөн оюутны мэдээллийг авахад алдаа гарлаа:", err);
    throw err;
  }
}

{/*Student-ээс нэрээр нь дэлгэцэнд харуулах
  * @param examId
  * @param result буюу exam_id
  examId шалгалтыг өгсөн user_id-ын хэрэглэгчийн мэдээллийг user database-аас авах
  */}
export const getStudentByResult = async (examId: string, studentName: string) => {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!backendUrl) {
      throw new Error("NEXT_PUBLIC_BACKEND_URL тодорхойлогдоогүй байна.");
    }
    const response = await fetch(`${backendUrl}/users/${examId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch(err) {
    console.error("Шалгалт өгсөн оюутны мэдээллийг авахад алдаа гарлаа:", err);
    throw err;
  }
}