"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/types/interface";
import { setISODay } from "date-fns";
import Link from "next/link";

export default function Exams() {
  const [isEditing, setIsEditing] = useState(false);
  const [isPassword, setIsPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [user, setUser] = useState<User>();
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    if (!userData || !userData.user._id) {
      console.error("Хэрэглэгчийн бүртгэл олдсонгүй");
    } else {
      setUser(userData.user);
      setFormData({
        firstName: userData.user.firstName,
        lastName: userData.user.lastName,
        email: userData.user.email,
        phone: userData.user.phone,
        password: userData.user.password,
      });
    }
  }, []);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSave = () => {
    console.log("Saved data:", formData);
    if (user) {
      setUser({
        ...user,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
    }
    setIsEditing(false);
  };
  return (
    <div className="max-w-4xl mx-auto mt-20">
      <div>
        <div className="text-center text-black py-4 border-t border-l border-r border-gray-500 rounded-t-lg">
          <h1 className="text-2xl font-medium">Хэрэглэгчийн мэдээлэл</h1>
        </div>
        <div className="border border-gray-500 p-10">
          <div className="flex justify-end mb-6">
            <Button
              variant="outline"
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
            >
              {isEditing ? "Хадгалах" : "Засварлах"}
            </Button>
          </div>

          {/* Нэр */}
          <div className="space-y-6">
            <div>
              <p>Нэр</p>
            </div>
            <div className="space-y-2">
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="lastName"
                    className="py-1 px-3 border bg-white w-full rounded-xl"
                    placeholder="Овог"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="firstName"
                    className="py-1 px-3 border bg-white w-full rounded-xl"
                    placeholder="Нэр"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
              ) : (
                <input
                  type="text"
                  className="py-1 border bg-gray-100 w-full rounded-xl pl-3"
                  value={`${user?.lastName || ""} ${user?.firstName || ""}`}
                  readOnly
                />
              )}
            </div>
            <div className="border-b pb-5"></div>
          </div>

          {/* Утасны дугаар */}
          <div className="space-y-6 mt-6">
            <div>
              <p>Утасны дугаар</p>
            </div>
            <div className="space-y-2">
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  className="py-1 border w-full rounded-xl pl-3"
                  placeholder="Утасны дугаар"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              ) : (
                <input
                  type="tel"
                  className="py-1 border bg-gray-100 w-full rounded-xl pl-3"
                  value={user?.phone || ""}
                  readOnly
                />
              )}
            </div>
            <div className="border-b pb-5"></div>
          </div>

          {/* Цахим шуудан */}
          <div className="space-y-6 mt-6">
            <div>
              <p>Цахим шуудан</p>
            </div>
            <div className="space-y-2">
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  className="py-1 border w-full rounded-xl pl-3"
                  placeholder="Цахим шуудан"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              ) : (
                <input
                  type="email"
                  className="py-1 border bg-gray-100 w-full rounded-xl pl-3"
                  value={user?.email || ""}
                  readOnly
                />
              )}
            </div>
            <div className="border-b pb-5"></div>
          </div>

          {/* Нууц үг - Only shown in edit mode */}
          {isEditing && (
            <div className="space-y-6 mt-6">
              <div>
                <p>Нууц үг</p>
              </div>
              <div className="space-y-4">
                <input
                  type="password"
                  name="currentPassword"
                  placeholder="Нууц үг"
                  className="py-1 border w-full rounded-xl pl-3"
                />
              </div>
              <div className="border-b pb-5"></div>
            </div>
          )}

          {/* Нууц үг сэргээх - Only shown in view mode */}
          <div className="space-y-6 mt-6">
            <div>
              <p>Нууц үг</p>
            </div>
            <div>
              <Button
                onClick={() => setIsPassword(!isPassword)}
                variant="outline"
                className="cursor-pointer"
              >
                Нууц үг мартсан
              </Button>
            </div>
            <div>
              {isPassword && (
                <div className="flex items-center space-x-10">
                  <input
                    type="email"
                    name="forgorPassword"
                    placeholder="Цахим шуудангаа оруулна..."
                    className="py-1 border w-full rounded-xl pl-3"
                  />
                  <Button className="cursor-pointer">Илгээх</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
