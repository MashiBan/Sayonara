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
import ColourfulText from "@/components/ui/colourful-text";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";

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
    <div className="relative h-screen flex flex-col items-center justify-center bg-black">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        {/* Ensure ShootingStars and StarsBackground are correctly rendered */}
        <ShootingStars />
        <StarsBackground />
      </div>

      {/* Form and Content */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center">
        <h2 className="text-center text-white dark:to-white text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 font-bold tracking-tight">
          The Sky of <ColourfulText text="Thoughts" />25
        </h2>
        <p className="max-w-xl mx-auto text-sm md:text-lg text-gray-400 text-center mb-9">
          Leave a Piece of Your College Story in the Sky of Thoughts — A Memoir for the Class of 2025!
        </p>
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
          <p className="text-sm text-white">
            Remembered your password?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
       {/* Footer */}
       <footer className="absolute bottom-5 text-center text-gray-400 z-10 text-xs sm:text-sm md:text-base">
        Made with ❤️ by Batch 2025
      </footer>
    </div>
  );
};

export default ChangePassword;
