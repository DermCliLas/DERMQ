'use client'

import { motion } from 'framer-motion'

interface ElegantDividerProps {
  fromBg?: string;
  toBg?: string;
}

export default function ElegantDivider({ 
  fromBg = '#fafafa', 
  toBg = '#faf8f5' 
}: ElegantDividerProps) {
  // Animation variants
  const lineVariants = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: { 
      scaleX: 1, 
      opacity: 1,
      transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] } 
    }
  }

  const centerVariants = {
    hidden: { opacity: 0, scale: 0.6 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: 'spring', 
        stiffness: 80, 
        damping: 15,
        delay: 0.2
      } 
    }
  }

  const dotVariants = (direction: 'left' | 'right') => ({
    hidden: { x: direction === 'left' ? 20 : -20, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: 'spring', 
        stiffness: 80, 
        damping: 15,
        delay: 0.4
      } 
    }
  })

  return (
    <div 
      className="w-full flex items-center justify-center py-16 relative overflow-hidden select-none"
      style={{
        background: `linear-gradient(to bottom, ${fromBg}, ${toBg})`
      }}
    >
      {/* Background radial soft light for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(240,161,126,0.03)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-5xl w-full flex items-center justify-center px-6 relative z-10">
        {/* Left Side Line */}
        <motion.div 
          className="h-[1px] flex-1 origin-right bg-gradient-to-r from-transparent via-[#02696a]/15 to-[#02696a]/30"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={lineVariants}
        />

        {/* Center Ornament Container */}
        <div className="mx-6 flex items-center justify-center gap-3">
          {/* Left Dot */}
          <motion.div 
            className="w-1.5 h-1.5 rounded-full bg-tertiary"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={dotVariants('left')}
            whileHover={{ scale: 1.3 }}
          />

          {/* Center Diamond Shape */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={centerVariants}
            whileHover={{ 
              rotate: 135,
              scale: 1.1,
              transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
            }}
            className="relative w-7 h-7 flex items-center justify-center cursor-pointer transform rotate-45 group"
          >
            {/* Outer Diamond */}
            <div className="absolute inset-0 rounded-md border border-[#02696a]/30 group-hover:border-tertiary/70 transition-colors duration-500 bg-white/50 backdrop-blur-sm shadow-[0_4px_12px_rgba(2,105,106,0.03)]" />
            
            {/* Middle Diamond (accent/glow) */}
            <div className="absolute inset-1.5 rounded-sm border border-tertiary/30 opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Inner Core Solid Diamond */}
            <div className="absolute w-2 h-2 rounded-xs bg-[#02696a] group-hover:bg-tertiary transition-colors duration-500 shadow-sm" />
          </motion.div>

          {/* Right Dot */}
          <motion.div 
            className="w-1.5 h-1.5 rounded-full bg-tertiary"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={dotVariants('right')}
            whileHover={{ scale: 1.3 }}
          />
        </div>

        {/* Right Side Line */}
        <motion.div 
          className="h-[1px] flex-1 origin-left bg-gradient-to-r from-[#02696a]/30 via-[#02696a]/15 to-transparent"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={lineVariants}
        />
      </div>
    </div>
  )
}
