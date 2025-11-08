import { Github, Linkedin, Globe } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted dark:bg-gray-900 border-t border-border dark:border-gray-800 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center gap-6">
          {/* Text */}
          <div className="text-center">
            <p className="text-muted-foreground dark:text-gray-400">© 2025 Zentro Restaurant — Desarrollado por Juan David Lozano</p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="p-2 hover:bg-background dark:hover:bg-gray-800 rounded-full transition-colors text-foreground dark:text-white hover:text-primary"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="p-2 hover:bg-background dark:hover:bg-gray-800 rounded-full transition-colors text-foreground dark:text-white hover:text-primary"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="p-2 hover:bg-background dark:hover:bg-gray-800 rounded-full transition-colors text-foreground dark:text-white hover:text-primary"
              aria-label="Portafolio"
            >
              <Globe className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
