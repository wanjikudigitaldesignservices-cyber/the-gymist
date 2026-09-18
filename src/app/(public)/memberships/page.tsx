import { Container } from "@/components/ui/container"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MembershipsPage() {
  return (
    <div className="py-24 bg-zinc-950 min-h-screen">
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">Join The Gymist</h1>
          <p className="text-lg text-zinc-400">Choose the perfect plan for your fitness journey.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Basic Plan */}
          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-8 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-2">Basic</h3>
            <p className="text-zinc-400 mb-6">Perfect for starting out.</p>
            <div className="text-4xl font-bold text-white mb-6">KSh 3,500<span className="text-lg font-normal text-zinc-500">/mo</span></div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-zinc-300"><Check className="h-5 w-5 text-gym-red" /> Full gym access</li>
              <li className="flex items-center gap-3 text-zinc-300"><Check className="h-5 w-5 text-gym-red" /> Locker room access</li>
              <li className="flex items-center gap-3 text-zinc-500"><Check className="h-5 w-5 text-zinc-700" /> Group classes</li>
              <li className="flex items-center gap-3 text-zinc-500"><Check className="h-5 w-5 text-zinc-700" /> Personal training</li>
            </ul>
            <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white">Select Basic</Button>
          </div>

          {/* Pro Plan */}
          <div className="rounded-2xl bg-zinc-900 border-2 border-gym-red p-8 flex flex-col relative transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gym-red text-white px-4 py-1 rounded-full text-sm font-bold">MOST POPULAR</div>
            <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
            <p className="text-zinc-400 mb-6">For the dedicated athlete.</p>
            <div className="text-4xl font-bold text-white mb-6">KSh 5,500<span className="text-lg font-normal text-zinc-500">/mo</span></div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-zinc-300"><Check className="h-5 w-5 text-gym-red" /> Full gym access</li>
              <li className="flex items-center gap-3 text-zinc-300"><Check className="h-5 w-5 text-gym-red" /> Locker room access</li>
              <li className="flex items-center gap-3 text-zinc-300"><Check className="h-5 w-5 text-gym-red" /> Group classes</li>
              <li className="flex items-center gap-3 text-zinc-500"><Check className="h-5 w-5 text-zinc-700" /> Personal training</li>
            </ul>
            <Button className="w-full bg-gym-red hover:bg-red-700 text-white">Select Pro</Button>
          </div>

          {/* Elite Plan */}
          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-8 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-2">Elite</h3>
            <p className="text-zinc-400 mb-6">The ultimate fitness experience.</p>
            <div className="text-4xl font-bold text-white mb-6">KSh 12,000<span className="text-lg font-normal text-zinc-500">/mo</span></div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-zinc-300"><Check className="h-5 w-5 text-gym-red" /> Full gym access</li>
              <li className="flex items-center gap-3 text-zinc-300"><Check className="h-5 w-5 text-gym-red" /> Locker room & sauna</li>
              <li className="flex items-center gap-3 text-zinc-300"><Check className="h-5 w-5 text-gym-red" /> Unlimited classes</li>
              <li className="flex items-center gap-3 text-zinc-300"><Check className="h-5 w-5 text-gym-red" /> 4 PT sessions/month</li>
            </ul>
            <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white">Select Elite</Button>
          </div>
        </div>
      </Container>
    </div>
  )
}
