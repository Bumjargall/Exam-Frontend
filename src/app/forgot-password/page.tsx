"use client";

import { useState } from "react";
import { forgotPassword } from "@/lib/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async () => {
    setLoading(true);
    try {
      await forgotPassword(email);
      toast.success("Имэйл илгээгдлээ!");
      setLoading(false);
      setEmail("")
    } catch (err) {
      toast.error("Алдаа гарлаа");
      setLoading(false);
    }
  };


  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white border rounded-lg shadow">
      <h1 className="text-2xl font-semibold mb-4">Нууц үг мартсан уу?</h1>
      <p className="text-sm text-gray-600 mb-6">
        Таны бүртгэлтэй имэйл хаяг руу нууц үг сэргээх холбоос илгээгдэнэ.
      </p>
      <Input
        type="email"
        placeholder="И-мэйл хаяг"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
      />
      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full mt-4 bg-green-600"
      >
        {loading ? "Илгээж байна..." : "Илгээх"}
      </Button>
    </div>
  );
}
