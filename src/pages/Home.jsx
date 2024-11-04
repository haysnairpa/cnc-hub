import { CncCard } from "@/components/cnc/CncCard"
import { SearchBar } from "@/components/search/SearchBar"
import { Footer } from "@/components/layout/Footer"
import { AuroraBackground } from "@/components/ui/aurora-background"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

const DUMMY_CNCS = [
  // ... data CNC yang sudah ada ...
]

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-[Geist]">
      <main className="flex-1">
        <AuroraBackground className="min-h-screen">
          <div className="container mx-auto px-4">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto text-center py-24"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 font-[Geist]">
                Find Your Passion
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 font-[Geist]">
                Join clubs and communities that match your interests and talents
              </p>
              <Button size="lg" className="font-medium font-[Geist]">
                Get Started
              </Button>
            </motion.div>

            {/* Search Section */}
            <div className="py-12">
              <SearchBar />
            </div>

            {/* CnC Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
              {DUMMY_CNCS.map((cnc) => (
                <CncCard key={cnc.id} cnc={cnc} />
              ))}
            </div>
          </div>
        </AuroraBackground>
      </main>

      <Footer />
    </div>
  )
}