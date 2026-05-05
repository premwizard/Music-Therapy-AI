export default function Card({ children, className = '', ...props }) {
  return (
    <div className={`rounded-none border-2 border-mint bg-forest-950 p-6 text-cream transition-all duration-300 ease-in-out hover:scale-[1.02] hover:border-mint-400 ${className}`.trim()} {...props}>
      {children}
    </div>
  )
}
