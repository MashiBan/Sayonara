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

const RegisterForm: React.FC = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [confetti, setConfetti] = useState<boolean>(false); // State for confetti trigger
  const router = useRouter();

  // Handle registration
  const handleRegister = async () => {
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

      setMessage("Registration successful! Please check your email for verification");

      // Trigger confetti
      setConfetti(true);
      setTimeout(() => setConfetti(false), 3000); // Reset confetti after 3 seconds

      // Clear the form
      setFirstName("");
      setEmail("");
      setPassword("");

      toast.success("Registration successful!");
      router.push("/login");
    } catch (err: any) {
      setError(err.message); // Show error if registration fails
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-blue-300">
      <h1 className="text-6xl font-serif font-bold italic mb-20">Sayonara, Seniors!</h1>
      <p className="text-2xl font-bold mb-10">KIET-25</p>
      
      {/* Confetti Explosion */}
      {confetti && <ConfettiExplosion />}

      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Welcome, Connect with friends!</h2>
        </CardHeader>
        
        <CardContent>
          <Input
            type="text"
            placeholder="First Name"
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
            className="px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </CardContent>
      </Card>
      <div className="mt-4 text-center">
        <p className="text-sm">
          Already have an account?{" "}
          <Link href="/login" className=" hover:underline">
            Log in here
          </Link>
        </p>
        <p className="text-sm mt-3">Use your college email-id</p>
        <p className="text-sm mt-6 underline">Please verify your email-id after registration.</p>
      </div>
    </div>
  );
};

export default RegisterForm;
