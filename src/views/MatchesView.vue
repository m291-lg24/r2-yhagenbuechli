<script setup>
import { computed, ref } from 'vue'

import MatchCard from '../components/MatchCard.vue'
import { useMatchStore } from '../stores/matchStore'

const matchStore = useMatchStore()

const selectedClub = ref('')
const selectedMonth = ref('')
const search = ref('')

const clubs = computed(() => {
  const names = matchStore.matches.flatMap((match) => [
    match.homeTeam,
    match.awayTeam,
  ])

  return [...new Set(names)].sort()
})

const months = computed(() => {
  const formatter = new Intl.DateTimeFormat('de-CH', {
    month: 'long',
    year: 'numeric',
  })

  const uniqueMonths = new Map()

  matchStore.matches.forEach((match) => {
    const key = match.date.slice(0, 7)

    if (!uniqueMonths.has(key)) {
      uniqueMonths.set(
        key,
        formatter.format(new Date(`${match.date}T12:00:00`)),
      )
    }
  })

  return [...uniqueMonths.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([value, label]) => ({
      value,
      label,
    }))
})

const filteredMatches = computed(() => {
  const query = search.value.trim().toLowerCase()

  return matchStore.sortedMatches.filter((match) => {
    const matchesClub =
      !selectedClub.value ||
      match.homeTeam === selectedClub.value ||
      match.awayTeam === selectedClub.value

    const matchesMonth =
      !selectedMonth.value ||
      match.date.startsWith(selectedMonth.value)

    const matchesSearch =
      !query ||
      match.homeTeam.toLowerCase().includes(query) ||
      match.awayTeam.toLowerCase().includes(query) ||
      match.stadium.toLowerCase().includes(query)

    return matchesClub && matchesMonth && matchesSearch
  })
})

const hasFilters = computed(() => {
  return (
    selectedClub.value ||
    selectedMonth.value ||
    search.value
  )
})

function resetFilters() {
  selectedClub.value = ''
  selectedMonth.value = ''
  search.value = ''
}
</script>

<template>
  <section class="matches-view">
    <header class="matches-header">
      <div>
        <p class="eyebrow">
          Match library
        </p>

        <h1>Alle Matches</h1>

        <p>
          Finde schnell den Match, für den du Content planen möchtest.
        </p>
      </div>

      <div class="match-counter">
        <span>
          {{ filteredMatches.length.toString().padStart(2, '0') }}
        </span>

        <small>
          von {{ matchStore.matches.length }}
        </small>
      </div>
    </header>

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
      v-if="filteredMatches.length"
      class="match-grid"
    >
      <MatchCard
        v-for="(match, index) in filteredMatches"
        :key="match.id"
        :match="match"
        :index="index + 1"
      />
    </div>

    <div
      v-else
      class="empty-state"
    >
      <p class="eyebrow">
        Keine Treffer
      </p>

      <h2>Keine Matches gefunden.</h2>

      <p>
        Ändere deine Filter oder setze sie zurück.
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