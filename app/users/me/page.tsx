"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UserService } from "@/services/UserService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileUpdateModal } from "@/components/ProfileUpdateModal";
import { CenteredAlert } from "@/components/CentredAlert";

export default function UsersMePage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();
  const [profile, setProfile] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setError("You must be logged in to view your profile.");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      return;
    }

    const fetchProfile = async () => {
      try {
        if (user.id !== undefined) {
          const data = await UserService.getUserById(user.id, user.token as string);
          setProfile(data);
        } else {
          throw new Error("User ID is undefined");
        }
      } catch (err) {
        setError("Failed to fetch profile.");
      }
    };

    fetchProfile();
  }, [user]);

  if (error) {
    return (
        <CenteredAlert title="Access Denied" description={error} />
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-gray-100">
      {profile && (
        <Card className="w-full max-w-md p-6 shadow-lg flex flex-col items-center">
          <CardHeader>
            <CardTitle className="text-center" >{profile.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <img src={profile.avatar} alt={profile.name} className="w-24 h-24 rounded-full border mx-auto" />
            <p className="text-gray-500">{profile.email}</p>
            <p className="text-center font-bold mt-2">{profile.role}</p>
            <ProfileUpdateModal isOpen={true} onClose={() => {}} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
