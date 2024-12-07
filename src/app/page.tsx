"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// Sample image array
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
  "/image30.jpeg",
  "/image34.jpeg",
  "/image28.jpeg",
  "/image31.jpeg",
  "/image32.jpeg",
  "/image33.jpeg",
  "/image36.jpeg",
  "/image37.jpeg",
  "/image38.jpeg",
  "/image43.jpeg",
  "/image42.jpeg",
  "/image41.jpeg",
  "/image40.jpeg",
];

const HomePage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-300 relative overflow-hidden">
      {/* Cloud background */}

      {/* Heading */}
      <h1 className="text-6xl font-serif font-bold italic text-white z-10 mb-10">
        Sky of Thoughts!
      </h1>
      <h3 className="text-2xl font-bold  text-white z-10 mb-10">
      KIET - Batch-2025 🎉
      </h3>
      {/* Clouds */}
      <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">
        <motion.div
          className="absolute w-80 h-80 bg-no-repeat bg-contain"
          style={{
            backgroundImage: "url('/cloud1.png')",
            top: "10%",
            left: "5%",
          }}
          animate={{
            x: ["0vw", "20vw", "0vw"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
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
        />
      </div>
      {/* Image Rectangle */}
      <div className="relative w-96 h-80 bg-gray-200 rounded-sm shadow-lg overflow-hidden mb-8 z-10">
        <Image
          src={images[currentImageIndex]}
          alt={`Image ${currentImageIndex + 1}`}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Buttons */}
      <div className="flex space-x-4 z-10">
        <Button
          onClick={() => router.push("/login")}
          className="px-6 py-2 text-white rounded-lg"
        >
          Login
        </Button>
        <Button
          onClick={() => router.push("/register")}
          className="px-6 py-2 text-white rounded-lg"
        >
          Register
        </Button>
      </div>
      {/* Footer with text and beating heart */}
      <div className="absolute bottom-5 w-full flex justify-center items-center space-x-2">
        <motion.p
          className="text-lg font-semibold text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Made with love
        </motion.p>
        <motion.div
          className="w-6 h-6 text-red-500"
          animate={{
            scale: [1, 1.2, 1], // Beat effect
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        >
          <span role="img" aria-label="heart">❤️</span>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;
