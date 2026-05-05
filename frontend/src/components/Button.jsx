export default function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const baseStyles = 'inline-flex items-center justify-center rounded-none border-2 font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-mint-500/40 disabled:cursor-not-allowed disabled:opacity-70 font-archivo hover:scale-[1.02]'
  const variants = {
    primary: 'border-mint-500 bg-mint-500 text-forest-950 hover:bg-mint-400',
    secondary: 'border-mint-500 bg-forest-950 text-cream hover:bg-forest-900',
    outline: 'border-mint-500 bg-transparent text-forest-950 hover:bg-mint-50',
    ghost: 'border-transparent bg-transparent text-mint-500 hover:text-mint-400 hover:bg-mint-50',
  }
  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant] ?? variants.primary} ${sizes[size] ?? sizes.md} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  )
}
