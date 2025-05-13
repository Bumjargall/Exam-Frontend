import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { User } from "./TeacherTable";
import { updateByUser } from "@/lib/api";
import { toast } from "sonner";
import { loadavg } from "os";

type Props = {
  open: boolean;
  onClose: () => void;
  user: User;
  onSaveSuccess: () => void;
};

export default function UserDialog({ open, onClose, user, onSaveSuccess }: Props) {
  const [form, setForm] = useState(user);
  const [loading, setLoading] = useState(false);
  const handleSave = async () => {
    try {
      setLoading(true);
      await updateByUser(user._id, form);
      toast.success("Хэрэглэгчийн мэдээлэл амжилттай шинэчлэгдлээ.");
      onSaveSuccess();
    } catch (err) {
      toast.error("Хэрэглэгчийн мэдээлэл шинэчлэхэд алдаа гарлаа.");
      console.error("update error:", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Хэрэглэгч засварлах</DialogTitle>
          <DialogDescription>
            Хэрэглэгчийн мэдээллийг засварлаж хадгалах боломжтой.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Овог
            </Label>
            <Input
              id="firstName"
              value={form.firstName}
              className="col-span-3"
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastName" className="text-right">
              Нэр
            </Label>
            <Input
              id="lastName"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Утас
            </Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Имэйл
            </Label>
            <Input
              id="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave} disabled={loading}>
            {loading ? "Хадгалж байна..." : "Хадгалах"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}