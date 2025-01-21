"use client";

import React from "react";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import { BackgroundLines } from "@/components/ui/background-lines";
import { useRouter } from "next/navigation";
import ColourfulText from "@/components/ui/colourful-text";
import { Button } from "@/components/ui/button";  

const HomePage = () => {
  const router = useRouter();
  return (
    <div className="h-screen w-screen bg-black flex flex-col items-center justify-center relative">
      <StarsBackground />
      <BackgroundLines className="flex items-center justify-center w-full flex-col px-4 bg-transparent">
      <p className="max-w-xl mx-auto text-0.775rem md:text-sm text-gray-400 text-center">
      Every corner of KIET holds memories, from late-night submissions to vibrant cultural fests.
        </p>
        <h2 className="text-center text-white dark:to-white text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
          The Sky of <ColourfulText text="Thoughts" />25
        </h2>
        <p className="max-w-xl mx-auto text-sm md:text-lg text-gray-400 text-center">
        Leave a message for your batchmates that will remind them of the incredible journey we’ve shared.
        </p>
      </BackgroundLines>

      {/* Buttons */}
      <div className="absolute bottom-16 z-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 items-center">
        <Button onClick={() => router.push("/login")} className="px-6 py-2 text-black bg-pink-500 hover:bg-pink-600">
          Login
        </Button>
        <Button onClick={() => router.push("/register")} className="px-6 py-2 text-black bg-green-500 hover:bg-green-600">
          Register
        </Button>
        <Button onClick={() => router.push("/landing")} className="px-6 py-2 text-black bg-yellow-500 hover:bg-yellow-600">
          Skip
        </Button>
      </div>

      <ShootingStars />
       {/* Footer */}
       <footer className="absolute bottom-5 text-center text-gray-400 z-10 text-xs sm:text-sm md:text-base">
        Made with ❤️ by Batch 2025
      </footer>
    </div>
  );
};

export default HomePage;
