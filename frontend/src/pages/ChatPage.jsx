import Card from '../components/Card'
import PageHeader from '../components/PageHeader'
import ChatPanel from '../components/ChatPanel'

export default function ChatPage() {
  return (
    <div className="w-full min-h-screen bg-cream text-forest-950 animate-fade-in">
      <main className="w-full flex justify-center py-8">
        <div className="w-full max-w-[1400px] px-6 md:px-12 lg:px-20">
          <div className="space-y-10">
            <PageHeader
              eyebrow="AI therapist chat"
              title="Speak, pause, and reset with empathetic guidance."
              description="A calm conversational interface for checking in, exploring feelings, and receiving playlist suggestions tuned to your emotional tone."
            />

            <Card className="w-full space-y-6">
              <div className="grid gap-4">
                <div className="border-2 border-mint bg-forest-950 p-6">
                  <p className="text-sm uppercase tracking-[0.3em] text-mint-400">Conversation</p>
                  <p className="mt-3 text-base leading-7 text-mint-100">Your AI therapist listens and responds with care, offering playlist recommendations and mood insights.</p>
                </div>

                <div className="border-2 border-mint bg-forest-950 p-6">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm uppercase tracking-[0.28em] text-mint-400">Connected</span>
                    <span className="text-sm uppercase tracking-[0.28em] text-cream">Live</span>
                  </div>
                </div>
              </div>

              <ChatPanel />
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
