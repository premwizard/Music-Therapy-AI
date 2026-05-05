import Button from './Button'
import { Link } from 'react-router-dom'

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 border-t-2 border-mint shadow-mint-glow-strong">
      <div className="w-full text-center px-6 lg:px-20">
        <div className="relative">
          <div className="absolute inset-0 bg-mint-500/10 blur-3xl rounded-full" />
          <div className="relative space-y-8">
            <p className="text-sm uppercase tracking-[0.32em] text-mint-400 font-archivo">
              Ready to Transform Your Wellness Journey?
            </p>
            
            <h2 className="text-4xl lg:text-6xl font-bold text-white font-bebas leading-tight">
              Start Your AI Therapy Journey Today
            </h2>
            
            <p className="text-lg text-gray-300 font-archivo">
              Join thousands of users who have discovered the power of personalized music therapy. 
              Your emotional wellness deserves the best AI-powered support.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/register" className="inline-flex">
                <Button variant="primary" size="lg" className="px-12 shadow-mint-glow-strong hover:shadow-mint-glow-strong transform hover:scale-105 transition-all duration-300">
                  Get Started
                </Button>
              </Link>
              
              <Link to="/dashboard" className="inline-flex">
                <Button variant="outline" size="lg" className="px-12">
                  View Demo
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center justify-center gap-8 text-sm text-gray-400 font-archivo">
              <div className="flex items-center gap-2">
                <span className="text-mint-400">✓</span>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-mint-400">✓</span>
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-mint-400">✓</span>
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
