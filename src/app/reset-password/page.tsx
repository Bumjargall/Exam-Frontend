"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { resetPassword } from "@/lib/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const token = useSearchParams().get("token") || "";
  const router = useRouter();

  const handleReset = async () => {
    try {
      await resetPassword(token, password);
      toast.success("Нууц үг шинэчлэгдлээ");
      router.push("/login");
    } catch (err) {
      toast.error("Алдаа гарлаа");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-4">
      <h1 className="text-xl font-bold mb-4">Шинэ нууц үг оруулах</h1>
      <Input
        type="password"
        placeholder="Шинэ нууц үг"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border rounded w-full p-2"
      />
      <Button onClick={handleReset} className="bg-green-600 text-white w-full mt-4 p-2 rounded">
        Шинэчлэх
      </Button>
    </div>
  );
}
