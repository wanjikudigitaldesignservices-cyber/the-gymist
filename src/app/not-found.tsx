import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col font-sans text-[var(--ink)] bg-[var(--bone)]">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center py-32 px-6 text-center">
        <div className="font-archivo text-9xl tracking-tighter text-[var(--volt)] mb-8 drop-shadow-sm">
          404
        </div>
        <h1 className="font-archivo text-4xl uppercase tracking-tight text-[var(--ink)] mb-4">
          Page Not Found
        </h1>
        <p className="text-[var(--iron)] text-lg max-w-md mx-auto mb-12">
          The page you are looking for doesn't exist, or it has been moved. Let's get you back to the gym floor.
        </p>
        <Link 
          href="/" 
          className="inline-flex items-center justify-center rounded bg-[var(--ink)] px-8 py-4 font-bold text-white transition-colors hover:bg-[var(--volt)] hover:text-[var(--ink)]"
        >
          Return Home
        </Link>
      </main>
      <Footer />
    </div>
  )
}
