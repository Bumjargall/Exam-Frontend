import { useAuth } from "@/store/useAuth";

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = useAuth.getState().token;
  if (!token) throw new Error("Токен олдсонгүй");

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const errorMessage = (await res.json())?.message || "Error";
    throw new Error(errorMessage);
  }

  return res;
}
