import { defineStore } from 'pinia'

const STORAGE_KEY = 'matchday-planner-matches-v2'

const stadiums = {
  'BSC Young Boys': 'Stadion Wankdorf',
  'FC Basel 1893': 'St. Jakob-Park',
  'FC Lausanne-Sport': 'Stade de la Tuilière',
  'FC Lugano': 'AIL Arena',
  'FC Luzern': 'swissporarena',
  'FC Sion': 'Stade de Tourbillon',
  'FC St.Gallen 1879': 'kybunpark',
  'FC Thun': 'Stockhorn Arena',
  'FC Vaduz': 'Rheinpark Stadion',
  'FC Zürich': 'Letzigrund',
  'Grasshopper Club Zürich': 'Letzigrund',
  'Servette FC': 'Stade de Genève',
}

const fixtureData = [
  // Runde 10
  ['2026-10-10', '18:00', 'Servette FC', 'FC Sion'],
  ['2026-10-10', '18:00', 'FC Zürich', 'FC Thun'],
  ['2026-10-10', '18:00', 'FC Lugano', 'FC Luzern'],
  ['2026-10-11', '14:00', 'Grasshopper Club Zürich', 'BSC Young Boys'],
  ['2026-10-11', '16:30', 'FC St.Gallen 1879', 'FC Lausanne-Sport'],
  ['2026-10-11', '16:30', 'FC Vaduz', 'FC Basel 1893'],

  // Runde 11
  ['2026-10-24', '18:00', 'FC Zürich', 'FC Luzern'],
  ['2026-10-24', '18:00', 'Servette FC', 'FC Vaduz'],
  ['2026-10-24', '20:30', 'BSC Young Boys', 'FC St.Gallen 1879'],
  ['2026-10-25', '14:00', 'FC Thun', 'FC Lugano'],
  ['2026-10-25', '16:30', 'FC Sion', 'FC Lausanne-Sport'],
  ['2026-10-25', '16:30', 'FC Basel 1893', 'Grasshopper Club Zürich'],

  // Runde 12
  ['2026-10-31', '18:00', 'FC St.Gallen 1879', 'Servette FC'],
  ['2026-10-31', '18:00', 'Grasshopper Club Zürich', 'FC Vaduz'],
  ['2026-10-31', '20:30', 'FC Luzern', 'FC Sion'],
  ['2026-11-01', '14:00', 'BSC Young Boys', 'FC Zürich'],
  ['2026-11-01', '16:30', 'FC Lausanne-Sport', 'FC Thun'],
  ['2026-11-01', '16:30', 'FC Lugano', 'FC Basel 1893'],

  // Runde 13
  ['2026-11-07', '18:00', 'FC Luzern', 'BSC Young Boys'],
  ['2026-11-07', '18:00', 'FC Vaduz', 'FC Sion'],
  ['2026-11-07', '20:30', 'Grasshopper Club Zürich', 'FC Lausanne-Sport'],
  ['2026-11-08', '14:00', 'FC St.Gallen 1879', 'FC Lugano'],
  ['2026-11-08', '16:30', 'Servette FC', 'FC Zürich'],
  ['2026-11-08', '16:30', 'FC Thun', 'FC Basel 1893'],

  // Runde 14
  ['2026-11-21', '18:00', 'BSC Young Boys', 'FC Thun'],
  ['2026-11-21', '18:00', 'FC Lugano', 'Grasshopper Club Zürich'],
  ['2026-11-21', '20:30', 'FC Sion', 'Servette FC'],
  ['2026-11-22', '14:00', 'FC Zürich', 'FC St.Gallen 1879'],
  ['2026-11-22', '16:30', 'FC Basel 1893', 'FC Luzern'],
  ['2026-11-22', '16:30', 'FC Lausanne-Sport', 'FC Vaduz'],

  // Runde 15
  ['2026-11-28', '18:00', 'Grasshopper Club Zürich', 'FC Basel 1893'],
  ['2026-11-28', '18:00', 'FC Vaduz', 'FC Zürich'],
  ['2026-11-28', '20:30', 'Servette FC', 'FC Lausanne-Sport'],
  ['2026-11-29', '14:00', 'FC Luzern', 'FC Lugano'],
  ['2026-11-29', '16:30', 'FC Sion', 'BSC Young Boys'],
  ['2026-11-29', '16:30', 'FC Thun', 'FC St.Gallen 1879'],

  // Runde 16
  ['2026-12-05', '18:00', 'FC Thun', 'FC Luzern'],
  ['2026-12-05', '18:00', 'FC Vaduz', 'BSC Young Boys'],
  ['2026-12-05', '20:30', 'FC Zürich', 'FC Lugano'],
  ['2026-12-06', '14:00', 'FC Basel 1893', 'Servette FC'],
  ['2026-12-06', '16:30', 'FC Lausanne-Sport', 'FC Sion'],
  ['2026-12-06', '16:30', 'FC St.Gallen 1879', 'Grasshopper Club Zürich'],

  // Runde 17
  ['2026-12-12', '18:00', 'FC Zürich', 'Grasshopper Club Zürich'],
  ['2026-12-12', '18:00', 'FC St.Gallen 1879', 'FC Vaduz'],
  ['2026-12-12', '20:30', 'BSC Young Boys', 'FC Lausanne-Sport'],
  ['2026-12-13', '14:00', 'FC Luzern', 'Servette FC'],
  ['2026-12-13', '16:30', 'FC Sion', 'FC Basel 1893'],
  ['2026-12-13', '16:30', 'FC Lugano', 'FC Thun'],

  // Runde 18
  ['2026-12-19', '18:00', 'Grasshopper Club Zürich', 'FC Luzern'],
  ['2026-12-19', '18:00', 'FC Lausanne-Sport', 'FC St.Gallen 1879'],
  ['2026-12-19', '20:30', 'FC Basel 1893', 'FC Zürich'],
  ['2026-12-20', '14:00', 'FC Thun', 'FC Sion'],
  ['2026-12-20', '16:30', 'Servette FC', 'BSC Young Boys'],
  ['2026-12-20', '16:30', 'FC Vaduz', 'FC Lugano'],

  // Runde 19
  ['2027-01-16', '18:00', 'Servette FC', 'FC Thun'],
  ['2027-01-16', '18:00', 'FC Basel 1893', 'FC Vaduz'],
  ['2027-01-16', '20:30', 'BSC Young Boys', 'FC Lugano'],
  ['2027-01-17', '14:00', 'FC Zürich', 'FC Lausanne-Sport'],
  ['2027-01-17', '16:30', 'FC Sion', 'Grasshopper Club Zürich'],
  ['2027-01-17', '16:30', 'FC Luzern', 'FC St.Gallen 1879'],

  // Runde 20
  ['2027-01-23', '18:00', 'FC Thun', 'FC Zürich'],
  ['2027-01-23', '18:00', 'FC Vaduz', 'FC Luzern'],
  ['2027-01-23', '20:30', 'Grasshopper Club Zürich', 'Servette FC'],
  ['2027-01-24', '14:00', 'FC Lausanne-Sport', 'FC Basel 1893'],
  ['2027-01-24', '16:30', 'FC St.Gallen 1879', 'BSC Young Boys'],
  ['2027-01-24', '16:30', 'FC Lugano', 'FC Sion'],

  // Runde 21
  ['2027-01-30', '18:00', 'Grasshopper Club Zürich', 'FC Thun'],
  ['2027-01-30', '18:00', 'FC Lugano', 'FC Lausanne-Sport'],
  ['2027-01-30', '20:30', 'FC Basel 1893', 'BSC Young Boys'],
  ['2027-01-31', '14:00', 'FC Sion', 'FC St.Gallen 1879'],
  ['2027-01-31', '16:30', 'FC Luzern', 'FC Zürich'],
  ['2027-01-31', '16:30', 'FC Vaduz', 'Servette FC'],

  // Runde 22
  ['2027-02-06', '18:00', 'FC Lausanne-Sport', 'FC Luzern'],
  ['2027-02-06', '18:00', 'FC Thun', 'FC Vaduz'],
  ['2027-02-06', '20:30', 'FC St.Gallen 1879', 'FC Basel 1893'],
  ['2027-02-07', '14:00', 'FC Zürich', 'FC Sion'],
  ['2027-02-07', '16:30', 'BSC Young Boys', 'Grasshopper Club Zürich'],
  ['2027-02-07', '16:30', 'Servette FC', 'FC Lugano'],
]

const defaultMatches = fixtureData.map(
  ([date, kickoffTime, homeTeam, awayTeam], index) => ({
    id: `match-${index + 1}`,
    homeTeam,
    awayTeam,
    competition: 'Brack Super League',
    stadium: stadiums[homeTeam],
    date,
    kickoffTime,
  }),
)

export const useMatchStore = defineStore('matches', {
  state: () => ({
    matches: [],
  }),

  getters: {
    getMatchById: (state) => {
      return (id) =>
        state.matches.find((match) => match.id === id)
    },

    sortedMatches: (state) => {
      return [...state.matches].sort((a, b) => {
        const dateA = new Date(
          `${a.date}T${a.kickoffTime}`,
        )

        const dateB = new Date(
          `${b.date}T${b.kickoffTime}`,
        )

        return dateA - dateB
      })
    },

    nextMatch() {
      const now = new Date()

      return this.sortedMatches.find((match) => {
        const matchDate = new Date(
          `${match.date}T${match.kickoffTime}`,
        )

        return matchDate >= now
      })
    },
  },

  actions: {
    loadMatches() {
      const savedMatches =
        localStorage.getItem(STORAGE_KEY)

      if (!savedMatches) {
        this.matches = defaultMatches
        this.saveMatches()
        return
      }

      try {
        this.matches = JSON.parse(savedMatches)
      } catch (error) {
        console.error(
          'Matches konnten nicht geladen werden.',
          error,
        )

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