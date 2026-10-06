<script setup>
defineProps({
  match: {
    type: Object,
    required: true,
  },
})

function formatDate(date) {
  return new Intl.DateTimeFormat('de-CH', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}
</script>

<template>
  <RouterLink
    class="match-card"
    :to="`/matches/${match.id}`"
  >
    <div class="match-card-header">
      <span class="competition-badge">
        {{ match.competition }}
      </span>

      <span class="match-date">
        {{ formatDate(match.date) }}
      </span>
    </div>

    <div class="match-teams">
      <div class="team-row">
        <span class="team-type">HOME</span>
        <strong>{{ match.homeTeam }}</strong>
      </div>

      <div class="team-row">
        <span class="team-type">AWAY</span>
        <strong>{{ match.awayTeam }}</strong>
      </div>
    </div>

    <div class="match-info">
      <div>
        <span>Kickoff</span>
        <strong>{{ match.kickoffTime }}</strong>
      </div>

      <div>
        <span>Stadion</span>
        <strong>{{ match.stadium }}</strong>
      </div>
    </div>

    <div class="match-card-footer">
      <span>Match öffnen</span>
      <span class="arrow">→</span>
    </div>
  </RouterLink>
</template>