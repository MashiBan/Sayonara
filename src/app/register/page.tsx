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
import Snowfall from 'react-snowfall'; // Snowfall package import

const RegisterForm: React.FC = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [confetti, setConfetti] = useState<boolean>(false); // State for confetti trigger
  const router = useRouter();

  // Change password
  const handleChangePassword = async () => {
    router.push("/changepassword");
  };

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
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-customBlue  to-blue-950">
      {/* Snow effect with customizable properties */}
      <Snowfall
        color="skyBlue"                // Snowflake color
        changeFrequency={0.01}        // Frequency of snowflake changes (slower changes)
        radius={[2, 10]}              // Randomized radius of snowflakes between 5px and 10px
        speed={[0.2, 0.5]}  
        snowflakeCount={5}
        opacity={[2,3]}  
        wind={[0,-1]}      
      />

<Snowfall
        color="lightgreen"                // Snowflake color
        changeFrequency={0.01}        // Frequency of snowflake changes (slower changes)
        radius={[2, 6]}              // Randomized radius of snowflakes between 5px and 10px
        speed={[0.2, 0.5]}  
        snowflakeCount={10}
        opacity={[2,5]}  
        wind={[0,-1]}      
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
          <h2 className="text-2xl font-bold">Welcome, Connect with friends!</h2>
        </CardHeader>
        
        <CardContent>
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
            className="px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </CardContent>
      </Card>
      <div className="mt-4 text-center">
        <p className="text-sm text-white">
          Already have an account?{" "}
          <Link href="/login" className=" hover:underline text-white">
            Log in here
          </Link>
        </p>
        <button
          onClick={handleChangePassword}
          className="text-white py-2 px-4 rounded-lg text-sm"
        >
          Change Password
        </button>
        <p className="text-sm mt-3 text-white">Use your college email-id</p>
        <p className="text-sm mt-6 underline text-white">Please verify your email-id after registration.</p>
      </div>
    </div>
  );
};

export default RegisterForm;











