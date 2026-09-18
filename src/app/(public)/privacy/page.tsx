

export default function PrivacyPage() {
  return (
    <div className="py-24 bg-zinc-950 min-h-screen text-zinc-300">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
        
        <div className="space-y-8 text-lg">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
            <p>We collect information that you provide directly to us, including when you create an account, sign up for a membership, or contact us for support. This may include your name, email address, phone number, and payment information.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our services, process transactions, and send you related information, including confirmations and receipts.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Data Security</h2>
            <p>We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
