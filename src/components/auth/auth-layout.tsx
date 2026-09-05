"use client";

import { ReactNode, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Key } from "lucide-react";
import Link from "next/link";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  showBackLink?: boolean;
  backLinkText?: string;
  backLinkHref?: string;
}

export function AuthLayout({ 
  children, 
  title, 
  subtitle, 
  showBackLink = true,
  backLinkText = "Back to Home",
  backLinkHref = "/"
}: AuthLayoutProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [particles, setParticles] = useState<Array<{ x: number; y: number; scale: number; duration: number }>>([]);

  useEffect(() => {
    setIsMounted(true);
    setParticles(
      [...Array(20)].map(() => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        scale: Math.random() * 0.5 + 0.5,
        duration: Math.random() * 10 + 10,
      }))
    );
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] via-[#1E40AF] to-[#0F2744] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-white/5 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-white/5 to-transparent rounded-full blur-3xl"
        />
      </div>

      {/* Floating particles - reduce on mobile for performance */}
      {isMounted && particles.slice(0, isMounted && window.innerWidth < 640 ? 10 : 20).map((particle, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white/20 rounded-full"
          initial={{
            x: particle.x,
            y: particle.y,
            scale: particle.scale,
          }}
          animate={{
            y: [null, -Math.random() * 500 - 200],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 15,
            delay: 0.2
          }}
          className="flex justify-center mb-6 sm:mb-8"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center shadow-2xl shadow-white/10 border border-white/20">
            <Key size={32} className="text-white sm:hidden" />
            <Key size={40} className="text-white hidden sm:block" />
          </div>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl p-5 sm:p-8 shadow-2xl border border-white/20"
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-6 sm:mb-8"
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{title}</h1>
            <p className="text-white/70 text-sm sm:text-base">{subtitle}</p>
          </motion.div>

          {children}

          {showBackLink && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 text-center"
            >
              <Link
                href={backLinkHref}
                className="text-white/70 hover:text-white transition-colors text-sm font-medium"
              >
                {backLinkText}
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* Brand */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-6 sm:mt-8"
        >
          <p className="text-white/50 text-xs sm:text-sm">TrustedAccounts</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
