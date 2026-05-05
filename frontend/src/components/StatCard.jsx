import Card from './Card'

export default function StatCard({ label, value, detail }) {
  return (
    <Card className="border-2 border-mint bg-forest-950 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:border-mint-400 hover:bg-forest-900">
      <p className="text-sm uppercase tracking-[0.28em] text-mint-400 font-archivo">{label}</p>
      <p className="mt-5 text-3xl font-bold text-cream font-bebas">{value}</p>
      <p className="mt-3 text-sm leading-6 text-mint-100 font-archivo">{detail}</p>
    </Card>
  )
}
