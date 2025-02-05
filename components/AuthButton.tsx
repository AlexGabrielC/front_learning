"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function AuthButton() {
  const { data: session } = useSession();

  return session ? (
    <Button onClick={() => signOut()}>Logout</Button>
  ) : (
    <Button onClick={() => signIn("google")}>Login with Google</Button>
  );
}
