import { defineStore } from 'pinia'

const STORAGE_KEY = 'matchday-planner-matches'

const defaultMatches = [
  {
    id: 'match-1',
    homeTeam: 'FC Zürich',
    awayTeam: 'FC Basel',
    competition: 'Super League',
    stadium: 'Letzigrund',
    date: '2026-10-10',
    kickoffTime: '20:30',
  },
  {
    id: 'match-2',
    homeTeam: 'BSC Young Boys',
    awayTeam: 'FC Zürich',
    competition: 'Super League',
    stadium: 'Wankdorf',
    date: '2026-10-18',
    kickoffTime: '16:30',
  },
  {
    id: 'match-3',
    homeTeam: 'FC Zürich',
    awayTeam: 'FC St. Gallen',
    competition: 'Super League',
    stadium: 'Letzigrund',
    date: '2026-10-25',
    kickoffTime: '14:00',
  },
]

export const useMatchStore = defineStore('matches', {
  state: () => ({
    matches: [],
  }),

  getters: {
    getMatchById: (state) => {
      return (id) => state.matches.find((match) => match.id === id)
    },

    sortedMatches: (state) => {
      return [...state.matches].sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.kickoffTime}`)
        const dateB = new Date(`${b.date}T${b.kickoffTime}`)

        return dateA - dateB
      })
    },

    nextMatch() {
      const now = new Date()

      return this.sortedMatches.find((match) => {
        const matchDate = new Date(`${match.date}T${match.kickoffTime}`)

        return matchDate >= now
      })
    },
  },

  actions: {
    loadMatches() {
      const savedMatches = localStorage.getItem(STORAGE_KEY)

      if (!savedMatches) {
        this.matches = defaultMatches
        this.saveMatches()
        return
      }

      try {
        this.matches = JSON.parse(savedMatches)
      } catch (error) {
        console.error('Matches konnten nicht geladen werden.', error)
        this.matches = defaultMatches
        this.saveMatches()
      }
    },

    saveMatches() {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(this.matches),
      )
    },

    addMatch(match) {
      this.matches.push(match)
      this.saveMatches()
    },
  },
})