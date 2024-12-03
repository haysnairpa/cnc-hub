import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

const questions = [
  {
    id: 1,
    question: "What do you like the most?",
    options: [
      { 
        text: "Technology & Programming", 
        category: "Technology",
        keywords: ["coding", "programming", "technical", "computer", "software", "development"]
      },
      { 
        text: "Arts & Creativity", 
        category: "Arts & Media",
        keywords: ["creative", "design", "art", "media", "visual", "expression"] 
      },
      { 
        text: "Sports & Physical Activities", 
        category: "Sports",
        keywords: ["sports", "fitness", "athletic", "physical", "team", "competition"]
      },
      { 
        text: "Learning & Research", 
        category: "Academic",
        keywords: ["research", "study", "academic", "learning", "knowledge", "education"]
      }
    ]
  },
  {
    id: 2,
    question: "How do you spend your free time?",
    options: [
      { 
        text: "Creating/Learning technical things",
        category: "Technology",
        keywords: ["learning", "technical", "building", "problem-solving", "innovation"]
      },
      { 
        text: "Being creative & expressing myself",
        category: "Arts & Media",
        keywords: ["creativity", "expression", "artistic", "imagination", "creation"]
      },
      { 
        text: "Exercising & being active",
        category: "Sports",
        keywords: ["exercise", "active", "physical", "outdoor", "energy"]
      },
      { 
        text: "Reading & learning new things",
        category: "Academic",
        keywords: ["reading", "learning", "discovery", "knowledge", "study"]
      }
    ]
  },
  {
    id: 3, 
    question: "What's your main goal in joining CnC?",
    options: [
      { 
        text: "Develop technical skills",
        category: "Technology",
        keywords: ["skills", "technical", "development", "practical", "expertise"]
      },
      { 
        text: "Express creativity",
        category: "Arts & Media",
        keywords: ["expression", "creative", "portfolio", "artistic", "showcase"]
      },
      { 
        text: "Improve fitness",
        category: "Sports",
        keywords: ["fitness", "health", "improvement", "physical", "training"]
      },
      { 
        text: "Deepen knowledge",
        category: "Academic",
        keywords: ["knowledge", "learning", "research", "academic", "expertise"]
      }
    ]
  }
]

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const navigate = useNavigate()

  const handleAnswer = (option) => {
    const newAnswers = [...answers, {
      category: option.category,
      keywords: option.keywords
    }]
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      // Proses jawaban untuk mendapatkan preferensi
      const categoryCount = newAnswers.reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + 1
        return acc
      }, {})

      // Gabungkan semua keywords
      const allKeywords = newAnswers.flatMap(a => a.keywords)
      
      const userPreferences = {
        category: Object.entries(categoryCount)
          .sort((a, b) => b[1] - a[1])[0][0],
        keywords: allKeywords,
        interests: [...new Set(allKeywords)], // unique keywords
        answeredAt: new Date()
      }

      // Simpan ke localStorage
      localStorage.setItem('userPreferences', JSON.stringify(userPreferences))
      
      navigate(`/?recommended=true`)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 font-[Geist]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full space-y-8"
      >
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">
            {questions[currentQuestion].question}
          </h2>
          <div className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </div>

        <div className="grid gap-4">
          {questions[currentQuestion].options.map((option, index) => (
            <Button
              key={index}
              variant="outline" 
              className="p-8 text-lg justify-start h-auto"
              onClick={() => handleAnswer(option)}
            >
              {option.text}
            </Button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
