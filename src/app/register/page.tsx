"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { auth } from "@/firebase/firebase";
import Link from "next/link";
import { toast } from "react-hot-toast";
import ConfettiExplosion from "react-confetti-explosion";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import ColourfulText from "@/components/ui/colourful-text";

const RegisterForm: React.FC = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [confetti, setConfetti] = useState<boolean>(false); // State for confetti trigger
  const router = useRouter();

  // Change password
  const handleChangePassword = async () => {
    router.push("/changepassword");
  };

  // Handle registration
  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!firstName || !email || !password) {
        setError("Please fill in all fields.");
        setLoading(false);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      // Temporarily store user data in local storage
      localStorage.setItem(
        "registrationData",
        JSON.stringify({
          firstName,
          email,
        })
      );

      setError(null);
      setConfetti(true);
      setTimeout(() => setConfetti(false), 3000); // Reset confetti after 3 seconds

      // Clear the form
      setFirstName("");
      setEmail("");
      setPassword("");

      toast.success("Registration successful! Please check your email for verification.");

      // Redirect to login page after successful registration
      router.push("/login");
    } catch (err: any) {
      setError(err.message); // Show error if registration fails
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-black flex flex-col items-center justify-center relative">
      {/* Confetti Explosion */}
      {confetti && <ConfettiExplosion />}

      <h2 className="text-center text-white dark:to-white text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
        The Sky of <ColourfulText text="Thoughts" />25
      </h2>
      
      {/* Registration Card */}
      <Card className="relative z-30">
        <CardHeader>
          <h2 className="text-2xl font-bold">Welcome, Connect with friends!</h2>
        </CardHeader>
        
        <CardContent>
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <Input
            type="text"
            placeholder="Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mb-2 px-4 py-2 border border-gray-300 rounded"
            disabled={loading}
            required
          />

          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-2 px-4 py-2 border border-gray-300 rounded"
            disabled={loading}
            required
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 px-4 py-2 border border-gray-300 rounded"
            disabled={loading}
            required
          />
          <Button
            onClick={handleRegister}
            className="px-4 py-2 rounded bg-green-600 hover:bg-green-700"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </CardContent>
      </Card>

      <div className="mt-4 text-center z-30">
        <p className="text-sm text-pink-500">
          Already have an account?{" "}
          <Link href="/login" className=" hover:underline text-white">
            Log in here
          </Link>
        </p>
        <button
          onClick={handleChangePassword}
          className="text-green-500 py-2 px-4 rounded-lg text-sm"
        >
          Change Password
        </button>
        <p className="text-sm mt-3 text-white">Use your college email-id</p>
        <p className="text-lg mt-3 text-white">Please verify your email-id after registration.</p>
      </div>

      {/* Background Effects */}
      <StarsBackground />
      <ShootingStars />


       {/* Footer */}
       <footer className="absolute bottom-5 text-center text-gray-400 z-10 text-xs sm:text-sm md:text-base">
        Made with ❤️ by Batch 2025
      </footer>
    </div>
  );
};

export default RegisterForm;
