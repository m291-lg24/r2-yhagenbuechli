<script setup>
import {
  computed,
  reactive,
  ref,
  watch,
} from 'vue'

import MatchCard from '../components/MatchCard.vue'
import { useMatchStore } from '../stores/matchStore'

const matchStore = useMatchStore()

const selectedClub = ref('')
const selectedMonth = ref('')
const search = ref('')

const visibleCount = ref(8)
const LOAD_AMOUNT = 8

const showMatchForm = ref(false)
const formError = ref('')

const newMatch = reactive({
  homeTeam: '',
  awayTeam: '',
  competition: 'Brack Super League',
  stadium: '',
  date: '',
  kickoffTime: '',
})

const clubs = computed(() => {
  const names = matchStore.matches.flatMap(
    (match) => [
      match.homeTeam,
      match.awayTeam,
    ],
  )

  return [...new Set(names)].sort()
})

const competitions = computed(() => {
  const values = matchStore.matches
    .map((match) => match.competition)
    .filter(Boolean)

  return [...new Set(values)].sort()
})

const stadiums = computed(() => {
  const values = matchStore.matches
    .map((match) => match.stadium)
    .filter(Boolean)

  return [...new Set(values)].sort()
})

const homeTeamOptions = computed(() => {
  return clubs.value.filter(
    (club) => club !== newMatch.awayTeam,
  )
})

const awayTeamOptions = computed(() => {
  return clubs.value.filter(
    (club) => club !== newMatch.homeTeam,
  )
})

const months = computed(() => {
  const formatter =
    new Intl.DateTimeFormat('de-CH', {
      month: 'long',
      year: 'numeric',
    })

  const uniqueMonths = new Map()

  matchStore.matches.forEach((match) => {
    const key = match.date.slice(0, 7)

    if (!uniqueMonths.has(key)) {
      uniqueMonths.set(
        key,
        formatter.format(
          new Date(
            `${match.date}T12:00:00`,
          ),
        ),
      )
    }
  })

  return [...uniqueMonths.entries()]
    .sort(([a], [b]) =>
      a.localeCompare(b),
    )
    .map(([value, label]) => ({
      value,
      label,
    }))
})

const filteredMatches = computed(() => {
  const query =
    search.value
      .trim()
      .toLowerCase()

  return matchStore.sortedMatches.filter(
    (match) => {
      const matchesClub =
        !selectedClub.value ||
        match.homeTeam ===
          selectedClub.value ||
        match.awayTeam ===
          selectedClub.value

      const matchesMonth =
        !selectedMonth.value ||
        match.date.startsWith(
          selectedMonth.value,
        )

      const matchesSearch =
        !query ||
        match.homeTeam
          .toLowerCase()
          .includes(query) ||
        match.awayTeam
          .toLowerCase()
          .includes(query) ||
        match.stadium
          .toLowerCase()
          .includes(query)

      return (
        matchesClub &&
        matchesMonth &&
        matchesSearch
      )
    },
  )
})

const visibleMatches = computed(() => {
  return filteredMatches.value.slice(
    0,
    visibleCount.value,
  )
})

const hasMoreMatches = computed(() => {
  return (
    visibleCount.value <
    filteredMatches.value.length
  )
})

const hasFilters = computed(() => {
  return (
    selectedClub.value ||
    selectedMonth.value ||
    search.value
  )
})

watch(
  [
    selectedClub,
    selectedMonth,
    search,
  ],
  () => {
    visibleCount.value = LOAD_AMOUNT
  },
)

watch(
  () => newMatch.homeTeam,
  (homeTeam) => {
    if (!homeTeam) {
      newMatch.stadium = ''
      return
    }

    const existingHomeMatch =
      matchStore.matches.find(
        (match) =>
          match.homeTeam === homeTeam &&
          match.stadium,
      )

    if (existingHomeMatch) {
      newMatch.stadium =
        existingHomeMatch.stadium
    }
  },
)

function loadMore() {
  visibleCount.value += LOAD_AMOUNT
}

function resetFilters() {
  selectedClub.value = ''
  selectedMonth.value = ''
  search.value = ''

  visibleCount.value = LOAD_AMOUNT
}

function resetMatchForm() {
  newMatch.homeTeam = ''
  newMatch.awayTeam = ''
  newMatch.competition =
    'Brack Super League'
  newMatch.stadium = ''
  newMatch.date = ''
  newMatch.kickoffTime = ''

  formError.value = ''
}

function openMatchForm() {
  resetMatchForm()
  showMatchForm.value = true
}

function closeMatchForm() {
  showMatchForm.value = false
  resetMatchForm()
}

function validateMatch() {
  if (!newMatch.homeTeam) {
    formError.value =
      'Bitte wähle das Heimteam.'

    return false
  }

  if (!newMatch.awayTeam) {
    formError.value =
      'Bitte wähle das Auswärtsteam.'

    return false
  }

  if (
    newMatch.homeTeam ===
    newMatch.awayTeam
  ) {
    formError.value =
      'Heimteam und Auswärtsteam dürfen nicht gleich sein.'

    return false
  }

  if (!newMatch.competition) {
    formError.value =
      'Bitte wähle einen Wettbewerb.'

    return false
  }

  if (!newMatch.stadium) {
    formError.value =
      'Bitte wähle ein Stadion.'

    return false
  }

  if (!newMatch.date) {
    formError.value =
      'Bitte wähle ein Datum.'

    return false
  }

  if (!newMatch.kickoffTime) {
    formError.value =
      'Bitte wähle eine Anspielzeit.'

    return false
  }

  formError.value = ''

  return true
}

function createMatch() {
  if (!validateMatch()) {
    return
  }

  const id =
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID ===
      'function'
      ? `match-${crypto.randomUUID()}`
      : `match-${Date.now()}`

  matchStore.addMatch({
    id,
    homeTeam: newMatch.homeTeam,
    awayTeam: newMatch.awayTeam,
    competition:
      newMatch.competition,
    stadium: newMatch.stadium,
    date: newMatch.date,
    kickoffTime:
      newMatch.kickoffTime,
  })

  closeMatchForm()
}
</script>

<template>
  <section class="matches-view">
    <header class="matches-header">
      <div>
        <p class="eyebrow">
          Match library
        </p>

        <h1>
          Alle Matches
        </h1>

        <p>
          Finde schnell den Match, für
          den du Content planen möchtest.
        </p>
      </div>

      <div class="matches-header-actions">
        <div class="match-counter">
          <span>
            {{
              filteredMatches.length
                .toString()
                .padStart(2, '0')
            }}
          </span>

          <small>
            Treffer
          </small>
        </div>

        <button
          class="create-match-button"
          type="button"
          @click="openMatchForm"
        >
          + Match erstellen
        </button>
      </div>
    </header>

    <form
      v-if="showMatchForm"
      class="create-match-form"
      @submit.prevent="createMatch"
    >
      <div class="create-form-heading">
        <div>
          <p class="eyebrow">
            Neues Match
          </p>

          <h2>
            Match erstellen
          </h2>

          <p>
            Wähle Teams und Matchdaten
            aus.
          </p>
        </div>

        <button
          class="close-form-button"
          type="button"
          aria-label="Formular schliessen"
          @click="closeMatchForm"
        >
          ×
        </button>
      </div>

      <div class="create-form-grid">
        <div class="match-form-field">
          <label for="homeTeam">
            Heimteam
          </label>

          <select
            id="homeTeam"
            v-model="newMatch.homeTeam"
          >
            <option value="">
              Heimteam auswählen
            </option>

            <option
              v-for="club in homeTeamOptions"
              :key="club"
              :value="club"
            >
              {{ club }}
            </option>
          </select>
        </div>

        <div class="match-form-field">
          <label for="awayTeam">
            Auswärtsteam
          </label>

          <select
            id="awayTeam"
            v-model="newMatch.awayTeam"
          >
            <option value="">
              Auswärtsteam auswählen
            </option>

            <option
              v-for="club in awayTeamOptions"
              :key="club"
              :value="club"
            >
              {{ club }}
            </option>
          </select>
        </div>

        <div class="match-form-field">
          <label for="competition">
            Wettbewerb
          </label>

          <select
            id="competition"
            v-model="newMatch.competition"
          >
            <option value="">
              Wettbewerb auswählen
            </option>

            <option
              v-for="competition in competitions"
              :key="competition"
              :value="competition"
            >
              {{ competition }}
            </option>
          </select>
        </div>

        <div class="match-form-field">
          <label for="stadium">
            Stadion
          </label>

          <select
            id="stadium"
            v-model="newMatch.stadium"
          >
            <option value="">
              Stadion auswählen
            </option>

            <option
              v-for="stadium in stadiums"
              :key="stadium"
              :value="stadium"
            >
              {{ stadium }}
            </option>
          </select>
        </div>

        <div class="match-form-field">
          <label for="matchDate">
            Datum
          </label>

          <input
            id="matchDate"
            v-model="newMatch.date"
            type="date"
          >
        </div>

        <div class="match-form-field">
          <label for="kickoffTime">
            Anspielzeit
          </label>

          <input
            id="kickoffTime"
            v-model="newMatch.kickoffTime"
            type="time"
          >
        </div>
      </div>

      <p
        v-if="formError"
        class="match-form-error"
      >
        {{ formError }}
      </p>

      <div class="create-form-actions">
        <button
          class="match-form-cancel"
          type="button"
          @click="closeMatchForm"
        >
          Abbrechen
        </button>

        <button
          class="match-form-save"
          type="submit"
        >
          Match speichern
        </button>
      </div>
    </form>

    <div class="filter-panel">
      <div class="search-field">
        <label for="match-search">
          Suche
        </label>

        <input
          id="match-search"
          v-model="search"
          type="search"
          placeholder="Team oder Stadion"
        >
      </div>

      <div class="filter-field">
        <label for="club-filter">
          Club
        </label>

        <select
          id="club-filter"
          v-model="selectedClub"
        >
          <option value="">
            Alle Clubs
          </option>

          <option
            v-for="club in clubs"
            :key="club"
            :value="club"
          >
            {{ club }}
          </option>
        </select>
      </div>

      <div class="filter-field">
        <label for="month-filter">
          Monat
        </label>

        <select
          id="month-filter"
          v-model="selectedMonth"
        >
          <option value="">
            Alle Monate
          </option>

          <option
            v-for="month in months"
            :key="month.value"
            :value="month.value"
          >
            {{ month.label }}
          </option>
        </select>
      </div>

      <button
        v-if="hasFilters"
        class="reset-button"
        type="button"
        @click="resetFilters"
      >
        Zurücksetzen
      </button>
    </div>

    <div
      v-if="visibleMatches.length"
      class="match-grid"
    >
      <MatchCard
        v-for="(match, index) in visibleMatches"
        :key="match.id"
        :match="match"
        :index="index + 1"
      />
    </div>

    <div
      v-if="hasMoreMatches"
      class="load-more-wrap"
    >
      <button
        class="load-more-button"
        type="button"
        @click="loadMore"
      >
        Mehr laden

        <span>
          {{ visibleMatches.length }}
          /
          {{ filteredMatches.length }}
        </span>
      </button>
    </div>

    <div
      v-if="!filteredMatches.length"
      class="empty-state"
    >
      <p class="eyebrow">
        Keine Treffer
      </p>

      <h2>
        Keine Matches gefunden.
      </h2>

      <p>
        Ändere deine Filter oder setze
        sie zurück.
      </p>

      <button
        class="empty-reset"
        type="button"
        @click="resetFilters"
      >
        Filter zurücksetzen
      </button>
    </div>
  </section>
</template>

<style scoped>
.matches-header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.create-match-button {
  height: 51px;
  padding: 0 17px;

  border: 0;
  border-radius: 16px;

  cursor: pointer;

  background: #10283f;
  color: #ffffff;

  font-size: 11px;
  font-weight: 700;
}

.create-match-form {
  margin-bottom: 22px;
  padding: 22px;

  border: 1px solid
    rgba(255, 255, 255, 0.85);

  border-radius: 22px;

  background:
    rgba(255, 255, 255, 0.76);

  box-shadow:
    0 18px 45px
    rgba(33, 67, 94, 0.06);

  backdrop-filter: blur(18px);
}

.create-form-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: 20px;

  margin-bottom: 22px;
}

.create-form-heading h2 {
  margin: 0;

  color: #10283f;

  font-size: 25px;
  letter-spacing: -0.04em;
}

.create-form-heading
> div
> p:last-child {
  margin: 8px 0 0;

  color: #7d8b97;

  font-size: 11px;
}

.close-form-button {
  display: grid;
  place-items: center;

  width: 36px;
  height: 36px;

  border: 0;
  border-radius: 50%;

  cursor: pointer;

  background: #edf2f5;
  color: #637381;

  font-size: 19px;
}

.create-form-grid {
  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 14px;
}

.match-form-field {
  display: flex;
  flex-direction: column;

  gap: 6px;
}

.match-form-field label {
  color: #7f8d98;

  font-size: 9px;
  font-weight: 800;

  letter-spacing: 0.06em;

  text-transform: uppercase;
}

.match-form-field input,
.match-form-field select {
  width: 100%;
  height: 43px;

  padding: 0 12px;

  border: 1px solid #dce5eb;
  border-radius: 11px;

  outline: none;

  background: #ffffff;
  color: #24394c;

  font-size: 12px;
}

.match-form-field select {
  cursor: pointer;
}

.match-form-field input:focus,
.match-form-field select:focus {
  border-color: #1783c1;

  box-shadow:
    0 0 0 3px
    rgba(23, 131, 193, 0.08);
}

.match-form-error {
  margin: 14px 0 0;

  color: #b54e4e;

  font-size: 10px;
}

.create-form-actions {
  display: flex;
  justify-content: flex-end;

  gap: 8px;

  margin-top: 20px;
}

.match-form-cancel,
.match-form-save {
  padding: 10px 14px;

  border: 0;
  border-radius: 10px;

  cursor: pointer;

  font-size: 10px;
  font-weight: 700;
}

.match-form-cancel {
  background: #edf1f4;
  color: #647582;
}

.match-form-save {
  background: #10283f;
  color: #ffffff;
}

@media (max-width: 700px) {
  .matches-header-actions {
    width: 100%;

    align-items: stretch;
    flex-direction: column;
  }

  .create-match-button {
    width: 100%;
  }

  .create-form-grid {
    grid-template-columns: 1fr;
  }
}
</style>