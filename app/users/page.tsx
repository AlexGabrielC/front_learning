"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useRouter } from "next/navigation";
import { UserService } from "@/services/UserService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CenteredAlert } from "@/components/CentredAlert";

export default function UsersPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setError("You must be logged in to view users.");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      return;
    }

    const fetchUsers = async () => {
      try {
        let data;
        if (user.role === "admin") {
          data = await UserService.getAllUsers(user.token as string);
        } else {
          if (user.id !== undefined) {
            data = [await UserService.getUserById(user.id, user.token as string)];
          } else {
            throw new Error("User ID is undefined");
          }
        }
        setUsers(data);
      } catch (err) {
        setError("Failed to fetch users.");
      }
    };

    fetchUsers();
  }, [user]);

  if (error) {
    return (
        <CenteredAlert title="Access Denied" description={error} />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-center mb-6">All Users</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl">
        {users.map((user) => (
          <Card key={user.id} className="p-4 shadow-md flex flex-col items-center">
            <CardHeader className="text-center">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-full mx-auto"
              />
              <CardTitle className="mt-2">{user.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-500">{user.email}</p>
              <p className="font-semibold mt-1">{user.role}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
