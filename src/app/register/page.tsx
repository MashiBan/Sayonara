"use client";

import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { auth } from "@/firebase/firebase";
import Link from "next/link";
import { toast } from "react-hot-toast";

const RegisterForm: React.FC = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null); // State to store reCAPTCHA token
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    // Dynamically load the reCAPTCHA script after component mounts
    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    // Clean up when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Handle the reCAPTCHA change event
  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
  };

  // Handle registration
  const handleRegister = async () => {
    setLoading(true);
    try {
      if (!firstName || !email || !password || !recaptchaToken) {
        setError("Please fill in all fields and complete the reCAPTCHA.");
        setLoading(false);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      localStorage.setItem(
        "registrationData",
        JSON.stringify({
          firstName,
          email,
        })
      );

      toast.success("Registration successful!");
      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-blue-300">
      <h1 className="text-6xl font-serif font-bold italic mb-20">Sayonara, Seniors!</h1>
      <p className="text-2xl font-bold mb-10">KIET-25</p>

      <Card>
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

          {/* Add reCAPTCHA widget */}
          <div className="mb-4">
            <div
              className="g-recaptcha"
              data-sitekey="6LdOGZUqAAAAAFMn2juRyT7nM2WYjlp-AwRpp-9v" // Replace with your actual Site Key
              data-callback={handleRecaptchaChange}
            ></div>
          </div>

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
      </div>
    </div>
  );
};

export default RegisterForm;
