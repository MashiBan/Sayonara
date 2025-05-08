"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { auth, firestore } from "@/firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Link from "next/link";
import toast from "react-hot-toast";
import ConfettiExplosion from "react-confetti-explosion";
import Snowfall from "react-snowfall"; // Snowfall package import
import { ShootingStars } from "@/components/ui/shooting-stars";
import { BackgroundLines } from "@/components/ui/background-lines";
import ColourfulText from "@/components/ui/colourful-text";
import { StarsBackground } from "@/components/ui/stars-background";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [confetti, setConfetti] = useState<boolean>(false); // State for confetti trigger
  const router = useRouter();

  // Regular expression to match emails like 'words.2125somewordnumber@kiet.edu'
  const emailPattern = /^[a-zA-Z0-9._%+-]+\.2125[a-z]*[0-9]*@kiet\.edu$/;


  // Change password
  const handleChangePassword = async () => {
    router.push("/changepassword");
  };

  // Handle login
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user.emailVerified) {
        const registrationData = localStorage.getItem("registrationData");
        const { firstName = "" } = registrationData ? JSON.parse(registrationData) : {};

        // Check if user data exists in Firestore
        const userDocRef = doc(firestore, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          // If the user data doesn't exist, create it in Firestore
          await setDoc(userDocRef, {
            firstName,
            email: user.email,
          });
        }

        // Display success message before redirect
        toast.success("Login successful!");

        // Trigger confetti
        setConfetti(true);
        setTimeout(() => setConfetti(false), 3000); // Reset confetti after 3 seconds

        // Redirect based on email format
        if (emailPattern.test(email)) {
          router.push("/introduction");
        } else {
          router.push("/introduction");
        }
      } else {
        setError("Please verify your email before logging in.");
      }
    } catch (err: any) {
      setError(err.message); // Show error if login fails
    } finally {
      setLoading(false);
    }
  };

  const handleHome = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    event.preventDefault();
    router.push("/");
  };
  return (
    <div className="h-screen w-screen bg-black flex flex-col items-center justify-center relative">
    <h2 className="text-center text-white dark:to-white text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
      The Sky of <ColourfulText text="Thoughts" />25
    </h2>
  
    {/* Card with increased z-index */}
    <Card className="relative z-30">
      <CardHeader>
        <h2 className="text-2xl font-bold">Welcome Back! Log in to connect</h2>
      </CardHeader>
  
      <CardContent>
        {error && <p className="text-red-500 mb-4">{error}</p>}
  
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
          onClick={handleLogin}
          className="px-4 py-2 rounded bg-pink-500 hover:bg-pink-600"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log In"}
        </Button>
      </CardContent>
    </Card>
  
    <div className="mt-4 text-center relative z-40">
      <p className="text-sm text-white">
        Don't have an account?{" "}
        <Link href="/register" className="hover:underline text-white">
          Register here
        </Link>
      </p>
      <button
        onClick={handleChangePassword}
        className="text-white py-2 px-4 rounded-lg text-sm"
      >
        Change Password
      </button>
      <br/>
      <button
          onClick={handleHome}
          className="text-white py-2 px-4 rounded-lg text-sm"
        >
          Home
        </button>
      <p className="text-sm mt-3 text-white">Use your college email-id</p>
    </div>
  
    <StarsBackground />
    <ShootingStars />

     {/* Footer */}
     <footer className="absolute bottom-5 text-center text-gray-400 z-10 text-xs sm:text-sm md:text-base">
        Made with ❤️ by Batch 2025
      </footer>
  </div>
  );
};

export default LoginForm;
