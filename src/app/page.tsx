"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AiFillSound, AiOutlineSound } from "react-icons/ai";

const Sketch = dynamic(() => import("react-p5"), { ssr: false });

const HomePage = () => {
  const router = useRouter();
  let angle: number;

  // State for managing music playback
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  // State for managing "thoughts"
  const [thoughts, setThoughts] = useState<Thought[]>([]);

  const handleMusicToggle = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    // Initialize "thoughts" only once when the component mounts
    const initialThoughts: Thought[] = [];
    for (let i = 0; i < 60; i++) {
      initialThoughts.push(new Thought());
    }
    setThoughts(initialThoughts);
  }, []); // This empty dependency array ensures this runs only once when the component mounts

  const setup = (p5: any, canvasParentRef: any) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
    p5.colorMode(p5.HSB);
    p5.angleMode(p5.DEGREES);

    // Handle resizing of canvas when window is resized
    p5.windowResized = () => {
      p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    };
  };

  const draw = (p5: any) => {
    // Draw gradient background
    drawGradient(p5, 200, 255, 80, 220, 255, 2);

    angle = (p5.mouseX / p5.width) * 90;
    angle = p5.min(angle, 90);

    // Draw "thoughts"
    thoughts.forEach((thought) => {
      thought.update(p5.frameCount, p5);

      // When a thought reaches the bottom, make it stay at the bottom
      if (thought.posY > p5.height - thought.size) {
        thought.posY = p5.height - thought.size; // Set the Y position to be at the bottom
      }

      thought.display(p5);
    });

    // Draw the tree
    p5.translate(p5.width / 2, p5.height);
    p5.stroke(15, 55, 205);
    p5.strokeWeight(4);
    p5.line(0, 0, 0, -200);
    p5.translate(0, -200);
    branch(150, 0, p5);
  };

  const branch = (h: number, level: number, p5: any) => {
    p5.strokeWeight(2);
    p5.stroke(level * 30, 55, 205);
    h *= 0.66;

    if (h > 2) {
      p5.push();
      p5.rotate(angle);
      p5.line(0, 0, 0, -h);
      p5.translate(0, -h);
      branch(h, level + 1, p5);
      p5.pop();

      p5.push();
      p5.rotate(-angle);
      p5.line(0, 0, 0, -h);
      p5.translate(0, -h);
      branch(h, level + 1, p5);
      p5.pop();
    }
  };

  const drawGradient = (
    p5: any,
    startHue: number,
    startSaturation: number,
    startBrightness: number,
    endHue: number,
    endSaturation: number,
    endBrightness: number
  ) => {
    p5.noFill();
    for (let y = 0; y < p5.height; y++) {
      const t = p5.map(y, 0, p5.height, 0, 1);
      const h = p5.lerp(startHue, endHue, t);
      const s = p5.lerp(startSaturation, endSaturation, t);
      const b = p5.lerp(startBrightness, endBrightness, t);
      p5.stroke(h, s, b);
      p5.line(0, y, p5.width, y);
    }
  };

  class Thought {
    posX: number;
    posY: number;
    angle: number;
    size: number;
    driftX: number;
    driftY: number;
    color: any;  // Make sure it's a p5 color object
  
    constructor() {
      this.posX = Math.random() * window.innerWidth; // Spread across the entire width
      this.posY = Math.random() * -window.innerHeight; // Start above the canvas
      this.angle = Math.random() * 360;
      this.size = Math.random() * (15 - 5) + 5; // Smaller sizes for less prominent thoughts
      this.driftX = Math.random() * 1 - 0.5; // Slower horizontal drift
      this.driftY = Math.random() * 1 - 0.1; // Slower downward drift
      // Generate the HSB color using p5.js
      this.color = { h: Math.random() * 80 + 140, s: 100, b: 70 }; // Create a color object
    }
  
    update(time: number, p5: any) {
      // Update position
      this.posX += this.driftX;
      this.posY += this.driftY;
  
      // Wrap around horizontally if out of bounds
      if (this.posX > p5.width) this.posX = 0;
      if (this.posX < 0) this.posX = p5.width;
  
      // Reset position if it goes off-screen vertically
      if (this.posY > p5.height) {
        this.posY = -20; // Reset above the canvas
        this.posX = Math.random() * p5.width; // Randomize horizontal position
      }
    }
  
    display(p5: any) {
      // Use p5's color function to handle the color properly in HSB mode
      const p5Color = p5.color(this.color.h, this.color.s, this.color.b); 
      p5.fill(p5Color);  // Fill with the generated color
      p5.noStroke();
      p5.ellipse(this.posX, this.posY, this.size); // Draw the thought as a circle
    }
  }
  
  return (
    <div className="flex flex-col items-center justify-center bg-sky-400 text-white h-screen w-screen overflow-hidden">
      <div className="absolute z-10 top-14 text-center px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold pacifico-regular">The Sky of Thoughts</h1>
        <p className="text-lg sm:text-xl md:text-2xl borel-regular mt-6 sm:mt-8 text-blue-100">
          A place to branch out your creativity and share your stories.
        </p>
        <p className="text-lg sm:text-xl px-4 sm:px-8 md:px-72 mt-5 text-blue-200 borel-regular">
          KIET-Batch 25
        </p>
      </div>
      <div className="absolute inset-0 z-0">
        <Sketch setup={setup} draw={draw} />
      </div>
      <div className="absolute bottom-16 z-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 items-center">
        <Button onClick={() => router.push("/login")} className="px-6 py-2 text-black bg-white hover:bg-blue-200">
          Login
        </Button>
        
        <Button onClick={() => router.push("/register")} className="px-6 py-2 text-black bg-white hover:bg-blue-200">
          Register
        </Button>
        <Button onClick={() => router.push("/landing")} className="px-6 py-2 text-black bg-white hover:bg-blue-200">
          Skip
        </Button>
        <Button onClick={handleMusicToggle} className="px-6 py-2 text-black bg-white hover:bg-blue-200">
          {isPlaying ? <AiFillSound /> : <AiOutlineSound />}
        </Button>
      </div>
      <footer className="absolute bottom-5 text-center text-gray-400 z-10 text-xs sm:text-sm md:text-base">
        Made with ❤️ by Batch 2025
      </footer>

      {/* Music */}
      <audio ref={audioRef} src="/song.mp3" loop />
    </div>
  );
};

export default HomePage;
