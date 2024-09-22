"use client";

import { useState, useRef, useEffect, useId } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { Twitter, Moon, Sun, LogIn, LogOut, X, Menu } from "lucide-react";
import useClickOutside from "./useClickOutside";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";

const TRANSITION = {
  type: "spring",
  bounce: 0.1,
  duration: 0.3,
};

export default function Component() {
  const uniqueId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { setTheme, theme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(theme === "dark");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDarkMode = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    setIsDarkMode(!isDarkMode);
  };
  const toggleLogin = () => setIsLoggedIn(!isLoggedIn);

  useClickOutside(menuRef, () => {
    if (isOpen) setIsOpen(false);
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return (
    <MotionConfig transition={TRANSITION}>
      <div className="fixed bottom-4 right-4 z-50">
        <motion.div
          ref={menuRef}
          layoutId={`menu-${uniqueId}`}
          className="bg-card rounded-lg shadow-lg overflow-hidden "
          style={{
            width: isOpen ? 256 : "auto",
            height: isOpen ? "auto" : 36,
          }}
        >
          {isOpen ? (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <motion.span
                  layoutId={`menu-label-${uniqueId}`}
                  className="text-lg font-semibold text-gray-900 dark:text-gray-100"
                >
                  Menu
                </motion.span>
                <button
                  type="button"
                  onClick={toggleMenu}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>
              <motion.ul
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2"
              >
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      console.log("Share on Twitter");
                      // Add your Twitter share logic here
                    }}
                    className="flex items-center w-full px-3 py-2 text-sm text-left text-card-foreground hover:bg-card-foreground/10 rounded-md p-2"
                  >
                    <Twitter size={18} className="mr-2" />
                    Share on Twitter
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={toggleDarkMode}
                    className="flex items-center w-full px-3 py-2 text-sm text-left text-card-foreground hover:bg-card-foreground/10 rounded-md p-2"
                  >
                    {isDarkMode ? (
                      <Sun size={18} className="mr-2" />
                    ) : (
                      <Moon size={18} className="mr-2" />
                    )}
                    {isDarkMode ? "Light Mode" : "Dark Mode"}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={toggleLogin}
                    className="flex items-center w-full px-3 py-2 text-sm text-left text-card-foreground hover:bg-card-foreground/10 rounded-md p-2"
                  >
                    {isLoggedIn ? (
                      <>
                        <LogOut size={18} className="mr-2" />
                        Sign Out
                      </>
                    ) : (
                      <>
                        <LogIn size={18} className="mr-2" />
                        Sign In
                      </>
                    )}
                  </button>
                </li>
              </motion.ul>
            </div>
          ) : (
            <Button asChild size="icon">
              <motion.button
                layoutId={`menu-button-${uniqueId}`}
                onClick={toggleMenu}
              >
                <motion.span layoutId={`menu-label-${uniqueId}`}>
                  <Menu />
                </motion.span>
              </motion.button>
            </Button>
          )}
        </motion.div>
      </div>
    </MotionConfig>
  );
}
