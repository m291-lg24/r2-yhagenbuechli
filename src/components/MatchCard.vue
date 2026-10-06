<script setup>
defineProps({
  match: {
    type: Object,
    required: true,
  },

  index: {
    type: Number,
    required: true,
  },
})

function formatDate(date) {
  return new Intl.DateTimeFormat('de-CH', {
    day: '2-digit',
    month: 'short',
  }).format(new Date(date))
}
</script>

<template>
  <RouterLink
    class="match-card"
    :to="`/matches/${match.id}`"
  >
    <div class="match-card-top">
      <span class="card-index">
        {{ String(index).padStart(2, '0') }}
      </span>

      <span class="competition">
        {{ match.competition }}
      </span>

      <span class="match-date">
        {{ formatDate(match.date) }}
      </span>
    </div>

    <div class="match-card-body">
      <div class="match-team">
        <span>Home</span>
        <strong>{{ match.homeTeam }}</strong>
      </div>

      <span class="versus">
        VS
      </span>

      <div class="match-team match-team-away">
        <span>Away</span>
        <strong>{{ match.awayTeam }}</strong>
      </div>
    </div>

    <div class="match-card-meta">
      <div>
        <span>Kickoff</span>
        <strong>{{ match.kickoffTime }}</strong>
      </div>

      <div>
        <span>Venue</span>
        <strong>{{ match.stadium }}</strong>
      </div>

      <span class="card-arrow">
        ↗
      </span>
    </div>
  </RouterLink>
</template>