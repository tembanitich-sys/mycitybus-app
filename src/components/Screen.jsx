import { motion } from 'framer-motion'

// Lightweight per-screen mount transition (fade + slide-up). Used instead of full route
// exit/enter choreography — simpler, and reads as "smooth" without overdoing it.
export default function Screen({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
