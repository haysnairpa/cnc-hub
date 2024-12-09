import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useAuth } from "@/components/contexts/AuthContext"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/config/firebase"
import { getRecommendations } from "@/utils/recommender"
import CncCard from "@/components/cnc/CncCard"
import { RefreshCw, Home } from "lucide-react"

const questions = [
  {
    id: 1,
    question: "What attracts you to join a CnC?",
    subtitle: "Apa yang membuatmu tertarik untuk bergabung dengan CnC?",
    options: [
      {
        text: "Enjoy creating/building things with technology",
        translation: "Suka membuat/menciptakan sesuatu dengan teknologi",
        category: "technology",
        keywords: ["create", "build", "technology", "development", "innovation", "coding"]
      },
      {
        text: "Want to express yourself through art & creativity", 
        translation: "Ingin mengekspresikan diri melalui seni & kreativitas",
        category: "arts",
        keywords: ["expression", "creative", "art", "performance", "design", "media"]
      },
      {
        text: "Enjoy being active & participating in team activities",
        translation: "Senang bergerak aktif & berpartisipasi dalam kegiatan tim",
        category: "sports",
        keywords: ["active", "team", "sports", "physical", "competition", "fitness"]
      },
      {
        text: "Interested in deeply learning something new",
        translation: "Tertarik mempelajari hal baru secara mendalam",
        category: "education",
        keywords: ["learn", "research", "knowledge", "study", "academic", "explore"]
      }
    ]
  },
  {
    id: 2,
    question: "How do you usually spend your free time?",
    subtitle: "Bagaimana kamu biasanya menghabiskan waktu luang?",
    options: [
      {
        text: "Coding/gaming/exploring new technologies",
        translation: "Ngoding/main game/eksplor teknologi baru",
        category: "technology",
        keywords: ["coding", "gaming", "technology", "computer", "development"]
      },
      {
        text: "Drawing/designing/photography/music/watching movies",
        translation: "Menggambar/desain/foto/musik/nonton film",
        category: "arts",
        keywords: ["drawing", "design", "music", "film", "photography", "art"]
      },
      {
        text: "Exercising/playing futsal/basketball/working out",
        translation: "Olahraga/main futsal/basket/workout",
        category: "sports",
        keywords: ["sports", "exercise", "basketball", "fitness", "active"]
      },
      {
        text: "Reading books/articles/discussions/online learning",
        translation: "Baca buku/artikel/diskusi/belajar online",
        category: "education",
        keywords: ["reading", "learning", "discussion", "study", "research"]
      }
    ]
  },
  {
    id: 3,
    question: "What do you hope to gain from joining a CnC?",
    subtitle: "Apa yang kamu harapkan bisa didapat dari CnC?",
    options: [
      {
        text: "Practical skills & a portfolio for your career",
        translation: "Skill praktis & portofolio untuk karir",
        category: "technology",
        keywords: ["skills", "portfolio", "career", "practical", "professional"]
      },
      {
        text: "A platform to create & showcase your talent",
        translation: "Wadah berkreasi & showcase bakat",
        category: "arts",
        keywords: ["creativity", "talent", "showcase", "performance", "exhibition"]
      },
      {
        text: "A sports community & team achievements",
        translation: "Komunitas olahraga & prestasi tim",
        category: "sports",
        keywords: ["community", "achievement", "team", "competition", "sports"]
      },
      {
        text: "Self-development & new insights",
        translation: "Pengembangan diri & wawasan baru",
        category: "education",
        keywords: ["development", "knowledge", "insight", "learning", "growth"]
      }
    ]
  }
]

const getPersonalityDescription = (answers) => {
  const categoryCount = answers.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {});

  const dominantCategory = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])[0][0];

  const descriptions = {
    technology: "It looks like you're someone who enjoys creating and innovating with technology! You have a natural inclination towards building things and solving problems through technical solutions. Your interest in technology and practical skills would be valuable in communities that focus on development and innovation.",
    arts: "You appear to be a creative soul with a strong artistic inclination! Your desire to express yourself through various art forms and your creative mindset would thrive in communities that celebrate artistic expression and creative collaboration.",
    sports: "You seem to be an energetic person who values physical activity and teamwork! Your enthusiasm for sports and team activities shows you'd excel in communities that promote athletic achievement and team spirit.",
    education: "You come across as a curious and knowledge-seeking individual! Your passion for learning and intellectual growth would be perfect for communities that focus on academic exploration and research."
  };

  return descriptions[dominantCategory];
};

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const navigate = useNavigate()
  const { userData } = useAuth()
  const [showResults, setShowResults] = useState(false)
  const [recommendedCommunities, setRecommendedCommunities] = useState([])
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!userData) {
      navigate("/")
    }
  }, [userData])

  const handleAnswer = async (option) => {
    const newAnswers = [...answers, {
      category: option.category,
      keywords: option.keywords,
      weight: currentQuestion === questions.length - 1 ? 1.5 : 1
    }]
    setAnswers(newAnswers)
    setProgress((currentQuestion + 1) * (100 / questions.length))

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      // Proses jawaban dengan bobot
      const categoryCount = newAnswers.reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + (curr.weight || 1)
        return acc
      }, {})

      const allKeywords = newAnswers.flatMap(a => a.keywords)
      
      const userPreferences = {
        category: Object.entries(categoryCount)
          .sort((a, b) => b[1] - a[1])[0][0],
        keywords: allKeywords,
        interests: [...new Set(allKeywords)],
        answeredAt: new Date()
      }

      // Simpan ke localStorage
      localStorage.setItem('userPreferences', JSON.stringify(userPreferences))
      
      // Fetch communities dan dapatkan rekomendasi
      const querySnapshot = await getDocs(collection(db, "communities"))
      const allCommunities = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        logo: doc.data().image,
        shortDescription: doc.data().description,
        memberCount: doc.data().members?.filter((m) => m.status === "member").length + 1 || 0,
        registrationOpen: doc.data()?.registrationOpen || false,
      }))

      const recommendations = getRecommendations(userPreferences, allCommunities)
      // Ambil 4 rekomendasi teratas
      setRecommendedCommunities(recommendations.slice(0, 4))
      setShowResults(true)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 font-[Geist]">
      {!showResults ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full space-y-8"
        >
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">
              {questions[currentQuestion].question}
            </h2>
            <p className="text-muted-foreground italic">
              {questions[currentQuestion].subtitle}
            </p>
            <div className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="grid gap-4">
            {questions[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                variant="outline" 
                className="p-8 text-lg justify-start h-auto flex flex-col items-start"
                onClick={() => handleAnswer(option)}
              >
                <span>{option.text}</span>
                <span className="text-sm text-muted-foreground mt-1 italic">
                  {option.translation}
                </span>
              </Button>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl w-full space-y-8"
        >
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold">
              Your Personal Match
            </h2>
            
            <div className="max-w-2xl mx-auto">
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {getPersonalityDescription(answers)}
              </p>
            </div>

            <h3 className="text-2xl font-semibold mt-12">
              Recommended Communities for You
            </h3>
            <p className="text-muted-foreground">
              Based on your interests, here are some communities you might like
            </p>
          </div>

          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedCommunities.map((cnc) => (
                <div key={cnc.id} className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <CncCard cnc={cnc} />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                  
                  {/* Match score & Apply button */}
                  <div className="absolute inset-x-0 bottom-0 p-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <div className="h-2 w-2 rounded-full bg-green-400" />
                        <span className="text-sm font-medium text-white">
                          {Math.round(cnc.similarityScore * 100)}% Match
                        </span>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => navigate(`/cnc/${cnc.id}?action=apply`)}
                      size="sm"
                      className="bg-white hover:bg-white/90 text-black font-medium"
                    >
                      Apply Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Button onClick={() => {
              setCurrentQuestion(0)
              setAnswers([])
              setProgress(0)
              setShowResults(false)
            }} variant="outline">
              Retake Quiz
            </Button>
            <Button onClick={() => navigate("/")} variant="outline">
              Back to Home
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
