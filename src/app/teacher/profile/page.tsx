"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/useAuth";
import { toast } from "sonner";
import { forgotPassword } from "@/lib/api";
import { updateUser } from "@/lib/api";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface FormFieldProps {
  label: string;
  name: keyof ProfileFormData;
  type?: string;
  value: string;
  readOnly?: boolean;
  placeholder?: string;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  iconClass?: string;
}

const FormField = ({
  label,
  name,
  type = "text",
  value,
  readOnly = false,
  placeholder = "",
  errors,
  onChange,
  iconClass,
}: FormFieldProps) => (
  <div className="space-y-2 relative">
    <label htmlFor={name} className="text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      id={name}
      type={type}
      name={name}
      className={`py-2 pl-10 pr-4 border w-full rounded-lg focus:ring-2 focus:ring-sky-300 focus:outline-none ${
        readOnly ? "bg-gray-100" : "bg-white"
      } ${errors[name] ? "border-red-500" : "border-gray-300"}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
    />
    {iconClass && (
      <i
        className={`${iconClass} absolute top-9 left-3 text-gray-400 text-sm`}
      />
    )}
    {errors[name] && (
      <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
    )}
  </div>
);

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!user || !user._id) {
      console.error("Хэрэглэгчийн бүртгэл олдсонгүй");
      return;
    }

    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: user.phone || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = "Нэр оруулна уу";
    if (!formData.lastName.trim()) newErrors.lastName = "Овог оруулна уу";
    if (!formData.email.trim()) {
      newErrors.email = "Имэйл оруулна уу";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Зөв имэйл хаяг оруулна уу";
    }
    if (formData.phone && !/^\d{8,}$/.test(formData.phone)) {
      newErrors.phone = "Зөв утасны дугаар оруулна уу";
    }

    if (showChangePassword) {
      if (!formData.currentPassword)
        newErrors.currentPassword = "Одоогийн нууц үг хэрэгтэй";
      if (!formData.newPassword)
        newErrors.newPassword = "Шинэ нууц үг оруулна уу";
      else if (formData.newPassword.length < 8)
        newErrors.newPassword = "Нууц үг 8-аас дээш тэмдэгттэй байх ёстой";
      if (!formData.confirmPassword)
        newErrors.confirmPassword = "Давтан нууц үг оруулна уу";
      else if (formData.newPassword !== formData.confirmPassword)
        newErrors.confirmPassword = "Нууц үг таарахгүй байна";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    if (!user?._id) {
      toast.error("Хэрэглэгчийн ID олдсонгүй.");
      return;
    }
    setLoading(true);
    try {
      const res = await updateUser(user._id, formData);
      if (!res) {
        toast.error(
          res?.message || "Хэрэглэгчийн мэдээллийн шинэчлэхэд алдаа гарлаа"
        );
        return;
      }
      setSuccessMessage("Хэрэглэгчийн мэдээлэл амжилттай шинэчлэгдлээ");
      setTimeout(() => setSuccessMessage(""), 3000);
      setIsEditing(false);
      setShowChangePassword(false);
    } catch (err) {
      toast.error("Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
    console.log("Хадгалах:", formData);
  };

  const handlePasswordReset = async () => {
    if (!resetEmail.trim()) {
      setErrors((prev) => ({ ...prev, resetEmail: "Имэйл оруулна уу" }));
      return;
    }

    console.log("Нууц үг сэргээх:", resetEmail);
    setLoading(true);
    try {
      await forgotPassword(resetEmail);
      setSuccessMessage("Нууц үг сэргээх линк илгээгдлээ");
      setTimeout(() => setSuccessMessage(""), 3000);
      setShowPasswordReset(false);
      setResetEmail("");
    } catch (err) {
      toast.error("Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      {successMessage && (
        <div className="animate-fade-in-down bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6 transition-opacity duration-700">
          {successMessage}
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">
              Хэрэглэгчийн мэдээлэл
            </h1>
            <Button
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              className={`text-sm font-semibold px-6 py-2 rounded-lg transition ${
                isEditing
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-sky-100 hover:bg-sky-200 text-sky-700"
              }`}
            >
              {isEditing ? "Хадгалах" : "Засварлах"}
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {isEditing ? (
              <>
                <FormField
                  label="Овог"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  errors={errors}
                  placeholder="Овог"
                  iconClass="ri-user-line"
                />
                <FormField
                  label="Нэр"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  errors={errors}
                  placeholder="Нэр"
                  iconClass="ri-user-line"
                />
              </>
            ) : (
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-700">
                  Овог, нэр
                </label>
                <div className="py-2 px-4 bg-gray-100 rounded-lg">
                  {`${formData.lastName || ""} ${formData.firstName || ""}`}
                </div>
              </div>
            )}
          </div>

          <FormField
            label="Утас"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            errors={errors}
            readOnly={!isEditing}
            placeholder="Утасны дугаар"
            iconClass="ri-phone-line"
          />

          <FormField
            label="Имэйл"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            errors={errors}
            readOnly={!isEditing}
            placeholder="Имэйл хаяг"
            iconClass="ri-mail-line"
          />

          {/* Change password section */}
          {isEditing && (
            <div className="border-t pt-6 mt-6 space-y-4">
              <h2 className="text-lg font-medium text-gray-800">
                Нууц үг солих
              </h2>
              {!showChangePassword ? (
                <Button
                  variant="outline"
                  onClick={() => setShowChangePassword(true)}
                  className="text-blue-600"
                >
                  Нууц үг солих
                </Button>
              ) : (
                <>
                  <FormField
                    label="Одоогийн нууц үг"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    errors={errors}
                    placeholder="Одоогийн нууц үг"
                    iconClass="ri-lock-line"
                  />
                  <FormField
                    label="Шинэ нууц үг"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    errors={errors}
                    placeholder="Шинэ нууц үг"
                    iconClass="ri-lock-password-line"
                  />
                  <FormField
                    label="Шинэ нууц үг давтах"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    errors={errors}
                    placeholder="Нууц үг давтах"
                    iconClass="ri-lock-password-line"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setShowChangePassword(false)}
                  >
                    Цуцлах
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Password reset */}
          {!isEditing && (
            <div className="border-t pt-6 mt-6 space-y-2">
              {!showPasswordReset ? (
                <Button
                  variant="outline"
                  onClick={() => setShowPasswordReset(true)}
                  className="text-blue-600"
                >
                  Нууц үг мартсан
                </Button>
              ) : (
                <div className="space-y-4">
                  <input
                    type="email"
                    name="resetEmail"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Имэйл хаяг"
                    className={`py-2 px-4 border w-full rounded-lg ${
                      errors.resetEmail ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.resetEmail && (
                    <p className="text-red-500 text-xs">{errors.resetEmail}</p>
                  )}
                  <div className="flex space-x-2">
                    <Button onClick={handlePasswordReset}>Илгээх</Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowPasswordReset(false)}
                    >
                      Цуцлах
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
