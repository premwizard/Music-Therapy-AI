export default function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full rounded-none border-2 border-mint bg-forest-950 px-4 py-3 text-sm text-cream outline-none transition-all duration-300 ease-in-out focus:border-mint-400 focus:ring-2 focus:ring-mint-500/30 placeholder-mint-100 font-archivo ${className}`.trim()}
      {...props}
    />
  )
}
