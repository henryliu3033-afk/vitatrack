import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { today, RECORDS, GOALS as DEFAULT_GOALS } from '../lib/data'

export const useHealthStore = create(
  persist(
    (set, get) => ({
      records: RECORDS,
      goals:   DEFAULT_GOALS,
      profile: { name: 'Henry Liu', age: 28, height: 172, gender: 'male', avatar: '' },

      // Log today's entry (upsert)
      logToday: (entry) => {
        const t = today()
        const records = get().records
        const exists  = records.findIndex(r => r.date === t)
        if (exists >= 0) {
          const updated = [...records]
          updated[exists] = { ...updated[exists], ...entry }
          set({ records: updated })
        } else {
          set({ records: [...records, { date: t, ...entry }] })
        }
      },

      updateGoals:   (goals)   => set({ goals:   { ...get().goals,   ...goals   } }),
      updateProfile: (profile) => set({ profile: { ...get().profile, ...profile } }),

      getToday: () => {
        const t = today()
        return get().records.find(r => r.date === t) || get().records.at(-1)
      },

      getLast7: () => {
        const sorted = [...get().records].sort((a, b) => a.date.localeCompare(b.date))
        return sorted.slice(-7)
      },

      getLast30: () => {
        const sorted = [...get().records].sort((a, b) => a.date.localeCompare(b.date))
        return sorted.slice(-30)
      },
    }),
    { name: 'vitatrack-health', version: 2, migrate: () => undefined }
  )
)
