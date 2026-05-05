export default function FlatCard({ children, className = '', ...props }) {
  return (
    <div className={`border-2 border-mint bg-forest-950/95 p-6 ${className}`.trim()} {...props}>
      {children}
    </div>
  )
}
