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
  const images = [
    "/image1.jpeg",
    "/image2.jpeg",
    "/image3.jpeg",
    "/image4.jpeg",
    "/image5.jpeg",
    "/image6.jpeg",
    "/image7.jpeg",
    "/image8.jpeg",
    "/image10.jpeg",
    "/image11.jpeg",
    "/image12.jpeg",
    "/image13.jpeg",
    "/image14.jpeg",
    "/image15.jpeg",
    "/image16.jpeg",
    "/image17.jpeg",
    "/image18.jpeg",
    "/image19.jpeg",
    "/image20.jpeg",
    "/image21.jpeg",
    "/image22.jpeg",
    "/image23.jpeg",
    "/image24.jpeg",
    "/image25.jpeg",
    "/image27.jpeg",
    "/image28.jpeg",
    "/image30.jpeg",
    "/image31.jpeg",
    "/image32.jpeg",
    "/image33.jpeg",
    "/image34.jpeg",
    "/image36.jpeg",
    "/image35.jpeg",
    "/image29.jpeg",
    "/image26.jpeg",
    "/image9.jpeg",
  ];

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
      text: "This final semester is a chance to celebrate everything we’ve achieved and support each other as we take our next steps forward. What do you hope for, and how do you see us growing together?",
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
        if (!user.email || !emailPattern.test(user.email)) {
          router.push("/login");
          return;
        }

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
      if ((e.key === "Enter" || e.key === " ") && storyStep < 3) {
        setStoryStep(storyStep + 1);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [storyStep]);

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

  const handlePrevious = () => storyStep > 0 && setStoryStep(storyStep - 1);
  const handleNext = () => storyStep < 4 && setStoryStep(storyStep + 1);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-b text-white bg-black p-8 relative">
      <div className="mb-10 relative z-10">
        <BackgroundGradient className="w-80 h-72 object-cover rounded-xl">
          <img
            src={images[currentImageIndex]}
            alt="Story Image"
            className="w-80 h-72 object-cover rounded-xl"
          />
        </BackgroundGradient>
      </div>

      <div className="text-center space-y-6 relative z-20">
        <h1 className="text-2xl italic font-bold">{storySteps[storyStep].text}</h1>
        {storyStep === 3 && !inputSubmitted && (
          <div className="flex flex-col items-center space-y-4">
            <Textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Share your thoughts..."
              className="text-black"
            />
            <Button onClick={handleSubmit} className="bg-purple-600 hover:bg-purple-700">
              Submit
            </Button>
          </div>
        )}
        {storySteps[storyStep].prompt && <p className="text-sm">{storySteps[storyStep].prompt}</p>}
      </div>

      <div className="absolute bottom-8 right-8 flex space-x-4 z-30">
        <button onClick={() => router.push("/landing")} className="text-white py-2 px-4 rounded-lg">
          Skip
        </button>
        {storyStep > 0 && (
          <button onClick={handlePrevious} className="text-white py-2 px-4 rounded-lg">
            Previous
          </button>
        )}
        {storyStep < 4 && (
          <button onClick={handleNext} className="text-white py-2 px-4 rounded-lg">
            Next
          </button>
        )}
      </div>
      <StarsBackground className="absolute inset-0 z-0" />
      <ShootingStars className="absolute inset-0 z-0" />
    </div>
  );
};

export default Introduction;
