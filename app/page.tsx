// components/AdvancedCountdownTimer.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, easeIn } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  Minus,
  Maximize,
  Minimize,
  Settings,
  Zap,
  Moon,
  Sun,
  Icon,
  Clock4,
  TimerReset,
  Github,
  UserRoundPen,
} from "lucide-react";

interface CountdownTimerProps {
  initialMinutes?: number;
}

export default function AdvancedCountdownTimer({
  initialMinutes = 1,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [initialTime, setInitialTime] = useState(initialMinutes * 60);
  const [showDeveloperLinksSet, setShowDeveloperLinksSet] = useState(false);
  const [theme, setTheme] = useState<"neon" | "sunset" | "ocean" | "forest">(
    "neon"
  );
  const [showSettings, setShowSettings] = useState(false);
  const [showAdjustTime, setShowAdjustTime] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  // Theme configurations
  const themes = {
    neon: {
      primary: "#00f5ff",
      secondary: "#ff00ff",
      accent: "#00ff88",
      bg: "from-gray-900 via-purple-900 to-gray-900",
      glow: "shadow-[0_0_30px_rgba(0,245,255,0.5)]",
      progress: "text-cyan-400",
    },
    sunset: {
      primary: "#ff6b6b",
      secondary: "#ffa726",
      accent: "#ffeb3b",
      bg: "from-orange-900 via-red-900 to-purple-900",
      glow: "shadow-[0_0_30px_rgba(255,107,107,0.5)]",
      progress: "text-orange-400",
    },
    ocean: {
      primary: "#4fc3f7",
      secondary: "#29b6f6",
      accent: "#00e5ff",
      bg: "from-blue-900 via-cyan-900 to-teal-900",
      glow: "shadow-[0_0_30px_rgba(79,195,247,0.5)]",
      progress: "text-blue-400",
    },
    forest: {
      primary: "#66bb6a",
      secondary: "#4caf50",
      accent: "#00e676",
      bg: "from-green-900 via-emerald-900 to-teal-900",
      glow: "shadow-[0_0_30px_rgba(102,187,106,0.5)]",
      progress: "text-emerald-400",
    },
  };

  const currentTheme = themes[theme];

  // Create floating particles
  const createParticles = useCallback(() => {
    if (!particlesRef.current) return;

    particlesRef.current.innerHTML = "";
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = `absolute rounded-full ${
        i % 3 === 0
          ? "bg-white"
          : i % 3 === 1
          ? `bg-[${currentTheme.primary}]`
          : `bg-[${currentTheme.accent}]`
      }`;

      const size = Math.random() * 6 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.opacity = `${Math.random() * 0.6 + 0.2}`;
      particle.style.animation = `float ${
        Math.random() * 10 + 5
      }s infinite ease-in-out ${Math.random() * 5}s`;

      particlesRef.current.appendChild(particle);
    }
  }, [currentTheme]);

  useEffect(() => {
    createParticles();
  }, [createParticles]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const playBeep = useCallback(() => {
    // Create a more sophisticated beep sequence
    const beepSequence = [800, 1000, 1200, 1000, 800];
    beepSequence.forEach((freq, index) => {
      setTimeout(() => {
        const audioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = freq;
        oscillator.type = "sine";

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.3
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      }, index * 400);
    });

    // Create visual explosion effect
    createParticles();
  }, [createParticles]);

  const toggleFullscreen = async () => {
    setShowAdjustTime(false);
    setShowSettings(false);
    setShowDeveloperLinksSet(false);

    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Countdown logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      playBeep();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, playBeep]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(initialTime);
    if (!isActive) {
      setInitialTime(initialTime);
    }
  };

  const addTime = (seconds: number) => {
    if (timeLeft + seconds < 0) return;
    const newTime = timeLeft + seconds;
    setTimeLeft(newTime);
    if (!isActive) {
      setInitialTime(newTime);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        easeIn,
      },
    },
  };

  const progress = (timeLeft / initialTime) * 100;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      ref={containerRef}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`
        relative flex justify-center items-center h-full w-full overflow-hidden
        bg-linear-to-br ${currentTheme.bg}
        overflow-hidden
        ${isFullscreen ? "fixed inset-0 z-50" : "h-full"}
      `}
      style={{
        background: `radial-gradient(circle at 20% 80%, ${currentTheme.primary}20, transparent 50%),
                    radial-gradient(circle at 80% 20%, ${currentTheme.secondary}20, transparent 50%),
                    radial-gradient(circle at 40% 40%, ${currentTheme.accent}15, transparent 50%)`,
      }}
    >
      {/* Animated Background Particles */}
      <div
        ref={particlesRef}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-20 blur-xl"
          style={{
            background: `radial-gradient(circle, ${currentTheme.primary}, transparent)`,
          }}
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-15 blur-xl"
          style={{
            background: `radial-gradient(circle, ${currentTheme.secondary}, transparent)`,
          }}
        />
      </div>

      {/* Control Buttons */}
      {!isFullscreen && (
        <div className="absolute top-1 right-4 flex space-x-2 z-10">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setShowDeveloperLinksSet(!showDeveloperLinksSet);
              setShowSettings(false);
              setShowAdjustTime(false);
            }}
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all duration-300"
          >
            <UserRoundPen className="w-5 h-5 text-white" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setShowAdjustTime(!showAdjustTime);
              setShowSettings(false);
              setShowDeveloperLinksSet(false);
            }}
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all duration-300"
          >
            <Clock4 className="w-5 h-5 text-white" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setShowSettings(!showSettings);
              setShowAdjustTime(false);
              setShowDeveloperLinksSet(false);
            }}
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all duration-300"
          >
            <Settings className="w-5 h-5 text-white" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleFullscreen}
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all duration-300"
          >
            {isFullscreen ? (
              <Minimize className="w-5 h-5 text-white" />
            ) : (
              <Maximize className="w-5 h-5 text-white" />
            )}
          </motion.button>
        </div>
      )}

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="z-50 absolute top-20 right-4 bg-transparent backdrop-blur-xl rounded-2xl p-6 border border-white/20"
          >
            <h3 className="text-white font-semibold mb-4">Theme Settings</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(themes).map(([key, themeConfig]) => (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTheme(key as any)}
                  className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                    theme === key ? "border-white" : "border-white/20"
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${themeConfig.primary}20, ${themeConfig.secondary}20)`,
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: themeConfig.primary }}
                    />
                    <span className="text-white text-sm capitalize">{key}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Time Adjustment */}
      <AnimatePresence>
        {showAdjustTime && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="z-50 absolute top-20 right-4 bg-transparent backdrop-blur-xl rounded-2xl p-6 border border-white/20 flex flex-col items-center justify-center"
          >
            <h3 className="text-white font-semibold mb-4">Adjust Time</h3>
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => addTime(300)}
                className="p-3 rounded-2xl bg-green-500/20 hover:bg-green-500/30 text-white transition-all duration-300 backdrop-blur-md border border-green-400/50 flex items-center justify-center"
              >
                <Plus className="w-5 h-5" />
                <span>5m</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => addTime(-300)}
                className="p-3 rounded-2xl bg-red-500/20 hover:bg-red-500/30 text-white transition-all duration-300 backdrop-blur-md border border-red-400/50 flex items-center justify-center"
              >
                <Minus className="w-5 h-5" />
                <span>5m</span>
              </motion.button>
              <motion.button
                onClick={() => resetTimer()}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 rounded-2xl bg-green-500/20 hover:bg-green-500/30 text-white transition-all duration-300 backdrop-blur-md border border-green-400/50 flex items-center justify-center"
              >
                <TimerReset className="w-5 h-5" />
                <span>Reset</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Developer Links Set */}
      <AnimatePresence>
        {showDeveloperLinksSet && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="z-50 absolute top-20 right-20 bg-transparent backdrop-blur-xl rounded-2xl p-6 border border-white/20 flex flex-col items-center justify-center"
          >
            <h3 className="text-white font-semibold mb-4">Developer Links</h3>
            <div className="flex flex-col space-y-3">
              {[
                {
                  name: "GitHub",
                  link: "https://github.com/muhammadsherazsandila",
                },
                {
                  name: "Portfolio",
                  link: "https://sherazportfolio.vercel.app",
                },
                { name: "Agency", link: "https://sandiladigix.com" },
                {
                  name: "LinkedIn",
                  link: "https://www.linkedin.com/in/muhammad-sheraz-800948347",
                },
              ].map((devLink) => (
                <motion.a
                  key={devLink.name + devLink.link}
                  href={devLink.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:underline"
                >
                  {devLink.name}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        variants={containerVariants}
        className="text-center space-y-8 w-full max-w-md relative z-10"
      >
        {/* Circular Progress Timer */}
        <motion.div
          variants={itemVariants}
          className="relative flex items-center justify-center"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <svg
            className=" w-auto h-auto transform -rotate-90"
            viewBox="0 0 200 200"
          >
            {/* Glow effect */}
            <defs>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background circle with gradient */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke="url(#gradientBg)"
              strokeWidth="8"
              fill="none"
              className="opacity-30"
            />

            {/* Progress circle */}
            <motion.circle
              cx="100"
              cy="100"
              r={radius}
              stroke="url(#gradientProgress)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              filter="url(#glow)"
            />

            {/* Gradient definitions */}
            <defs>
              <linearGradient
                id="gradientProgress"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor={currentTheme.primary} />
                <stop offset="100%" stopColor={currentTheme.secondary} />
              </linearGradient>
              <linearGradient
                id="gradientBg"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  stopColor={currentTheme.primary}
                  stopOpacity="0.3"
                />
                <stop
                  offset="100%"
                  stopColor={currentTheme.secondary}
                  stopOpacity="0.3"
                />
              </linearGradient>
            </defs>
          </svg>

          {/* Time display */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center space-y-2"
            animate={
              isActive
                ? {
                    scale: timeLeft <= 10 ? [1, 1.02, 1] : 1,
                  }
                : {}
            }
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="text-6xl sm:text-7xl font-bold text-white font-mono drop-shadow-lg"
              style={{ textShadow: `0 0 20px ${currentTheme.primary}80` }}
            >
              {formatTime(timeLeft)}
            </motion.div>
            <motion.div
              className={`text-sm font-medium ${
                timeLeft <= 10 ? "text-red-300" : "text-white/70"
              }`}
              animate={timeLeft <= 10 ? { opacity: [1, 0.5, 1] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              {isActive
                ? "Counting down..."
                : timeLeft === 0
                ? "Time's up!"
                : "Ready"}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Control Buttons */}
        {!isFullscreen && (
          <motion.div
            variants={itemVariants}
            className="flex justify-center space-x-4"
          >
            <motion.button
              whileHover={{
                scale: 1.1,
                boxShadow: `0 0 30px ${currentTheme.primary}80`,
              }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTimer}
              className={`
              flex items-center justify-center w-16 h-16 rounded-2xl
              transition-all duration-300 backdrop-blur-md border
              ${
                isActive
                  ? "bg-red-500/20 hover:bg-red-500/30 border-red-400/50"
                  : "bg-green-500/20 hover:bg-green-500/30 border-green-400/50"
              }
            `}
              style={{
                background: isActive
                  ? `linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.1))`
                  : `linear-gradient(135deg, rgba(34,197,94,0.2), rgba(34,197,94,0.1))`,
              }}
            >
              {isActive ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white ml-1" />
              )}
            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.1,
                boxShadow: `0 0 30px ${currentTheme.accent}80`,
              }}
              whileTap={{ scale: 0.9 }}
              onClick={resetTimer}
              className="
              flex items-center justify-center w-16 h-16 rounded-2xl
              bg-blue-500/20 hover:bg-blue-500/30 text-white
              transition-all duration-300 backdrop-blur-md
              border border-blue-400/50
            "
              style={{
                background: `linear-gradient(135deg, rgba(59,130,246,0.2), rgba(59,130,246,0.1))`,
              }}
            >
              <RotateCcw className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      {/* Add custom CSS for floating animation */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
      `}</style>
    </motion.div>
  );
}
