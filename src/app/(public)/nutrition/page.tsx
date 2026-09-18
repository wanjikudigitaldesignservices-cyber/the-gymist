import { RepCounter } from '@/components/ui/rep-counter'
import { CTABand } from '@/components/ui/cta-band'
import { NutritionCalculator } from '@/components/nutrition/calculator'

export const metadata = {
  title: 'Nutrition Calculator — The Gymist | Gym in Kilimani, Nairobi',
  description: 'Calculate your calories and macros. Plus, a guide to Kenyan staples.',
}

const KENYAN_FOODS = [
  { name: 'Ugali (Cooked)', portion: '100g', calories: 120, protein: 3, carbs: 26, fat: 0.5 },
  { name: 'Chapati (White)', portion: '1 piece (80g)', calories: 250, protein: 6, carbs: 36, fat: 9 },
  { name: 'Sukuma Wiki (Fried)', portion: '100g', calories: 60, protein: 3, carbs: 6, fat: 3 },
  { name: 'Nyama Choma (Beef, lean)', portion: '100g', calories: 200, protein: 26, carbs: 0, fat: 10 },
  { name: 'Nyama Choma (Goat, fatty)', portion: '100g', calories: 250, protein: 24, carbs: 0, fat: 16 },
  { name: 'Githeri (Boiled)', portion: '100g', calories: 150, protein: 6, carbs: 28, fat: 1 },
  { name: 'Ndagu (Arrowroot, boiled)', portion: '100g', calories: 110, protein: 1.5, carbs: 26, fat: 0.1 },
  { name: 'Ngwaci (Sweet Potato, boiled)', portion: '100g', calories: 86, protein: 1.6, carbs: 20, fat: 0.1 },
  { name: 'Mutura', portion: '100g', calories: 280, protein: 14, carbs: 2, fat: 24 },
  { name: 'Avocado', portion: '100g (half)', calories: 160, protein: 2, carbs: 9, fat: 15 },
  { name: 'Eggs (Boiled)', portion: '2 large (100g)', calories: 155, protein: 13, carbs: 1, fat: 11 },
  { name: 'Chicken (Kienyeji, stewed)', portion: '100g', calories: 190, protein: 24, carbs: 0, fat: 10 },
  { name: 'Tilapia (Deep fried)', portion: '100g', calories: 260, protein: 20, carbs: 5, fat: 18 },
  { name: 'Beans (Yellow, boiled)', portion: '100g', calories: 140, protein: 9, carbs: 25, fat: 1 },
]

export default function NutritionPage() {
  return (
    <main className="flex-1 bg-[var(--bone)]">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:px-12 md:py-36">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-32">
          
          <div className="flex flex-col justify-center">
            <RepCounter index="10" label="NUTRITION" />
            <h1 className="mt-8 font-archivo text-5xl uppercase leading-none tracking-tight text-[var(--ink)] sm:text-6xl md:text-7xl">
              Fuel the <br className="hidden sm:block" /> machine.
            </h1>
            <p className="mt-8 text-lg text-[var(--iron)] mb-8">
              Training is only half the equation. Use our calculator to find your daily caloric and macronutrient targets based on your goals.
            </p>
            
            <div className="rounded bg-[var(--ink)] text-white p-8 shadow-sm">
              <h3 className="font-archivo text-2xl uppercase tracking-tight mb-4">
                The Hierarchy of Nutrition
              </h3>
              <ol className="list-decimal list-inside space-y-4 text-white/80">
                <li><strong className="text-white">Calories:</strong> Determines if you lose, maintain, or gain weight.</li>
                <li><strong className="text-white">Macros:</strong> Determines composition (fat vs muscle). Prioritize protein.</li>
                <li><strong className="text-white">Micros:</strong> Vitamins and minerals for health and function.</li>
                <li><strong className="text-white">Timing:</strong> When you eat (less important than the top 3).</li>
                <li><strong className="text-white">Supplements:</strong> The top 5% cherry on the cake.</li>
              </ol>
            </div>
          </div>

          <div>
            <NutritionCalculator />
          </div>

        </div>

        {/* Local Food Macros Table */}
        <div className="border-t border-[var(--iron)]/10 pt-24">
          <div className="mb-12 text-center max-w-3xl mx-auto">
            <h2 className="font-archivo text-4xl uppercase tracking-tight text-[var(--ink)] mb-4">
              Kenyan Staples Cheat Sheet
            </h2>
            <p className="text-[var(--iron)]">
              Tracking macros in Nairobi can be tricky since MyFitnessPal doesn't always know what's in a plate of Mutura. Here is a rough guide to common local foods.
            </p>
          </div>

          <div className="overflow-x-auto rounded border border-[var(--iron)]/10 bg-white shadow-sm">
            <table className="w-full text-left text-sm text-[var(--ink)]">
              <thead className="bg-[var(--ink)] text-white uppercase font-mono text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-bold">Food</th>
                  <th className="px-6 py-4 font-bold">Portion</th>
                  <th className="px-6 py-4 font-bold text-right text-[var(--volt)]">Cals</th>
                  <th className="px-6 py-4 font-bold text-right text-blue-400">Pro (g)</th>
                  <th className="px-6 py-4 font-bold text-right text-yellow-400">Carbs (g)</th>
                  <th className="px-6 py-4 font-bold text-right text-red-400">Fat (g)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--iron)]/10">
                {KENYAN_FOODS.map((food, i) => (
                  <tr key={i} className="hover:bg-[var(--bone)] transition-colors">
                    <td className="px-6 py-4 font-bold">{food.name}</td>
                    <td className="px-6 py-4 text-[var(--iron)]">{food.portion}</td>
                    <td className="px-6 py-4 text-right font-mono font-bold">{food.calories}</td>
                    <td className="px-6 py-4 text-right font-mono text-blue-600">{food.protein}</td>
                    <td className="px-6 py-4 text-right font-mono text-yellow-600">{food.carbs}</td>
                    <td className="px-6 py-4 text-right font-mono text-red-600">{food.fat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 text-center text-xs text-[var(--iron)]">
            * Note: These are averages. Calories can swing wildly depending on how much cooking oil is used. When in doubt, overestimate the oil.
          </div>
        </div>

      </div>

      <CTABand />
    </main>
  )
}
