export default function TestimonialsTicker() {
  const testimonials = [
    {
      quote: "Music Therapy AI has completely transformed how I manage my anxiety. The personalized playlists really understand my mood.",
      name: "Sarah Chen",
      rating: 5
    },
    {
      quote: "The emotion detection is incredibly accurate. I feel like the AI truly gets what I'm going through.",
      name: "Michael Rodriguez",
      rating: 5
    },
    {
      quote: "Finally, a wellness app that adapts to me instead of the other way around. Absolutely revolutionary!",
      name: "Emma Thompson",
      rating: 5
    },
    {
      quote: "The guided therapy sessions combined with music have been a lifesaver for my stress management.",
      name: "David Kim",
      rating: 5
    },
    {
      quote: "I've tried many wellness apps, but this one actually learns and improves with every session.",
      name: "Lisa Anderson",
      rating: 5
    },
    {
      quote: "The real-time mood adaptation is incredible. It's like having a personal music therapist 24/7.",
      name: "James Wilson",
      rating: 5
    }
  ]

  // Duplicate testimonials for seamless scrolling
  const duplicatedTestimonials = [...testimonials, ...testimonials]

  return (
    <section className="py-16 overflow-hidden bg-forest-900/50">
      <div className="text-center mb-12">
        <p className="text-sm uppercase tracking-[0.32em] text-mint-400 font-archivo mb-4">What People Say</p>
        <h2 className="text-3xl font-bold text-white font-bebas">Real Stories, Real Results</h2>
      </div>

      <div className="relative">
        <div className="flex animate-scroll-ticker">
          {duplicatedTestimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-80 mx-4 bg-forest-950/90 border-2 border-mint rounded-2xl p-6 shadow-mint-glow hover:shadow-mint-glow-strong transition-all duration-300 ease-in-out hover:scale-[1.02] hover:border-mint-400"
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-mint-400 text-lg">★</span>
                ))}
              </div>
              
              <blockquote className="text-gray-300 font-archivo mb-4 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>
              
              <cite className="text-mint-400 font-semibold font-archivo not-italic">
                {testimonial.name}
              </cite>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
