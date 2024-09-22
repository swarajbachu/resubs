"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const logos = [
  { src: "/logos/netflix.svg", alt: "Netflix" },
  { src: "/logos/apple_tv.svg", alt: "apple_tv" },
  { src: "/logos/spotify.svg", alt: "spotify" },
  { src: "/logos/youtube.svg", alt: "youtube" },
  { src: "/logos/chatGPT.svg", alt: "chatGPT" },
  { src: "/logos/hulu.svg", alt: "hulu" },
];

const cursorColors = [
  "#E50914", // Netflix red
  "#000000", // Apple TV black
  "#1DB954", // Spotify green
  "#FF0000", // YouTube red
  "#10A37F", // ChatGPT green
  "#38E783", // Hulu green
];

const logoPositions = [
  { x: 10, y: 5 },
  { x: 15, y: 20 },
  { x: 70, y: 20 },
  { x: 80, y: 25 },
  { x: 30, y: 25 },
  { x: 80, y: 5 },
];

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  // biome-ignore lint/correctness/useHookAtTopLevel: <explanation>
  const cursorControls = logos.map(() => useAnimation());
  // biome-ignore lint/correctness/useHookAtTopLevel: <explanation>
  const logoControls = logos.map(() => useAnimation());
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const animateElements = async () => {
      for (let i = 0; i < logos.length; i++) {
        const startX = -10;
        const startY = logoPositions[i].y;
        const endX = logoPositions[i].x;
        const endY = logoPositions[i].y;

        await Promise.all([
          cursorControls[i].start({
            left: [`${startX}%`, `${endX}%`, "110%"],
            top: [`${startY}%`, `${endY}%`, `${endY}%`],
            opacity: [0, 1, 0],
            transition: { duration: 2, times: [0, 0.5, 1] },
          }),
          logoControls[i].start({
            left: [`${startX}%`, `${endX}%`, `${endX}%`],
            top: [`${startY}%`, `${endY}%`, `${endY}%`],
            opacity: [0, 1, 1],
            scale: [0, 1, 1],
            transition: { duration: 2, times: [0, 0.5, 1] },
          }),
        ]);
      }
    };
    setAnimationComplete(true);
    animateElements();
  }, []);

  return (
    <section
      className="relative min-h-screen  overflow-hidden"
      ref={containerRef}
    >
      <div className="container mx-auto px-4 relative flex flex-col items-center justify-center">
        {logos.map((logo, index) => (
          <motion.div
            key={`cursor-${logo.alt}`}
            className="absolute z-50 pointer-events-none"
            animate={cursorControls[index]}
            initial={{ opacity: 0 }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.99999 2L10.1314 22.3699L13.5789 13.5789L22.37 10.1314L2.99999 2Z"
                fill={cursorColors[index]}
                stroke="white"
              />
            </svg>
          </motion.div>
        ))}

        {logos.map((logo, index) => (
          <motion.div
            key={`logo-${logo.alt}`}
            className=" absolute w-16 h-16 rounded-full flex items-center justify-center"
            initial={{ opacity: 0, scale: 0 }}
            animate={logoControls[index]}
          >
            <motion.img
              drag={animationComplete}
              dragConstraints={containerRef}
              whileTap={{ cursor: "grabbing" }}
              style={{
                position: "absolute",
              }}
              whileHover={{
                cursor: "grab",
              }}
              height={100}
              width={100}
              src={logo.src}
              alt={logo.alt}
              className="w-12 h-12 stroke-slate-50 cursor-grab"
            />
          </motion.div>
        ))}

        <motion.div className="text-center h-[60vh] flex flex-col items-center justify-center">
          <h1 className="text-xl md:text-4xl font-medium mb-4 max-w-2xl text-balance leading-[2.3rem]">
            Are you Tired of Tracking Your Subscriptions?
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">
            yeah, we thought so.
          </p>
          <div className="flex sm:flex-row flex-col gap-4">
            <Button asChild>
              <Link href="/login" className="btn btn-primary">
                Get Started
              </Link>
            </Button>
          </div>
        </motion.div>

        <Image
          alt="placeholder"
          width={1000}
          height={1000}
          className="w-full rounded-lg shadow-2xl border-4 border-primary/20"
          src="/screenshot.png"
        />
      </div>
    </section>
  );
}
