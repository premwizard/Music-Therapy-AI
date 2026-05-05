export default function AuthCard({ badge, title, subtitle, children, footer }) {
  return (
    <div className="w-full border-2 border-mint bg-forest-950 p-8 text-cream transition-all duration-300 ease-in-out hover:scale-[1.01]">
      <div className="mb-6 space-y-3">
        {badge ? <div className="inline-flex items-center border-2 border-mint bg-forest-950 px-3 py-1 text-sm font-semibold text-mint-400 font-archivo">{badge}</div> : null}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-cream font-bebas">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-mint-100 font-archivo">{subtitle}</p>
        </div>
      </div>
      <div className="space-y-6">{children}</div>
      {footer ? <div className="mt-8 text-center text-sm text-mint-100 font-archivo">{footer}</div> : null}
    </div>
  )
}
