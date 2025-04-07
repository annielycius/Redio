import { Github, Twitter, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "./ui/button";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-card/80 backdrop-blur-sm border-b border-primary/20 animate-fade-in relative z-50">
      <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-wave" />
      <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-accent/50 to-transparent animate-wave" style={{ animationDelay: "0.5s" }} />
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/logo.svg"
              alt="Bongo Redio Logo"
              className="w-8 h-8 transition-transform group-hover:scale-110 animate-float"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Bongo Redio
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/" className="text-white/80 hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/privacy" className="text-white/80 hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="text-white/80 hover:text-primary transition-colors">
              Terms
            </Link>
            <Link to="/contact" className="text-white/80 hover:text-primary transition-colors">
              Contact
            </Link>
            <div className="h-4 w-px bg-primary/20 mx-2" />
            <a
              href="https://github.com/annielycius/Redio"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-white/80 hover:text-primary transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
            <a
              href="https://x.com/annielycius"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-white/80 hover:text-primary transition-colors"
            >
              <Twitter className="w-4 h-4" />
              <span>Twitter</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5 text-primary" />
            ) : (
              <Menu className="h-5 w-5 text-primary" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-card/95 backdrop-blur-md border-b border-primary/20 animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link
              to="/"
              className="text-white/80 hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/privacy"
              className="text-white/80 hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="text-white/80 hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Terms
            </Link>
            <Link
              to="/contact"
              className="text-white/80 hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="h-px w-full bg-primary/20 my-2" />
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/annielycius/Redio"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-white/80 hover:text-primary transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
              <a
                href="https://x.com/annielycius"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-white/80 hover:text-primary transition-colors"
              >
                <Twitter className="w-4 h-4" />
                <span>Twitter</span>
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-wave" />
      <div className="absolute inset-x-0 bottom-0.5 h-0.5 bg-gradient-to-r from-transparent via-accent/50 to-transparent animate-wave" style={{ animationDelay: "0.5s" }} />
    </nav>
  );
};