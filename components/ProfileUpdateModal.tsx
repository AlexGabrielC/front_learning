"use client";

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserService } from "@/services/UserService";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

interface ProfileUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileUpdateModal({ isOpen, onClose }: ProfileUpdateModalProps) {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const [form, setForm] = useState({
    email: user?.email || null,
    password: user?.password || null,
    name: user?.name || null,
    avatar: user?.avatar || null,
  });
  const [error, setError] = useState<string | null>(null);

  // Handle profile update
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.token) {
      setError("Unauthorized: You must be logged in to update your profile.");
      return;
    }
    try {
      const updatedUser = await UserService.updateUser(user.id, form, user.token);
      if (updatedUser) {
        router.refresh();
        onClose();
      }
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Edit Profile</DialogTitle> {/* ✅ Added DialogTitle for accessibility */}
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <Label>Name</Label>
            <Input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="Enter new password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <div>
            <Label>Avatar URL</Label>
            <Input
              type="text"
              value={form.avatar}
              onChange={(e) => setForm({ ...form, avatar: e.target.value })}
            />
          </div>
          <Button type="submit">Save Changes</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
