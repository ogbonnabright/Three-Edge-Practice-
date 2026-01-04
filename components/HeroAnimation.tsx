
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const HeroAnimation: React.FC = () => {
  // Generate a set of particles
  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5,
      duration: Math.random() * 4 + 4,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
      {/* Abstract Line Bursts */}
      <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {[1, 2, 3].map((i) => (
          <motion.circle
            key={`burst-${i}`}
            cx={50 + (i * 10 - 20)}
            cy={50 + (i * 5 - 10)}
            r="0.5"
            fill="#990000"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 40],
              opacity: [0, 0.4, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: i * 2,
              ease: "easeOut",
            }}
          />
        ))}
      </svg>

      {/* Floating Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-[#990000]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 0.8, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Subtle Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
    </div>
  );
};

export default HeroAnimation;
