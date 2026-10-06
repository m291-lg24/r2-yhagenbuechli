<script setup>
import { computed } from 'vue'

import { useMatchStore } from '../stores/matchStore'

const matchStore = useMatchStore()

const nextMatch = computed(() => matchStore.nextMatch)

function formatDate(date) {
  if (!date) {
    return ''
  }

  return new Intl.DateTimeFormat('de-CH', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  }).format(new Date(date))
}
</script>

<template>
  <section class="dashboard-view">
    <div class="dashboard-hero">
      <div class="hero-copy">
        <p class="eyebrow">
          Matchday workspace
        </p>

        <h1>
          Content planen.
          <span>Matchday im Griff.</span>
        </h1>

        <p class="hero-text">
          Spiele, Content-Aufgaben und Veröffentlichungen an einem Ort organisiert.
        </p>

        <RouterLink
          class="primary-link"
          to="/matches"
        >
          Matches ansehen
          <span>↗</span>
        </RouterLink>
      </div>

      <div
        v-if="nextMatch"
        class="next-match-panel"
      >
        <div class="panel-topline">
          <span>Next match</span>
          <span>{{ nextMatch.competition }}</span>
        </div>

        <div class="next-match-date">
          {{ formatDate(nextMatch.date) }}
        </div>

        <div class="next-match-teams">
          <strong>{{ nextMatch.homeTeam }}</strong>

          <span>vs</span>

          <strong>{{ nextMatch.awayTeam }}</strong>
        </div>

        <div class="next-match-meta">
          <div>
            <span>Kickoff</span>
            <strong>{{ nextMatch.kickoffTime }}</strong>
          </div>

          <div>
            <span>Stadion</span>
            <strong>{{ nextMatch.stadium }}</strong>
          </div>
        </div>

        <RouterLink
          class="panel-link"
          :to="`/matches/${nextMatch.id}`"
        >
          Match öffnen
          <span>→</span>
        </RouterLink>
      </div>

      <div
        v-else
        class="next-match-panel empty-panel"
      >
        <span>Noch kein Match geplant.</span>
      </div>
    </div>

    <div class="dashboard-strip">
      <div>
        <span class="strip-number">
          {{ matchStore.matches.length }}
        </span>

        <span class="strip-label">
          Matches geplant
        </span>
      </div>

      <div>
        <span class="strip-number">
          01
        </span>

        <span class="strip-label">
          Workspace
        </span>
      </div>

      <div>
        <span class="strip-number">
          24/7
        </span>

        <span class="strip-label">
          Lokal gespeichert
        </span>
      </div>
    </div>
  </section>
</template>