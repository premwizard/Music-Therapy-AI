export default function HowAIWorks() {
  const steps = [
    {
      number: '01',
      title: 'Capture Input',
      description: 'Share your emotions through image, voice, or text',
      icon: '📸',
      details: 'Our AI analyzes multiple emotional signals for comprehensive understanding'
    },
    {
      number: '02',
      title: 'AI Emotion Detection',
      description: 'Advanced algorithms process your emotional state',
      icon: '🧠',
      details: 'Machine learning models identify mood patterns with 98% accuracy'
    },
    {
      number: '03',
      title: 'Therapy + Music',
      description: 'Personalized playlists and therapeutic guidance',
      icon: '🎵',
      details: 'Curated music that adapts to your emotional journey in real-time'
    }
  ]

  return (
    <section className="py-20 animate-fade-in">
      <div className="text-center mb-16">
        <p className="text-sm uppercase tracking-[0.32em] text-mint-400 font-archivo mb-4">How It Works</p>
        <h2 className="text-4xl font-bold text-white font-bebas mb-6">Your Path to Emotional Wellness</h2>
        <p className="text-lg text-gray-300 font-archivo">
          Three simple steps to personalized music therapy that understands and adapts to your emotional needs
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
        {steps.map((step, index) => (
          <div key={step.number} className="relative">
            {/* Step Number and Connector */}
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl border-2 border-mint bg-forest-900/90 shadow-mint-glow">
                <span className="text-2xl font-bold text-mint-400 font-bebas">{step.number}</span>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block flex-1 h-0.5 bg-gradient-to-r from-mint-500/50 to-mint-400/30 ml-4" />
              )}
            </div>

            {/* Step Content */}
            <div className="group relative bg-forest-950/90 border-2 border-mint rounded-2xl p-6 shadow-mint-glow transition-all duration-300 hover:shadow-mint-glow-strong hover:scale-105 hover:border-mint-400">
              <div className="absolute inset-0 bg-gradient-to-br from-mint-500/5 via-transparent to-mint-400/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-2xl" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">{step.icon}</div>
                  <h3 className="text-xl font-bold text-white font-bebas">{step.title}</h3>
                </div>
                
                <p className="text-mint-400 font-semibold font-archivo mb-3">{step.description}</p>
                <p className="text-sm text-gray-300 font-archivo">{step.details}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
