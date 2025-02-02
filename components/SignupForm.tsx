"use client";

import { useState } from "react";
import axios from "axios";
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

export function SignupForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", avatar: "" });
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Vérification de l'email
  const checkEmailAvailability = async () => {
    try {
      const response = await axios.post("https://api.escuelajs.co/api/v1/users/is-available", {
        email: form.email,
      });
      setEmailAvailable(response.data.isAvailable);
    } catch (err) {
      console.error("Erreur lors de la vérification de l'email", err);
    }
  };

  // Inscription de l'utilisateur
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailAvailable) {
      setError("Cet email est déjà utilisé.");
      return;
    }
    try {
      const response = await axios.post("https://api.escuelajs.co/api/v1/users/", form);
      if (response.status === 201) {
        router.push("/login"); // Redirige vers la page de connexion
      }
    } catch (err) {
      setError("Erreur lors de l'inscription.");
      console.error("Erreur d'inscription", err);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Inscription</CardTitle>
          <CardDescription>Remplissez les informations ci-dessous pour créer un compte.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Votre nom"
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
                  onBlur={checkEmailAvailability} // Vérification lors de la sortie du champ
                  required
                />
                {emailAvailable === false && <p className="text-red-500 text-sm">Cet email est déjà utilisé.</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Mot de passe</Label>
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
                S'inscrire
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Vous avez déjà un compte ?{" "}
              <a href="/login" className="underline underline-offset-4 text-blue-600 hover:text-blue-800">
                Se connecter
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
