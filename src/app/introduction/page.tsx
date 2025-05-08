"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { auth, firestore } from "@/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, getDoc, doc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";

const Introduction: React.FC = () => {
  const [storyStep, setStoryStep] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>("");
  const [inputSubmitted, setInputSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);
  const [firstName, setFirstName] = useState<string>("Anonymous");
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  const images = ["/1.png", "/2.png", "/3.png", "/4.png", "/5.png"];

  const router = useRouter();

  const storySteps = [
    {
      text: "Can you believe how far we’ve come? These years have been a mix of highs and lows, lessons and laughter, and moments that will stay with us forever.",
      prompt: "Press Enter or Spacebar to continue...",
    },
    {
      text: "As we near the finish line, it’s a great time to reflect. What memories have made you smile, and what moments have shaped you into who you are today?",
      prompt: "",
    },
    {
      text: "Our final semester is now behind us—a time filled with milestones, memories, and growth. As we step into the next chapter, what are your hopes, dreams, and reflections for the road ahead?",
      prompt: "",
    },
    {
      text: "Share your thoughts—your favorite memories, kind words, or even a little inspiration for everyone. Your story matters.",
      prompt: "Type your message and click the button to submit...",
    },
    {
      text: "Thank you for sharing. Together, let’s make these last months a chapter filled with hope, kindness, and unforgettable memories.",
      prompt: null,
    },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user || !user.emailVerified) {
          router.push("/login");
          return;
        }

        setUser(user);

        const emailPattern = /^[a-zA-Z0-9._%+-]+\.2125[a-z]*[0-9]*@kiet\.edu$/;
        const authorized = !!user.email && emailPattern.test(user.email!);
        setIsAuthorized(authorized);

        const docRef = doc(firestore, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFirstName(docSnap.data()?.firstName || "Anonymous");
        }
      } catch (error: any) {
        console.error("An error occurred:", error.message || error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.key === "Enter" || e.key === " ") && storyStep < (isAuthorized ? 4 : 3)) {
        setStoryStep((prev) => prev + 1);
      }

      if (!isAuthorized && storyStep === 3) {
        router.push("/landing");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [storyStep, isAuthorized, router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-blue-900">
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-[250px] rounded-xl bg-blue-950" />
          <Skeleton className="h-4 w-[250px] bg-blue-950" />
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (storyStep === 3 && userInput.trim()) {
      setInputSubmitted(true);
      try {
        const thoughtsCollection = collection(firestore, "thoughts");
        await addDoc(thoughtsCollection, {
          name: firstName,
          email: user.email,
          userId: user.uid,
          thought: userInput.trim(),
          timestamp: new Date(),
        });

        setTimeout(() => router.push("/landing"), 1000);
      } catch (error) {
        console.error("Error saving thought:", error);
      }
    }
  };

  return (
    <div className="relative w-full h-screen text-white overflow-hidden">
      <StarsBackground />
      <ShootingStars />

      {/* Two images side by side */}
      <div className="absolute top-0 left-0 w-full h-full flex -z-1 bg-blue-950">
        <img
          src={images[currentImageIndex]}
          alt="Background Left"
          className="w-1/2 h-full object-cover opacity-50"
        />
        <img
          src={images[(currentImageIndex + 1) % images.length]}
          alt="Background Right"
          className="w-1/2 h-full object-cover opacity-50"
        />
      </div>

      <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center text-center z-10 px-6">
      <BackgroundGradient className="p-8 rounded-xl max-w-2xl  border-white shadow-[0_0_10px_2px_rgba(255,255,255,0.8)]">
  <h1 className="text-center py-7 text-4xl w-auto bg-opacity-0 lobster-regular">{storySteps[storyStep].text}</h1>

  {storySteps[storyStep].prompt && (
    <p className="text-gray-300 mb-6">{storySteps[storyStep].prompt}</p>
  )}

  {/* Input field and submit button for authorized users on step 3 */}
  {storyStep === 3 && (
  <>
    {isAuthorized && !inputSubmitted ? (
      <>
        <Textarea
          placeholder="Write your thoughts..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="mb-4 text-black"
        />
        <Button
          onClick={handleSubmit}
          disabled={!userInput.trim()}
          className="mb-4"
        >
          Submit
        </Button>
      </>
    ) : !isAuthorized ? (
      <p className="text-white font-semibold mb-4">
        You are not authorized to add a message.
      </p>
    ) : null}
  </>
)}


  {/* Navigation Buttons */}
  <div className="flex justify-center gap-4 mt-4">
    <Button
      onClick={() => setStoryStep((prev) => Math.max(prev - 1, 0))}
      disabled={storyStep === 0}
      variant="ghost"
    >
      Previous
    </Button>
    <Button
      onClick={() =>
        setStoryStep((prev) =>
          Math.min(prev + 1, isAuthorized ? storySteps.length - 1 : 3)
        )
      }
      disabled={storyStep === (isAuthorized ? storySteps.length - 1 : 3)}
      variant="ghost"
    >
      Next
    </Button>
    <Button
     onClick={() => router.push("/landing")}
      variant="ghost"
    >
      Skip
    </Button>
  </div>
</BackgroundGradient>

      </div>
    </div>
  );
};

export default Introduction;
