"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { ProfileUpdateModal } from "@/components/ProfileUpdateModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-gray-100">
        <Card className="w-full max-w-md p-6 shadow-lg flex flex-col items-center">
          <CardHeader>
            <CardTitle className="text-center" >{user.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full border mx-auto" />
            <p className="text-gray-500">{user.email}</p>
            <p className="text-center font-bold mt-2">{user.role}</p>
            <ProfileUpdateModal isOpen={true} onClose={() => {}} />
          </CardContent>
        </Card>
    </div>
  );
}
