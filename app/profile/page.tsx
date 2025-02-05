"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useEffect } from "react";
import { fetchUserSession} from "@/lib/authSlice";
import { ProfileUpdateModal } from "@/components/ProfileUpdateModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  const dispatch = useDispatch<any>();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchUserSession());
  }, [dispatch]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gray-100">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {user ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <img src={user.image || user.avatar} alt={user.name} alt="Avatar" className="w-20 h-20 rounded-full border" />
                <div>
                  <p className="text-lg font-semibold">{user.name}</p>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>
              <ProfileUpdateModal />
            </div>
          ) : (
            <p>Loading profile...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
