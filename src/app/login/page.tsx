"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { auth, firestore } from "@/firebase/firebase";
import toast from "react-hot-toast";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // Regular expression to match emails like 'words.2125somewordnumber@kiet.edu'
  const emailPattern = /^[a-zA-Z0-9._%+-]+\.2125[a-z]+[0-9]+@kiet\.edu$/;

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
    <div className="h-screen flex flex-col items-center justify-center bg-pink-200">
      <h1 className="text-6xl font-serif font-bold italic mb-20">Sayonara, Seniors!</h1>
      <p className="text-2xl font-bold mb-10">KIET-25</p>
      <Card>
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
        <p className="text-sm">
          Don't have an account?{" "}
          <Link href="/register" className=" hover:underline">
            Register here
          </Link>
        </p>
        <p className="text-sm mt-3">
          Use your college email-id
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
