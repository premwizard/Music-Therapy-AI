import Card from '../components/Card'
import Input from '../components/Input'
import Button from '../components/Button'
import PageHeader from '../components/PageHeader'

const genres = ['Ambient', 'Neo-soul', 'World', 'Lofi', 'Nature', 'Piano']

export default function SettingsPage() {
  const toggles = [
    { name: 'Notifications', description: 'Receive reminders for upcoming sessions.', enabled: true },
    { name: 'Dark mode', description: 'Keep the experience easy on your eyes at all hours.', enabled: true },
    { name: 'Biometric sync', description: 'Let your device adapt music to your physiology.', enabled: false },
  ]

  return (
    <div className="w-full min-h-screen bg-cream text-forest-950 animate-fade-in">
      <main className="w-full flex justify-center py-8">
        <div className="w-full max-w-[1400px] px-6 md:px-12 lg:px-20">
          <div className="space-y-10">
            <PageHeader
              eyebrow="Settings"
              title="Tailor your music therapy experience to your rhythm."
              description="Choose your preferences, regional rhythms, and evolving emotional controls in a calm, intuitive workspace."
            />

            <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <Card className="space-y-6">
                <div className="space-y-3">
                  <p className="text-sm uppercase tracking-[0.28em] text-mint-400">Core controls</p>
                  <h2 className="text-2xl font-bold text-cream">Manage your session defaults</h2>
                </div>

                <div className="space-y-4 border-2 border-mint bg-forest-950 p-5">
                  {toggles.map((item) => (
                    <div key={item.name} className="flex items-center justify-between gap-4 border-2 border-mint bg-forest-950 p-4">
                      <div>
                        <p className="text-sm font-semibold text-cream">{item.name}</p>
                        <p className="mt-1 text-sm text-mint-100">{item.description}</p>
                      </div>
                      <div className={`h-10 w-16 border-2 border-mint ${item.enabled ? 'bg-mint-500/20' : 'bg-forest-950'} flex items-center`}>
                        <span className={`h-8 w-8 bg-cream ${item.enabled ? 'ml-7' : 'ml-0'} transition-all duration-200`} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 border-2 border-mint bg-forest-950 p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.28em] text-mint-400">Genre selection</p>
                      <p className="mt-2 text-sm text-mint-100">Fine-tune your playlist influences.</p>
                    </div>
                    <Button variant="secondary">Edit</Button>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {genres.map((genre) => (
                      <button
                        key={genre}
                        className="border-2 border-mint bg-forest-950 px-4 py-3 text-sm text-cream transition duration-200 hover:bg-forest-900"
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>

              <div className="space-y-6">
                <Card className="space-y-6">
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-mint-400">Regional preferences</p>
                    <h2 className="mt-3 text-2xl font-bold text-cream">Cultural sound profiles</h2>
                    <p className="mt-4 text-sm leading-6 text-mint-100">Select your preferred regional styles to bring geographic character into every playlist.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-cream">Region</label>
                      <Input placeholder="Nordic Ambient, East Coast Jazz, Brazilian Chill" />
                    </div>
                    <Button className="w-full">Save preferences</Button>
                  </div>
                </Card>

                <Card className="space-y-6">
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-mint-400">Emotional map</p>
                    <h2 className="mt-3 text-2xl font-bold text-cream">Your emotional profile at a glance</h2>
                    <p className="mt-4 text-sm leading-6 text-mint-100">A calm visual summary of your current affective preferences and therapy settings.</p>
                  </div>

                  <div className="border-2 border-mint bg-forest-950 p-6">
                    <div className="border-2 border-mint bg-forest-950 p-6">
                      <p className="text-lg font-semibold text-cream">Mindfulness Engine v2.4</p>
                      <p className="mt-3 text-sm text-mint-100">Enhanced emotional detection algorithms active.</p>
                    </div>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div className="border-2 border-mint bg-forest-950 p-4">
                        <p className="text-sm uppercase tracking-[0.28em] text-mint-400">Energy</p>
                        <p className="mt-3 text-3xl font-bold text-cream">Balanced</p>
                      </div>
                      <div className="border-2 border-mint bg-forest-950 p-4">
                        <p className="text-sm uppercase tracking-[0.28em] text-mint-400">Sensitivity</p>
                        <p className="mt-3 text-3xl font-bold text-cream">High</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
