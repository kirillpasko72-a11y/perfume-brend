import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { MagneticButton } from "@/components/MagneticButton/MagneticButton";
import type { NavLink } from "@/types";
import "./Header.css";

const NAV_LINKS: NavLink[] = [
  { label: "Fragrance", href: "#notes" },
  { label: "Story", href: "#story" },
  { label: "Collection", href: "#collection" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className={`header${scrolled ? " header--scrolled" : ""}`}>
      <div className="container header__inner">
        <a href="#top" className="header__logo" data-cursor="link">
          NOIRÉ
        </a>

        <nav className="header__nav" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="header__link">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="header__actions">
          <MagneticButton variant="ghost" href="#collection">
            Explore
          </MagneticButton>
          <button
            type="button"
            className="header__burger"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            className="mobile-nav"
            aria-label="Mobile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                className="mobile-nav__link"
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {link.label}
              </motion.a>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * NAV_LINKS.length, duration: 0.5 }}
            >
              <MagneticButton variant="primary" href="#collection" onClick={() => setMenuOpen(false)}>
                Explore Collection
              </MagneticButton>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
