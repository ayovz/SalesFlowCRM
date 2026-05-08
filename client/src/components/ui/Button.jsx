import { motion } from 'framer-motion'

const VARIANTS = {
  primary:   'bg-primary text-on-primary hover:bg-primary-container',
  secondary: 'bg-surface-container text-on-surface hover:bg-outline-variant/40 border border-outline-variant',
  danger:    'bg-red-600 text-white hover:bg-red-700',
  ghost:     'text-on-surface-variant hover:bg-surface-container',
}

const SIZES = {
  sm: 'h-8  px-3 text-xs gap-1.5',
  md: 'h-9  px-4 text-sm gap-2',
  lg: 'h-11 px-5 text-sm gap-2',
}

export default function Button({
  children, variant = 'primary', size = 'md',
  className = '', disabled, onClick, type = 'button',
}) {
  return (
    <motion.button
      type={type}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-colors
        ${VARIANTS[variant]} ${SIZES[size]}
        disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </motion.button>
  )
}
