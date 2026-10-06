<script setup>
import { computed } from 'vue'

import { useMatchStore } from '../stores/matchStore'
import { useTaskStore } from '../stores/taskStore'

const matchStore = useMatchStore()
const taskStore = useTaskStore()

const nextMatch = computed(() => matchStore.nextMatch)

const todayKey = computed(() => {
  const today = new Date()

  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
})

function getMatchForTask(task) {
  return matchStore.matches.find(
    (match) => String(match.id) === String(task.matchId),
  )
}

const tasksWithMatch = computed(() => {
  return taskStore.tasks
    .map((task) => {
      const match = getMatchForTask(task)

      if (!match) {
        return null
      }

      return {
        ...task,
        match,
        taskDateTime: createTaskDateTime(
          match.date,
          task.publishTime,
          match.kickoffTime,
        ),
      }
    })
    .filter(Boolean)
})

const todayTasks = computed(() => {
  return tasksWithMatch.value.filter(
    (task) =>
      task.match.date === todayKey.value &&
      task.status !== 'Done',
  )
})

const highPriorityTasks = computed(() => {
  return todayTasks.value.filter(
    (task) => task.priority === 'High',
  )
})

const reviewTasks = computed(() => {
  return taskStore.tasks.filter(
    (task) => task.status === 'Review',
  )
})

const upcomingTasks = computed(() => {
  const now = new Date()

  return tasksWithMatch.value
    .filter(
      (task) =>
        task.status !== 'Done' &&
        task.taskDateTime >= now,
    )
    .sort(
      (a, b) =>
        a.taskDateTime - b.taskDateTime,
    )
    .slice(0, 5)
})

const nextTask = computed(() => {
  return upcomingTasks.value[0] ?? null
})

const nextMatchTasks = computed(() => {
  if (!nextMatch.value) {
    return []
  }

  return taskStore.tasks.filter(
    (task) =>
      String(task.matchId) ===
      String(nextMatch.value.id),
  )
})

const nextMatchProgress = computed(() => {
  if (!nextMatchTasks.value.length) {
    return 0
  }

  const doneTasks = nextMatchTasks.value.filter(
    (task) => task.status === 'Done',
  ).length

  return Math.round(
    (doneTasks / nextMatchTasks.value.length) * 100,
  )
})

function createTaskDateTime(
  date,
  publishTime,
  fallbackTime,
) {
  const time =
    publishTime || fallbackTime || '23:59'

  return new Date(`${date}T${time}:00`)
}

function formatDate(date) {
  if (!date) {
    return ''
  }

  return new Intl.DateTimeFormat('de-CH', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  }).format(
    new Date(`${date}T12:00:00`),
  )
}

function formatShortDate(date) {
  if (!date) {
    return ''
  }

  return new Intl.DateTimeFormat('de-CH', {
    day: '2-digit',
    month: 'short',
  }).format(
    new Date(`${date}T12:00:00`),
  )
}
</script>

<template>
  <section class="dashboard-view">
    <div class="dashboard-intro">
      <div>
        <p class="eyebrow">
          Matchday workspace
        </p>

        <h1>
          Dein Content-Tag.
        </h1>

        <p>
          Aufgaben, Deadlines und der nächste Matchday
          auf einen Blick.
        </p>
      </div>

      <RouterLink
        class="dashboard-matches-link"
        to="/matches"
      >
        Alle Matches
        <span>↗</span>
      </RouterLink>
    </div>

    <div class="dashboard-stats">
      <article class="dashboard-stat">
        <span class="stat-label">
          Heute fällig
        </span>

        <strong>
          {{ todayTasks.length }}
        </strong>

        <small>
          offene Aufgaben
        </small>
      </article>

      <article class="dashboard-stat">
        <span class="stat-label">
          High Priority
        </span>

        <strong>
          {{ highPriorityTasks.length }}
        </strong>

        <small>
          heute
        </small>
      </article>

      <article class="dashboard-stat">
        <span class="stat-label">
          Review
        </span>

        <strong>
          {{ reviewTasks.length }}
        </strong>

        <small>
          warten auf Freigabe
        </small>
      </article>

      <article class="dashboard-stat">
        <span class="stat-label">
          Matches
        </span>

        <strong>
          {{ matchStore.matches.length }}
        </strong>

        <small>
          geplant
        </small>
      </article>
    </div>

    <div class="dashboard-main-grid">
      <article
        v-if="nextTask"
        class="next-task-card"
      >
        <div class="card-kicker">
          Next up
        </div>

        <div class="next-task-top">
          <div>
            <span>
              Nächste Aufgabe
            </span>

            <h2>
              {{ nextTask.title }}
            </h2>
          </div>

          <span
            class="task-priority-badge"
            :class="`priority-${nextTask.priority.toLowerCase()}`"
          >
            {{ nextTask.priority }}
          </span>
        </div>

        <div class="next-task-time">
          <strong>
            {{ nextTask.publishTime || 'Keine Uhrzeit' }}
          </strong>

          <span>
            {{ formatShortDate(nextTask.match.date) }}
          </span>
        </div>

        <div class="next-task-match">
          <span>
            {{ nextTask.match.homeTeam }}
          </span>

          <small>vs</small>

          <span>
            {{ nextTask.match.awayTeam }}
          </span>
        </div>

        <div class="next-task-meta">
          <div>
            <span>Plattform</span>
            <strong>{{ nextTask.platform }}</strong>
          </div>

          <div>
            <span>Verantwortlich</span>
            <strong>{{ nextTask.assignee }}</strong>
          </div>

          <div>
            <span>Status</span>
            <strong>{{ nextTask.status }}</strong>
          </div>
        </div>

        <RouterLink
          class="open-task-link"
          :to="`/matches/${nextTask.match.id}`"
        >
          Matchday öffnen
          <span>→</span>
        </RouterLink>
      </article>

      <article
        v-else
        class="next-task-card next-task-empty"
      >
        <div>
          <div class="card-kicker">
            Next up
          </div>

          <h2>
            Keine offenen Aufgaben
          </h2>

          <p>
            Sobald du einem Match Content-Aufgaben
            hinzufügst, erscheinen sie hier.
          </p>
        </div>

        <RouterLink
          class="open-task-link"
          to="/matches"
        >
          Match auswählen
          <span>→</span>
        </RouterLink>
      </article>

      <article
        v-if="nextMatch"
        class="dashboard-match-card"
      >
        <div class="match-card-heading">
          <span>
            Nächster Match
          </span>

          <span>
            {{ nextMatch.competition }}
          </span>
        </div>

        <p class="dashboard-match-date">
          {{ formatDate(nextMatch.date) }}
        </p>

        <div class="dashboard-match-teams">
          <strong>
            {{ nextMatch.homeTeam }}
          </strong>

          <span>vs</span>

          <strong>
            {{ nextMatch.awayTeam }}
          </strong>
        </div>

        <div class="dashboard-match-info">
          <div>
            <span>Kickoff</span>
            <strong>
              {{ nextMatch.kickoffTime }}
            </strong>
          </div>

          <div>
            <span>Stadion</span>
            <strong>
              {{ nextMatch.stadium }}
            </strong>
          </div>
        </div>

        <div class="match-progress">
          <div class="match-progress-heading">
            <span>
              Content Progress
            </span>

            <strong>
              {{ nextMatchProgress }} %
            </strong>
          </div>

          <div class="match-progress-track">
            <span
              :style="{
                width: `${nextMatchProgress}%`,
              }"
            ></span>
          </div>
        </div>

        <RouterLink
          class="dashboard-match-link"
          :to="`/matches/${nextMatch.id}`"
        >
          Match öffnen
          <span>→</span>
        </RouterLink>
      </article>
    </div>

    <section class="upcoming-section">
      <div class="upcoming-heading">
        <div>
          <p class="eyebrow">
            Content Queue
          </p>

          <h2>
            Nächste Aufgaben
          </h2>
        </div>

        <span>
          {{ upcomingTasks.length }}
          angezeigt
        </span>
      </div>

      <div
        v-if="upcomingTasks.length"
        class="upcoming-task-list"
      >
        <RouterLink
          v-for="task in upcomingTasks"
          :key="task.id"
          class="upcoming-task"
          :to="`/matches/${task.match.id}`"
        >
          <div class="upcoming-time">
            <strong>
              {{ task.publishTime || '--:--' }}
            </strong>

            <span>
              {{ formatShortDate(task.match.date) }}
            </span>
          </div>

          <div class="upcoming-content">
            <strong>
              {{ task.title }}
            </strong>

            <span>
              {{ task.match.homeTeam }}
              vs
              {{ task.match.awayTeam }}
            </span>
          </div>

          <div class="upcoming-platform">
            {{ task.platform }}
          </div>

          <div class="upcoming-assignee">
            {{ task.assignee }}
          </div>

          <span class="upcoming-arrow">
            →
          </span>
        </RouterLink>
      </div>

      <div
        v-else
        class="upcoming-empty"
      >
        Noch keine kommenden Aufgaben geplant.
      </div>
    </section>
  </section>
</template>

<style scoped>
.dashboard-view {
  display: grid;
  gap: 22px;

  padding-bottom: 50px;
}

.dashboard-intro {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 30px;

  padding: 28px 0 12px;
}

.dashboard-intro h1 {
  margin: 0;

  color: #10283f;

  font-size: clamp(42px, 5vw, 66px);
  font-weight: 720;
  letter-spacing: -0.055em;
}

.dashboard-intro > div > p:last-child {
  margin: 14px 0 0;

  color: #71818f;

  font-size: 14px;
}

.dashboard-matches-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;

  padding: 11px 15px;

  border-radius: 12px;

  background: #10283f;
  color: #ffffff;

  font-size: 11px;
  font-weight: 700;
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.dashboard-stat {
  display: flex;
  flex-direction: column;

  padding: 18px;

  border: 1px solid rgba(255, 255, 255, 0.82);
  border-radius: 18px;

  background: rgba(255, 255, 255, 0.68);

  backdrop-filter: blur(16px);
}

.stat-label {
  color: #84929e;

  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.08em;

  text-transform: uppercase;
}

.dashboard-stat strong {
  margin-top: 13px;

  color: #10283f;

  font-size: 30px;
  font-weight: 720;
}

.dashboard-stat small {
  margin-top: 4px;

  color: #98a4ae;

  font-size: 9px;
}

.dashboard-main-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 16px;
}

.next-task-card,
.dashboard-match-card {
  min-height: 360px;
  padding: 24px;

  border-radius: 24px;
}

.next-task-card {
  display: flex;
  flex-direction: column;

  border: 1px solid rgba(255, 255, 255, 0.82);

  background: rgba(255, 255, 255, 0.75);

  box-shadow:
    0 20px 55px rgba(29, 61, 87, 0.06);
}

.card-kicker {
  color: #1783c1;

  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.14em;

  text-transform: uppercase;
}

.next-task-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;

  margin-top: 28px;
}

.next-task-top > div > span {
  color: #8d9aa5;

  font-size: 9px;

  text-transform: uppercase;
}

.next-task-top h2,
.next-task-empty h2 {
  margin: 7px 0 0;

  color: #10283f;

  font-size: clamp(28px, 3vw, 42px);
  line-height: 1;
  letter-spacing: -0.045em;
}

.task-priority-badge {
  padding: 6px 9px;

  border-radius: 999px;

  font-size: 8px;
  font-weight: 800;

  text-transform: uppercase;
}

.priority-high {
  background: #fae5e5;
  color: #ad4b4b;
}

.priority-medium {
  background: #f7f0dc;
  color: #997626;
}

.priority-low {
  background: #eaf3ef;
  color: #4f806a;
}

.next-task-time {
  display: flex;
  align-items: baseline;
  gap: 9px;

  margin-top: 30px;
}

.next-task-time strong {
  color: #10283f;

  font-size: 34px;
}

.next-task-time span {
  color: #8d9aa6;

  font-size: 10px;
}

.next-task-match {
  display: flex;
  align-items: center;
  gap: 8px;

  margin-top: 14px;

  color: #526575;

  font-size: 11px;
}

.next-task-match small {
  color: #a1aab2;
}

.next-task-meta {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;

  margin-top: auto;
  padding-top: 30px;
}

.next-task-meta div {
  display: flex;
  flex-direction: column;
  gap: 5px;

  padding: 11px;

  border-radius: 11px;

  background: #f4f7f9;
}

.next-task-meta span {
  color: #9ba6af;

  font-size: 7px;
  font-weight: 800;

  text-transform: uppercase;
}

.next-task-meta strong {
  color: #4f6272;

  font-size: 9px;
}

.open-task-link {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-top: 16px;
  padding-top: 15px;

  border-top: 1px solid rgba(25, 59, 84, 0.08);

  color: #10283f;

  font-size: 10px;
  font-weight: 700;
}

.next-task-empty {
  justify-content: space-between;
}

.next-task-empty p {
  max-width: 400px;

  color: #81909c;

  font-size: 11px;
  line-height: 1.6;
}

.dashboard-match-card {
  display: flex;
  flex-direction: column;

  background:
    linear-gradient(
      160deg,
      #123753,
      #0a2238
    );

  color: #ffffff;

  box-shadow:
    0 22px 50px rgba(9, 39, 66, 0.15);
}

.match-card-heading {
  display: flex;
  justify-content: space-between;
  gap: 10px;

  color: #7f9db2;

  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.1em;

  text-transform: uppercase;
}

.dashboard-match-date {
  margin: 38px 0 0;

  color: #6cb0d4;

  font-size: 10px;

  text-transform: capitalize;
}

.dashboard-match-teams {
  display: grid;
  gap: 6px;

  margin-top: 14px;
}

.dashboard-match-teams strong {
  color: #ffffff;

  font-size: 25px;
  line-height: 1;
  letter-spacing: -0.035em;
}

.dashboard-match-teams span {
  color: #66849a;

  font-size: 8px;
  font-weight: 800;

  text-transform: uppercase;
}

.dashboard-match-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;

  margin-top: 26px;
}

.dashboard-match-info div {
  display: flex;
  flex-direction: column;
  gap: 5px;

  padding: 11px;

  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 11px;

  background: rgba(255, 255, 255, 0.04);
}

.dashboard-match-info span {
  color: #7691a5;

  font-size: 7px;
  font-weight: 800;

  text-transform: uppercase;
}

.dashboard-match-info strong {
  color: #ffffff;

  font-size: 9px;
}

.match-progress {
  margin-top: auto;
  padding-top: 26px;
}

.match-progress-heading {
  display: flex;
  justify-content: space-between;

  margin-bottom: 8px;

  color: #7896aa;

  font-size: 8px;
  font-weight: 800;

  text-transform: uppercase;
}

.match-progress-track {
  height: 5px;

  overflow: hidden;

  border-radius: 999px;

  background: rgba(255, 255, 255, 0.1);
}

.match-progress-track span {
  display: block;

  height: 100%;

  border-radius: inherit;

  background: #65b8e2;
}

.dashboard-match-link {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-top: 18px;

  color: #dbe8f0;

  font-size: 10px;
  font-weight: 700;
}

.upcoming-section {
  padding: 20px;

  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 22px;

  background: rgba(255, 255, 255, 0.66);
}

.upcoming-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;

  margin-bottom: 14px;
}

.upcoming-heading h2 {
  margin: 0;

  color: #10283f;

  font-size: 24px;
  letter-spacing: -0.035em;
}

.upcoming-heading > span {
  color: #93a0aa;

  font-size: 9px;
}

.upcoming-task-list {
  display: grid;
}

.upcoming-task {
  display: grid;
  grid-template-columns:
    80px
    minmax(0, 1fr)
    100px
    120px
    auto;

  align-items: center;
  gap: 16px;

  padding: 14px 8px;

  border-top: 1px solid rgba(28, 62, 88, 0.07);

  transition: background 0.18s ease;
}

.upcoming-task:hover {
  background: rgba(241, 246, 249, 0.75);
}

.upcoming-time {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.upcoming-time strong {
  color: #10283f;

  font-size: 13px;
}

.upcoming-time span {
  color: #98a3ad;

  font-size: 8px;
}

.upcoming-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.upcoming-content strong {
  color: #314759;

  font-size: 11px;
}

.upcoming-content span {
  overflow: hidden;

  color: #8b98a3;

  font-size: 8px;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.upcoming-platform,
.upcoming-assignee {
  color: #647583;

  font-size: 9px;
}

.upcoming-arrow {
  color: #1783c1;

  font-size: 14px;
}

.upcoming-empty {
  padding: 30px 8px;

  border-top: 1px solid rgba(28, 62, 88, 0.07);

  color: #96a2ac;

  font-size: 10px;
}

@media (max-width: 900px) {
  .dashboard-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .dashboard-main-grid {
    grid-template-columns: 1fr;
  }

  .upcoming-task {
    grid-template-columns:
      70px
      minmax(0, 1fr)
      auto;
  }

  .upcoming-platform,
  .upcoming-assignee {
    display: none;
  }
}

@media (max-width: 640px) {
  .dashboard-intro {
    align-items: flex-start;
    flex-direction: column;
  }

  .dashboard-stats {
    grid-template-columns: 1fr 1fr;
  }

  .dashboard-stat {
    padding: 14px;
  }

  .next-task-meta {
    grid-template-columns: 1fr;
  }

  .dashboard-match-info {
    grid-template-columns: 1fr;
  }

  .upcoming-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .upcoming-task {
    grid-template-columns:
      58px
      minmax(0, 1fr)
      auto;

    gap: 10px;
  }
}
</style>