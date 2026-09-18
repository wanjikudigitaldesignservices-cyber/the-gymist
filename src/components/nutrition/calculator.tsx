'use client'

import { useState } from 'react'
import { CheckCircle2, ChevronRight, RotateCcw } from 'lucide-react'

type Goal = 'cut' | 'maintain' | 'bulk'
type Gender = 'male' | 'female'
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'

export function NutritionCalculator() {
  const [step, setStep] = useState(1)
  const [gender, setGender] = useState<Gender>('male')
  const [age, setAge] = useState<number>(30)
  const [weightKg, setWeightKg] = useState<number>(75)
  const [heightCm, setHeightCm] = useState<number>(175)
  const [activity, setActivity] = useState<ActivityLevel>('moderate')
  const [goal, setGoal] = useState<Goal>('maintain')

  const [results, setResults] = useState<{ calories: number; protein: number; carbs: number; fat: number } | null>(null)

  const calculate = () => {
    // Mifflin-St Jeor Equation
    let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age)
    bmr += gender === 'male' ? 5 : -161

    const multipliers: Record<ActivityLevel, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    }

    const tdee = bmr * multipliers[activity]

    let targetCalories = tdee
    if (goal === 'cut') targetCalories *= 0.8 // 20% deficit
    if (goal === 'bulk') targetCalories *= 1.15 // 15% surplus

    // Basic macros (can be adjusted)
    // Protein: 2g per kg of bodyweight
    const protein = weightKg * 2
    // Fat: 1g per kg of bodyweight (min 20% of calories)
    let fat = weightKg * 1
    if ((fat * 9) < (targetCalories * 0.2)) {
      fat = (targetCalories * 0.2) / 9
    }
    // Carbs: The rest
    const remainingCalories = targetCalories - (protein * 4) - (fat * 9)
    const carbs = Math.max(0, remainingCalories / 4)

    setResults({
      calories: Math.round(targetCalories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat)
    })
    setStep(3)
  }

  const reset = () => {
    setResults(null)
    setStep(1)
  }

  return (
    <div className="mx-auto max-w-2xl bg-white rounded shadow-xl border border-[var(--iron)]/10 overflow-hidden">
      {/* Progress */}
      <div className="flex border-b border-[var(--iron)]/10">
        <div className={`flex-1 text-center py-4 text-xs font-bold uppercase tracking-widest ${step >= 1 ? 'bg-[var(--ink)] text-[var(--volt)]' : 'text-[var(--iron)]'}`}>
          1. Basics
        </div>
        <div className={`flex-1 text-center py-4 text-xs font-bold uppercase tracking-widest ${step >= 2 ? 'bg-[var(--ink)] text-[var(--volt)]' : 'text-[var(--iron)]'}`}>
          2. Lifestyle
        </div>
        <div className={`flex-1 text-center py-4 text-xs font-bold uppercase tracking-widest ${step >= 3 ? 'bg-[var(--ink)] text-[var(--volt)]' : 'text-[var(--iron)]'}`}>
          3. Results
        </div>
      </div>

      <div className="p-8 sm:p-12">
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="mb-4 block text-sm font-bold uppercase tracking-wider text-[var(--ink)]">Gender</label>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setGender('male')}
                  className={`rounded border py-4 font-bold transition-colors ${gender === 'male' ? 'border-[var(--ink)] bg-[var(--ink)] text-white' : 'border-[var(--iron)]/20 text-[var(--iron)] hover:border-[var(--ink)]'}`}
                >
                  Male
                </button>
                <button 
                  onClick={() => setGender('female')}
                  className={`rounded border py-4 font-bold transition-colors ${gender === 'female' ? 'border-[var(--ink)] bg-[var(--ink)] text-white' : 'border-[var(--iron)]/20 text-[var(--iron)] hover:border-[var(--ink)]'}`}
                >
                  Female
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="mb-2 block text-sm font-bold uppercase tracking-wider text-[var(--ink)]">Age</label>
                <input type="number" min="16" max="100" value={age} onChange={e => setAge(Number(e.target.value))} className="w-full rounded border border-[var(--iron)]/20 p-4 text-center text-xl font-bold text-[var(--ink)] focus:border-[var(--ink)] focus:outline-none" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold uppercase tracking-wider text-[var(--ink)]">Weight (kg)</label>
                <input type="number" min="40" max="200" value={weightKg} onChange={e => setWeightKg(Number(e.target.value))} className="w-full rounded border border-[var(--iron)]/20 p-4 text-center text-xl font-bold text-[var(--ink)] focus:border-[var(--ink)] focus:outline-none" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold uppercase tracking-wider text-[var(--ink)]">Height (cm)</label>
                <input type="number" min="120" max="220" value={heightCm} onChange={e => setHeightCm(Number(e.target.value))} className="w-full rounded border border-[var(--iron)]/20 p-4 text-center text-xl font-bold text-[var(--ink)] focus:border-[var(--ink)] focus:outline-none" />
              </div>
            </div>

            <button onClick={() => setStep(2)} className="flex w-full items-center justify-center gap-2 rounded bg-[var(--volt)] px-6 py-4 font-bold text-[var(--ink)] transition-colors hover:bg-[var(--ink)] hover:text-white">
              Next Step <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="mb-4 block text-sm font-bold uppercase tracking-wider text-[var(--ink)]">Activity Level</label>
              <div className="space-y-3">
                {[
                  { id: 'sedentary', label: 'Sedentary', desc: 'Desk job, little to no exercise' },
                  { id: 'light', label: 'Lightly Active', desc: '1-3 days/week of exercise' },
                  { id: 'moderate', label: 'Moderately Active', desc: '3-5 days/week of exercise' },
                  { id: 'active', label: 'Very Active', desc: '6-7 days/week of hard exercise' }
                ].map(act => (
                  <button 
                    key={act.id}
                    onClick={() => setActivity(act.id as ActivityLevel)}
                    className={`w-full flex items-center justify-between rounded border p-4 text-left transition-colors ${activity === act.id ? 'border-[var(--ink)] bg-[var(--ink)] text-white' : 'border-[var(--iron)]/20 text-[var(--ink)] hover:border-[var(--ink)]'}`}
                  >
                    <div>
                      <div className="font-bold">{act.label}</div>
                      <div className={`text-xs mt-1 ${activity === act.id ? 'text-white/70' : 'text-[var(--iron)]'}`}>{act.desc}</div>
                    </div>
                    {activity === act.id && <CheckCircle2 className="h-5 w-5 text-[var(--volt)]" />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-4 block text-sm font-bold uppercase tracking-wider text-[var(--ink)]">Your Goal</label>
              <div className="grid grid-cols-3 gap-4">
                <button 
                  onClick={() => setGoal('cut')}
                  className={`rounded border py-3 text-sm font-bold transition-colors ${goal === 'cut' ? 'border-[var(--ink)] bg-[var(--ink)] text-white' : 'border-[var(--iron)]/20 text-[var(--iron)] hover:border-[var(--ink)]'}`}
                >
                  Fat Loss
                </button>
                <button 
                  onClick={() => setGoal('maintain')}
                  className={`rounded border py-3 text-sm font-bold transition-colors ${goal === 'maintain' ? 'border-[var(--ink)] bg-[var(--ink)] text-white' : 'border-[var(--iron)]/20 text-[var(--iron)] hover:border-[var(--ink)]'}`}
                >
                  Maintain
                </button>
                <button 
                  onClick={() => setGoal('bulk')}
                  className={`rounded border py-3 text-sm font-bold transition-colors ${goal === 'bulk' ? 'border-[var(--ink)] bg-[var(--ink)] text-white' : 'border-[var(--iron)]/20 text-[var(--iron)] hover:border-[var(--ink)]'}`}
                >
                  Muscle Gain
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="rounded border border-[var(--iron)]/20 px-6 py-4 font-bold text-[var(--ink)] transition-colors hover:bg-[var(--iron)]/10">
                Back
              </button>
              <button onClick={calculate} className="flex-1 flex items-center justify-center gap-2 rounded bg-[var(--volt)] px-6 py-4 font-bold text-[var(--ink)] transition-colors hover:bg-[var(--ink)] hover:text-white">
                Calculate Macros
              </button>
            </div>
          </div>
        )}

        {step === 3 && results && (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="text-center rounded bg-[var(--ink)] text-white p-8">
              <div className="text-xs font-mono uppercase tracking-widest text-[var(--volt)] mb-2">Daily Target</div>
              <div className="font-archivo text-6xl tracking-tight mb-2">{results.calories.toLocaleString()}</div>
              <div className="text-[var(--iron)]">Calories / Day</div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="rounded border border-[var(--iron)]/20 p-4 text-center bg-[var(--bone)]">
                <div className="text-xs font-mono uppercase tracking-widest text-[var(--iron)] mb-1">Protein</div>
                <div className="font-archivo text-3xl text-[var(--ink)]">{results.protein}g</div>
                <div className="text-xs text-[var(--iron)] mt-1">{(results.protein * 4 * 100 / results.calories).toFixed(0)}%</div>
              </div>
              <div className="rounded border border-[var(--iron)]/20 p-4 text-center bg-[var(--bone)]">
                <div className="text-xs font-mono uppercase tracking-widest text-[var(--iron)] mb-1">Carbs</div>
                <div className="font-archivo text-3xl text-[var(--ink)]">{results.carbs}g</div>
                <div className="text-xs text-[var(--iron)] mt-1">{(results.carbs * 4 * 100 / results.calories).toFixed(0)}%</div>
              </div>
              <div className="rounded border border-[var(--iron)]/20 p-4 text-center bg-[var(--bone)]">
                <div className="text-xs font-mono uppercase tracking-widest text-[var(--iron)] mb-1">Fats</div>
                <div className="font-archivo text-3xl text-[var(--ink)]">{results.fat}g</div>
                <div className="text-xs text-[var(--iron)] mt-1">{(results.fat * 9 * 100 / results.calories).toFixed(0)}%</div>
              </div>
            </div>

            <div className="text-sm text-[var(--iron)] bg-[var(--bone)] p-4 rounded text-center">
              Remember: This is just a starting point. Track your weight for 2 weeks and adjust calories by 200-300 up or down based on how your body responds.
            </div>

            <button onClick={reset} className="flex w-full items-center justify-center gap-2 rounded border border-[var(--iron)]/20 px-6 py-4 font-bold text-[var(--ink)] transition-colors hover:bg-[var(--iron)]/10">
              <RotateCcw className="h-4 w-4" /> Recalculate
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
