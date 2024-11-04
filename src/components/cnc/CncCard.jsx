import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function CncCard({ cnc }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group relative overflow-hidden rounded-xl border bg-card font-[Geist]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/0 z-10" />
        <img 
          src={cnc.logo} 
          alt={cnc.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" 
        />
        <Badge className="absolute top-4 right-4 z-20" variant="secondary">
          {cnc.category}
        </Badge>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h3 className="font-semibold text-xl mb-2 line-clamp-1">{cnc.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {cnc.shortDescription}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{cnc.memberCount || 0} Members</span>
            {cnc.registrationOpen && (
              <Badge variant="outline" className="text-xs">
                Open Registration
              </Badge>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => window.location.href = `/cnc/${cnc.id}`}
          >
            View Details →
          </Button>
        </div>
      </div>
    </motion.div>
  )
} 