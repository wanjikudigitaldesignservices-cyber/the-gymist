import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Workouts — Admin',
}

export default async function AdminWorkoutsPage() {
  const supabase = await createClient()

  const { data: workouts } = await supabase
    .from('workouts')
    .select('*')
    .order('name')

  return (
    <div>
      <div className="mb-8 flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="font-archivo text-3xl uppercase tracking-tight text-[var(--ink)]">
            Workouts
          </h1>
          <p className="text-[var(--iron)] mt-1">
            Manage the library of workouts displayed on the public site.
          </p>
        </div>
        <Link 
          href="/admin/workouts/new"
          className="rounded bg-[var(--ink)] px-6 py-3 font-bold text-white hover:bg-[var(--volt)] hover:text-[var(--ink)] transition-colors"
        >
          Add Workout
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-xs border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-bold">Image</th>
                <th className="px-6 py-4 font-bold">Name</th>
                <th className="px-6 py-4 font-bold">Category</th>
                <th className="px-6 py-4 font-bold">Difficulty</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {workouts?.map((workout) => (
                <tr key={workout.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="relative h-12 w-16 overflow-hidden rounded bg-gray-100">
                      <Image
                        src={workout.image_url}
                        alt={workout.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-[var(--ink)]">{workout.name}</td>
                  <td className="px-6 py-4 capitalize">{workout.category}</td>
                  <td className="px-6 py-4 capitalize">{workout.difficulty_level}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-bold uppercase tracking-wider ${
                      workout.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {workout.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={`/admin/workouts/${workout.id}`}
                      className="text-[var(--volt)] font-bold bg-[var(--ink)] px-3 py-1 rounded text-xs hover:bg-[var(--ink)]/80 inline-block"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
              
              {(!workouts || workouts.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No workouts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
