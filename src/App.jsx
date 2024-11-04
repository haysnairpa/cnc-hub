import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion";
import React from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";

export default function Home() {
  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4 "
      >
        <div className="text-3xl md:text-7xl font-[Geist] font-bold dark:text-white text-center">
          Welcome, Presunivers.
        </div>
        <div className="font-extralight font-[Geist] text-base md:text-4xl dark:text-neutral-200 py-4">
          Don't missed out the chance.
        </div>
        <button className="bg-black dark:bg-white rounded-full w-fit text-white font-[Geist] dark:text-black px-4 py-2">
          Bring me
        </button>
      </motion.div>
    </AuroraBackground>
  )
}
