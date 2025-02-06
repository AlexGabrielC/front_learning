"use client";

import { useState } from "react";
import { UserService } from "@/services/UserService";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignupForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", avatar: "" });
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if the email is available
  const checkEmailAvailability = async () => {
    try {
      const isAvailable = await UserService.checkEmailAvailability(form.email);
      setEmailAvailable(isAvailable);
    } catch (err) {
      console.error("Error checking email availability", err);
      setError("Failed to check email availability.");
    }
  };

  // Handle signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailAvailable === false) {
      setError("This email is already used.");
      return;
    }

    try {
      const response = await UserService.createUser(form);
      if (response) {
        router.push("/login");
      }
    } catch (err) {
      setError("Signup failed. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>Complete this information to create an account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={form.email}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value });
                    setEmailAvailable(null); // Reset email check
                  }}
                  onBlur={checkEmailAvailability} // Check email availability on blur
                  required
                />
                {emailAvailable === false && <p className="text-red-500 text-sm">This email is already used</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="avatar">Avatar (URL)</Label>
                <Input
                  id="avatar"
                  type="text"
                  placeholder="https://api.lorem.space/image/face?w=640&h=480"
                  value={form.avatar}
                  onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <a href="/login" className="underline underline-offset-4 text-blue-600 hover:text-blue-800">
                Login
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
