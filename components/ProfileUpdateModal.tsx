"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "@/lib/authSlice";
import { RootState } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";

export function ProfileUpdateModal() {
  const dispatch = useDispatch<any>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [form, setForm] = useState({
    email: user?.email || "",
    name: user?.name || "",
    password: "",
    avatar: user?.avatar || user?.image || "",
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(updateUserProfile(form));
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
