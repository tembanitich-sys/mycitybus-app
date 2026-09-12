import { Loader2 } from 'lucide-react'

const VARIANTS = {
  primary: 'bg-brand-red text-white active:bg-brand-red-dark disabled:bg-gray-300',
  secondary: 'bg-brand-navy text-white active:bg-brand-navy-dark disabled:bg-gray-300',
  outline: 'bg-transparent text-brand-navy border-2 border-brand-navy active:bg-brand-navy/5 disabled:border-gray-300 disabled:text-gray-400',
  ghost: 'bg-transparent text-brand-navy active:bg-brand-navy/5 disabled:text-gray-400',
  success: 'bg-brand-green text-white active:bg-brand-green-dark disabled:bg-gray-300',
}

const SIZES = {
  md: 'h-12 px-5 text-[15px]',
  sm: 'h-10 px-4 text-sm',
  lg: 'h-14 px-6 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = true,
  loading = false,
  icon: Icon = null,
  iconPosition = 'right',
  className = '',
  disabled = false,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`tap-highlight-none inline-flex items-center justify-center gap-2 rounded-full font-bold transition-colors active:scale-[0.98] disabled:cursor-not-allowed ${
        VARIANTS[variant]
      } ${SIZES[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {loading && <Loader2 size={18} className="animate-spin" />}
      {!loading && Icon && iconPosition === 'left' && <Icon size={18} />}
      <span>{children}</span>
      {!loading && Icon && iconPosition === 'right' && <Icon size={18} />}
    </button>
  )
}
