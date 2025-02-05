"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { ProfileUpdateModal } from "@/components/ProfileUpdateModal";

export default function ProfilePage() {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center p-6">
      <img 
        src={user.avatar || "/default-avatar.png"} 
        alt={user.name} 
        className="w-20 h-20 rounded-full border"
      />
      <h1 className="text-xl font-semibold mt-4">{user.name}</h1>
      <p className="text-gray-500">{user.email}</p>
      <ProfileUpdateModal isOpen={true} onClose={() => {}} />
    </div>

  );
}
