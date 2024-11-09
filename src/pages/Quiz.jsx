import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

const questions = [
  {
    id: 1,
    question: "What do you like the most?",
    options: [
      { text: "Technology & Programming", category: "Technology" },
      { text: "Arts & Creativity", category: "Arts & Media" },
      { text: "Sports & Physical Activities", category: "Sports" },
      { text: "Learning & Research", category: "Academic" }
    ]
  },
  {
    id: 2,
    question: "How do you spend your free time?",
    options: [
      { text: "Creating/Learning technical things", category: "Technology" },
      { text: "Being creative & expressing myself", category: "Arts & Media" },
      { text: "Exercising & being active", category: "Sports" },
      { text: "Reading & learning new things", category: "Academic" }
    ]
  },
  {
    id: 3,
    question: "What's your main goal in joining CnC?",
    options: [
      { text: "Develop technical skills", category: "Technology" },
      { text: "Express creativity", category: "Arts & Media" },
      { text: "Improve fitness", category: "Sports" },
      { text: "Deepen knowledge", category: "Academic" }
    ]
  }
]

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const navigate = useNavigate()

  const handleAnswer = (category) => {
    const newAnswers = [...answers, category]
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      // Itung kategori yg banyak dipilih
      const categoryCount = newAnswers.reduce((acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1
        return acc
      }, {})
      
      const recommendedCategory = Object.entries(categoryCount)
        .sort((a, b) => b[1] - a[1])[0][0]

      navigate(`/?recommended=${recommendedCategory}`)
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
              onClick={() => handleAnswer(option.category)}
            >
              {option.text}
            </Button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
