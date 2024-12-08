"use client"

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { auth } from "@/firebase/firebase";
import toast from "react-hot-toast";
import Link from "next/link";

const ChangePassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChangePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent! Please check your inbox.");
      router.push("/login");
    } catch (err: any) {
      setError("Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-500 to-blue-950">
      <h1 className="text-6xl font-serif font-bold italic mb-20">Sayonara, Seniors!</h1>
      <p className="text-2xl font-bold mb-10">KIET-25</p>
      <Card className="max-w-md w-full">
        <CardHeader>
          <h2 className="text-2xl font-bold">Change Your Password</h2>
        </CardHeader>

        <CardContent>
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 px-4 py-2 border border-gray-300 rounded"
            disabled={loading}
            required
          />

          <Button
            onClick={handleChangePassword}
            className="px-4 py-2 rounded w-full bg-blue-500 text-white hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Email"}
          </Button>
        </CardContent>
      </Card>

      <div className="mt-4 text-center">
        <p className="text-sm">
          Remembered your password?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ChangePassword;
