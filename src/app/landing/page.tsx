"use client";

import { useState, useEffect } from "react";
import { auth, firestore } from "@/firebase/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { AiFillSound, AiOutlineSound } from "react-icons/ai";
import toast from "react-hot-toast";
import { StarsBackground } from "@/components/ui/stars-background";
import { ShootingStars } from "@/components/ui/shooting-stars";
import ColourfulText from "@/components/ui/colourful-text";

const LandingPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [thoughts, setThoughts] = useState<any[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [openCard, setOpenCard] = useState<string | null>(null);
  const router = useRouter();

  const words = `Hover on thoughts , to view them`;
  const colors = [
    "#f7f7b2", // Light Yellow
    "#f7eb81", // Lemon Chiffon
    "#FAFAD2", // Light Goldenrod Yellow
    "#f5cc89", // Papaya Whip
    "#fac76e", // Moccasin
    "#FFD700", // Gold
    "#FFF8DC", // Cornsilk
    "#FDF5E6", // Old Lace
    "#FFFAF0", // Floral White
    "#FFFFFF", // White
    "#FFB6C1", // Light Pink
    "#FFCCCB", // Misty Rose
    "#FAD6D0", // Pastel Pink
    "#F7A7B3", // Pastel Rose
    "#FFDDEE", // Cotton Candy Pink
    "#F4C2C2", // Rose Quartz
    "#F7B7A3", // Light Coral Pink
    "#FFC0CB", // Pink
    "#FF9AA2", // Pastel Red
    "#F1B6D4", // Powder Pink
  ];

  useEffect(() => {
    // Detect if the screen width is less than 768px (mobile)
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // Call initially
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(`${userData.firstName}`);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const fetchThoughts = async () => {
      try {
        const thoughtsCollection = collection(firestore, "thoughts");
        const snapshot = await getDocs(thoughtsCollection);
        const thoughtsData = snapshot.docs.map((doc) => ({
          key: doc.id,
          ...doc.data(),
        }));
        setThoughts(thoughtsData);
      } catch (error) {
        toast.error(
          `Error fetching thoughts: ${(error as Error)?.message || "Unknown error"}`,
        );
      }
    };

    fetchThoughts();
  }, []);

  const handleToggle = () => {
    if (isMobile) setIsOpen((prev) => !prev);
  };
  // Handle playing or pausing the audio
  const handlePlayPauseAudio = () => {
    if (isPlaying) {
      audio?.pause();
      setIsPlaying(false);
    } else {
      const audioElement = new Audio("/song.mp3");
      audioElement.loop = true;
      audioElement.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
      setAudio(audioElement);
      setIsPlaying(true);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (err) {
      console.log("logout error:", err);
    }
  };

  const handleHome = async () => {
    router.push("/");
  };
  const handleChangePassword = async () => {
    router.push("/changepassword");
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-blue-900">
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-[250px] rounded-xl bg-blue-950" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]  bg-blue-950" />
            <Skeleton className="h-4 w-[200px]  bg-blue-950" />
          </div>
        </div>
      </div>
    );
  }

  return (
    
    <div className="relative min-h-screen overflow-hidden bg-blue-950">
      <div className="text-center py-7 text-4xl w-auto bg-opacity-0 sacramento-regular  text-white bold ">
        <h1>
        The Sky of <ColourfulText text="Thoughts" />
        25
        </h1>
        <p className="opacity-70">
        <TextGenerateEffect duration={7} filter={true} words={words}/>;
        </p>
      </div>

      {/* Clouds
      <motion.div
        className="absolute w-96 h-96 bg-no-repeat bg-contain"
        style={{
          backgroundImage: "url('/cloud2.png')",
          top: "30%",
          left: "60%",
        }}
        animate={{
          x: ["0vw", "-15vw", "0vw"],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute w-64 h-64 bg-no-repeat bg-contain"
        style={{
          backgroundImage: "url('/cloud3.png')",
          top: "70%",
          left: "20%",
        }}
        animate={{
          x: ["0vw", "10vw", "0vw"],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
        }}
      /> */}

      {/* Floating thoughts */}
      <div className="absolute top-0 left-50 right-50 bottom-50 w-80% h-80% z-20">
        {thoughts.map((thought) => {
          
          const randomSize = Math.random() * 5 + 50;
          const randomColor = colors[Math.floor(Math.random() * colors.length)];

          return (
            <HoverCard  open={isMobile ? openCard === thought.key : undefined}>
              <HoverCardTrigger  asChild
    onClick={() => setOpenCard(openCard === thought.key ? null : thought.key)}>
                <motion.div
                  className="absolute cursor-pointer sacramento-regular rounded-full text-right border-white border-2 opacity-65"
                  style={{
                    fontSize: "5px",
                    width: `${randomSize}px`,
                    height: `${randomSize}px`,
                    top: `${Math.random() * 90}vh`,
                    left: `${Math.random() * 90}vw`,
                    // transform: `translate(50%, 50%)`,
                    backgroundColor: randomColor,
                    animation: "shiver 2s infinite",
                  }}
                  animate={{
                    scale: 1,
                  }}
                  whileHover={{
                    scale: 1.2,
                    opacity: 1,
                  }}
                  transition={{
                    duration: 1,
                    ease: "easeInOut",
                  }}
                >
                  <p className="text-white font-bold italic text-2xl translate-y-10 translate-x-5">
                    {thought.thought.split(" ").slice(0, 1).join(" ")}...
                  </p>
                </motion.div>
              </HoverCardTrigger>
            
              <HoverCardContent 
  className="relative top-0 right-1/2 transform translate-x-1/2 max-w-[90vw] max-h-[60vh] p-4  m-42  bottom-52 bg-black shadow-md rounded-md text-fuchsia-100 z-50 overflow-auto border border-white"
>
                <p className="text-lg font-semibold">{thought.thought}</p>
                <p className="text-sm italic text-white">
                  - {thought.name || "Anonymous"}
                </p>
                {thought.allowcomments && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Comments:</p>
                    {thought.comments &&
                      Object.values(thought.comments).map(
                        (comment: any, index: number) => (
                          <p key={index} className="text-xs text-gray-600">
                            {comment.text}
                          </p>
                        ),
                      )}
                  </div>
                )}
              </HoverCardContent>
            </HoverCard>
          );
        })}
      </div>

      {/* Footer with buttons */}
      <div className="absolute bottom-0 left-0 w-full bg-transparent p-4 flex justify-center space-x-4 z-30">
        {user && (
          <>
            <button
              onClick={handleLogout}
              className="text-white py-2 px-4 rounded-lg"
            >
              Logout
            </button>
            <button
              onClick={handleChangePassword}
              className="text-white py-2 px-4 rounded-lg"
            >
              Change Password
            </button>
          </>
        )}
        <button
          onClick={handleHome}
          className="text-white py-2 px-4 rounded-lg"
        >
          Home
        </button>
        <button
          onClick={handlePlayPauseAudio}
          className="text-white py-2 px-4 rounded-lg"
        >
          {isPlaying ? <AiOutlineSound /> : <AiFillSound />}
        </button>
      </div>
      <StarsBackground />
      <ShootingStars />
    </div>
  );
};

export default LandingPage;
