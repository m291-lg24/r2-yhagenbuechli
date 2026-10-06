<script setup>
import { computed } from 'vue'

import MatchCard from '../components/MatchCard.vue'
import { useMatchStore } from '../stores/matchStore'

const matchStore = useMatchStore()

const matches = computed(() => matchStore.sortedMatches)
</script>

<template>
  <section class="page">
    <header class="page-header">
      <div>
        <p class="page-eyebrow">Matches</p>
        <h1>Matchübersicht</h1>

        <p class="page-description">
          Verwalte deine kommenden Spiele und die dazugehörige Content-Planung.
        </p>
      </div>

      <div class="page-count">
        <span>{{ matches.length }}</span>
        <small>Matches</small>
      </div>
    </header>

    <div class="content-section">
      <div class="section-header">
        <div>
          <h2>Kommende Spiele</h2>
          <p>Alle aktuell geplanten Matchdays.</p>
        </div>
      </div>

      <div
        v-if="matches.length"
        class="match-grid"
      >
        <MatchCard
          v-for="match in matches"
          :key="match.id"
          :match="match"
        />
      </div>

      <div
        v-else
        class="empty-state"
      >
        <h2>Noch keine Matches</h2>

        <p>
          Erstelle dein erstes Match, um mit der Content-Planung zu starten.
        </p>
      </div>
    </div>
  </section>
</template>