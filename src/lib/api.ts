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
