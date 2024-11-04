import { Github, Instagram, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">CnC Hub</h3>
            <p className="text-muted-foreground">
              CnC (Club & Community) Hub is your gateway to a vibrant campus life. Discover, join, and thrive in our diverse range of student-led organizations.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Links</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>Feedback</li>
              <li>FAQ</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <div className="flex gap-4">
              <Instagram className="h-5 w-5" />
              <Github className="h-5 w-5" />
              <Mail className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p>© 2024 CnC Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
