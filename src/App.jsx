// import { Navbar } from "@/components/layout/Navbar"
import { SearchBar } from "@/components/search/SearchBar"
import { CncCard } from "@/components/cnc/CncCard"
import { Footer } from "@/components/layout/Footer"
import { WavyBackground } from "@/components/ui/wavy-background"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowDown } from "lucide-react"
import bwf from "@/assets/bwf.png"
import React from "react"

const DUMMY_CNCS = [
  {
    id: 1,
    name: "President University Badminton Club",
    logo: bwf,
    category: "Sports",
    shortDescription: "Join the President University Badminton Club and elevate your game",
    memberCount: 24,
    registrationOpen: true
  },
  {
    id: 2,
    name: "President University Futsal Club",
    logo: bwf,
    category: "Sports",
    shortDescription: "Join the President University Futsal Club and dominate the field",
    memberCount: 32,
    registrationOpen: false
  },
  {
    id: 3,
    name: "President University Robotics Club",
    logo: bwf,
    category: "Technology",
    shortDescription: "Join the President University Robotics Club and build advanced robots",
    memberCount: 18,
    registrationOpen: true
  },
  {
    id: 4,
    name: "President University Photography Club",
    logo: bwf,
    category: "Arts & Media",
    shortDescription: "Join the President University Photography Club and capture your world",
    memberCount: 12,
    registrationOpen: false
  }
]

export default function App() {
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth"
    })
  }

  return (
    <div className="flex flex-col font-[Geist] overflow-x-hidden">
      {/* Hero Section */}
      <WavyBackground className="h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8 px-4 max-w-4xl"
        >
          <h1 className="text-4xl md:text-7xl font-bold tracking-tight dark:text-white">
            Welcome, Presunivers!
          </h1>
          <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join the clubs and communities that align with your interests and talents at our university
          </p>
          <div className="flex flex-col items-center gap-8 pt-4">
            <Button 
              size="lg" 
              onClick={scrollToContent}
              className="text-base px-8 py-6"
            >
              Bring me
            </Button>
            <motion.button
              onClick={scrollToContent}
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Scroll to content"
            >
              <ArrowDown size={24} />
            </motion.button>
          </div>
        </motion.div>
      </WavyBackground>

      {/* Content Section */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 space-y-16 max-w-[1600px]">
          {/* Search Section */}
          <SearchBar />

          {/* CnC Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {DUMMY_CNCS.map((cnc) => (
              <CncCard key={cnc.id} cnc={cnc} />
            ))}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
