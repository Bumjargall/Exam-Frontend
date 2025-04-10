"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Exams() {
  const [isEditingName, setIsEditingName] = useState(false);
  const [firstName, setFirstName] = useState("Bayaraa");
  const [lastName, setLastName] = useState("Bumjargal");
  const [email, setEmail] = useState("Bumjargal@gmail.com");
  const [isEmail, setIsEmail] = useState(false);

  return (
    <div className="max-w-4xl mx-auto mt-20">
      <div>
        <div className="text-center text-black py-4 border border-gray-900 rounded-t-lg">
          <h1 className="text-2xl font-medium">Хэрэглэгчийн мэдээлэл</h1>
        </div>
        <div className="border p-10">
          <div className="space-y-6">
            <div>
              <p>Нэр</p>
            </div>
            <div className="space-y-2">
              {isEditingName ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    className="py-1 px-3 border bg-white w-full rounded-xl"
                    placeholder="Овог"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                  <input
                    type="text"
                    className="py-1 px-3 border bg-white w-full rounded-xl"
                    placeholder="Нэр"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
              ) : (
                <input
                  type="text"
                  className="py-1 border bg-gray-100 w-full rounded-xl pl-3"
                  value={`${lastName} ${firstName}`}
                  readOnly
                />
              )}
            </div>
            <div className="border-b pb-5">
              <Button
                variant="outline"
                onClick={() => setIsEditingName(!isEditingName)}
              >
                {isEditingName ? "Хадгалах" : "Засварлах"}
              </Button>
            </div>
          </div>

          {/* Цахим шуудан */}
          <div className="space-y-6 mt-6">
            <div>
              <p>Цахим шуудан</p>
            </div>
            <div className="space-y-2">
              {isEmail ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    className="py-1 border w-full rounded-xl pl-3"
                    placeholder="Цахим шуудан"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Нууц үг"
                    className="py-1 border w-full rounded-xl pl-3"
                  />
                </div>
              ) : (
                <input
                  type="text"
                  className="py-1 border bg-gray-100 w-full rounded-xl pl-3"
                  value={`${email}`}
                  readOnly
                />
              )}
            </div>

            <div className="border-b pb-5">
              <Button variant="outline" onClick={() => setIsEmail(!isEmail)}>
                {!isEmail ? "Засварлах" : "Хадгалах"}
              </Button>
            </div>
          </div>

          {/* Нууц үг */}
          <div className="space-y-6 mt-6">
            <div>
              <p>Нууц үг</p>
            </div>
            <div className="flex space-x-4">
              <Button variant="outline">Нууц үг өөрчлөх</Button>
              <Button variant="outline">Нууц үг мартсан</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
