"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter hook
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { auth, firestore } from "@/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, getDoc, doc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

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
    "/image5.jpeg", 
    "/image6.jpeg",
    "/image7.jpeg", 
    "/image8.jpeg", 
    "/image9.jpeg",
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
    "/image37.jpeg",
    "/image38.jpeg", 
    "/image40.jpeg", 
    "/image43.jpeg",

  ]; // Add paths to your images here
  const router = useRouter(); // Initialize router

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

  // Fetch the authenticated user and their `firstName`
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user || !user.emailVerified) {
          router.push("/login");
          return;
        }

        setUser(user);

        // Email validation
        const emailPattern = /^[a-zA-Z0-9._%+-]+\.2125[a-z]*[0-9]*@kiet\.edu$/;
        if (!user.email || !emailPattern.test(user.email)) {
          router.push("/login");
          return;
        }

        // Fetch user data from Firestore
        const docRef = doc(firestore, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setFirstName(docSnap.data()?.firstName || "Anonymous");
        } else {
          console.warn("No user data found in Firestore for:", user.uid);
        }

      } catch (error: any) {
        console.error("An error occurred while fetching user data:", error.message || error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Handle keypress to move the story forward
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

  // Change the image at regular intervals (e.g., every 5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval); // Clear interval when component unmounts
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    );
  }

  // Handle submission of thoughts
  const handleSubmit = async () => {
    if (storyStep === 3 && userInput.trim()) {
      setInputSubmitted(true);

      try {
        // Add the thought to the "thoughts" collection
        const thoughtsCollection = collection(firestore, "thoughts");
        await addDoc(thoughtsCollection, {
          name: firstName,
          email: user.email,
          userId: user.uid,
          thought: userInput.trim(),
          timestamp: new Date(),
        });

        setTimeout(() => {
          router.push("/landing"); // Redirect to landing page after submission
        }, 1000);
      } catch (error) {
        console.error("Error saving thought:", error);
      }
    }
  };

  // Handle the "Previous" button click
  const handlePrevious = () => {
    if (storyStep > 0) {
      setStoryStep(storyStep - 1);
    }
  };

  const handleNext = () => {
    if (storyStep < 4) {
      setStoryStep(storyStep + 1);
    }
  };

  const currentStep = storySteps[storyStep];

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-b text-white from-blue-300 to-blue-500 p-8 relative">
      {/* Image Rectangle */}
      <img
        src={images[currentImageIndex]}
        alt="Story Image"
        className="w-80 h-72 object-cover  mb-10 rounded-xl"
      />

      <div className="text-center space-y-6">
        <h1 className="text-2xl italic font-bold">{currentStep.text}</h1>
        {storyStep === 3 && !inputSubmitted ? (
          <div className="flex flex-col items-center space-y-4">
            <Textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="thoughts?..."
            />
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        ) : null}
        {currentStep.prompt && <p className="text-sm">{currentStep.prompt}</p>}
      </div>
      <div className="absolute bottom-8 right-8 flex space-x-4">
        <button onClick={() => router.push("/landing")} className="text-white py-2 px-4 rounded-lg"> {/* Redirect on button click */}
          Skip
        </button>
        {storyStep > 0 && (
          <button
            onClick={handlePrevious}
            className="text-white py-2 px-4 rounded-lg"
          >
            Previous
          </button>
        )}
        {storyStep < 4 && (
          <button
            onClick={handleNext}
            className="text-white py-2 px-4 rounded-lg"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default Introduction;
