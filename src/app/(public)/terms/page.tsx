

export default function TermsPage() {
  return (
    <div className="py-24 bg-zinc-950 min-h-screen text-zinc-300">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-8">Terms and Conditions</h1>
        
        <div className="space-y-8 text-lg">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p>By accessing and using The Gymist facilities and website, you accept and agree to be bound by the terms and provision of this agreement.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Membership Rules</h2>
            <p>All members must adhere to the gym rules, including wiping down equipment after use, re-racking weights, and wearing appropriate athletic attire.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Cancellation Policy</h2>
            <p>Memberships can be cancelled with a 30-day written notice. No refunds will be provided for partial months.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
