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
          router.push("/landing");
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

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-500 to-blue-900">
      {/* Snow effect with customizable properties */}
      <Snowfall
        color="skyBlue"
        changeFrequency={0.01}
        radius={[5, 10]}
        speed={[0.2, 0.5]}
        snowflakeCount={5}
        opacity={[2, 3]}
        wind={[0, -1]}
      />

<Snowfall
        color="pink"
        changeFrequency={0.01}
        radius={[5, 10]}
        speed={[0.2, 0.5]}
        snowflakeCount={5}
        opacity={[2, 3]}
        wind={[0, -1]}
      />

<Snowfall
        color="yellow"
        changeFrequency={0.01}
        radius={[5, 10]}
        speed={[0.2, 0.5]}
        snowflakeCount={5}
        opacity={[2, 3]}
        wind={[0, -1]}
      />

      <Snowfall
        color="lightgreen"
        changeFrequency={0.01}
        radius={[5, 6]}
        speed={[0.2, 0.5]}
        snowflakeCount={10}
        opacity={[2, 5]}
        wind={[0, -1]}
      />

<div className="absolute z-10 top-14 text-center px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48 ">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold pacifico-regular text-white">The Sky of Thoughts</h1>
        <p className="text-lg sm:text-xl md:text-2xl borel-regular mt-6 sm:mt-8 text-blue-100">
          A place to branch out your creativity and share your stories.
        </p>
        <p className="text-lg sm:text-xl px-4 sm:px-8 md:px-72 mt-5 text-blue-200 borel-regular">
          KIET-Batch 25
        </p>
      </div>

      {/* Confetti Explosion */}
      {confetti && <ConfettiExplosion />}

      <Card className="mt-52">
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
            className="px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </Button>
        </CardContent>
      </Card>

      <div className="mt-4 text-center">
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
        <p className="text-sm mt-3 text-white">Use your college email-id</p>
      </div>
    </div>
  );
};

export default LoginForm;
