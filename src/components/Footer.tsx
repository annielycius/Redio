import { Heart, Github, Twitter, Facebook, Linkedin, Send, Phone, Radio, Mail, MapPin, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card/80 backdrop-blur-sm border-t border-primary/20 py-8 mt-auto animate-fade-in relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-wave" />
      <div className="absolute inset-x-0 top-0.5 h-0.5 bg-gradient-to-r from-transparent via-accent/50 to-transparent animate-wave" style={{ animationDelay: "0.5s" }} />

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <img src="/logo.svg" alt="Bongo Redio Logo" className="w-8 h-8" />
              <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Bongo Redio
              </h3>
            </div>
            <p className="text-white/70 text-sm">
              A modern web application for streaming Tanzanian radio stations. Listen to your favorite stations with a beautiful, responsive interface.
            </p>
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Radio className="w-4 h-4 text-primary" />
              <span>Streaming Tanzanian radio since 2023</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/" className="text-white/70 hover:text-primary transition-colors text-sm flex items-center gap-1">
                <Radio className="w-3 h-3" /> Home
              </Link>
              <Link to="/privacy" className="text-white/70 hover:text-primary transition-colors text-sm flex items-center gap-1">
                <Mail className="w-3 h-3" /> Privacy Policy
              </Link>
              <Link to="/terms" className="text-white/70 hover:text-primary transition-colors text-sm flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Terms of Service
              </Link>
              <Link to="/contact" className="text-white/70 hover:text-primary transition-colors text-sm flex items-center gap-1">
                <Phone className="w-3 h-3" /> Contact
              </Link>
              <a
                href="https://github.com/annielycius/Redio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-primary transition-colors text-sm flex items-center gap-1"
              >
                <Github className="w-3 h-3" /> Source Code
              </a>
              <a
                href="https://radio-browser.info"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-primary transition-colors text-sm flex items-center gap-1"
              >
                <Radio className="w-3 h-3" /> Radio Browser API
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-white">Contact</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Dar es Salaam, Tanzania</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <Phone className="w-4 h-4 text-primary" />
                <a href="tel:+255767233231" className="hover:text-primary transition-colors">+255 767 233 231</a>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:annielycius@gmail.com" className="hover:text-primary transition-colors">annielycius@gmail.com</a>
              </div>
            </div>

            <div className="flex gap-4 mt-2">
              <a
                href="https://github.com/annielycius"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-primary transition-all transform hover:scale-110"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://x.com/annielycius"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-primary transition-all transform hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/anniewebsterjames"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-primary transition-all transform hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/annielycius"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-primary transition-all transform hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://t.me/annielycius"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-primary transition-all transform hover:scale-110"
                aria-label="Telegram"
              >
                <Send className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-primary/20 pt-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-white/60 text-sm">Made with</span>
            <Heart className="w-4 h-4 text-primary animate-pulse-slow" />
            <span className="text-white/60 text-sm">by Annie Webester James</span>
          </div>
          <div className="text-white/60 text-sm">
            © {currentYear} Bongo Redio. All rights reserved.
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-wave" />
      <div className="absolute inset-x-0 bottom-0.5 h-0.5 bg-gradient-to-r from-transparent via-accent/50 to-transparent animate-wave" style={{ animationDelay: "0.5s" }} />
    </footer>
  );
};
