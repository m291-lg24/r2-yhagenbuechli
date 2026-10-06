<script setup>
import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'

import { useMatchStore } from '../stores/matchStore'
import { useTaskStore } from '../stores/taskStore'

const route = useRoute()

const matchStore = useMatchStore()
const taskStore = useTaskStore()

const showTaskForm = ref(false)

const match = computed(() => {
  return matchStore.getMatchById(route.params.id)
})

const tasks = computed(() => {
  if (!match.value) {
    return []
  }

  return taskStore.getTasksByMatch(match.value.id)
})

const taskPresets = [
  {
    name: 'Matchday Graphic',
    contentType: 'Graphic',
    platform: 'Instagram',
  },
  {
    name: 'Arrival Content',
    contentType: 'Photo',
    platform: 'Instagram',
  },
  {
    name: 'Arrival Reel',
    contentType: 'Reel',
    platform: 'Instagram',
  },
  {
    name: 'Matchday Story',
    contentType: 'Story',
    platform: 'Instagram',
  },
  {
    name: 'Starting XI',
    contentType: 'Graphic',
    platform: 'Instagram',
  },
  {
    name: 'Warm-up Content',
    contentType: 'Video',
    platform: 'Instagram',
  },
  {
    name: 'Kickoff Post',
    contentType: 'Graphic',
    platform: 'Instagram',
  },
  {
    name: 'Half-time Update',
    contentType: 'Graphic',
    platform: 'Instagram',
  },
  {
    name: 'Result Post',
    contentType: 'Graphic',
    platform: 'Instagram',
  },
  {
    name: 'Match Photos',
    contentType: 'Photo',
    platform: 'Website',
  },
  {
    name: 'Player Interview',
    contentType: 'Interview',
    platform: 'YouTube',
  },
  {
    name: 'Match Highlights',
    contentType: 'Video',
    platform: 'YouTube',
  },
  {
    name: 'Match Report',
    contentType: 'Article',
    platform: 'Website',
  },
]

const newTask = reactive({
  preset: '',
  title: '',
  contentType: '',
  platform: '',
  publishTime: '',
  priority: 'Medium',
  assignee: '',
})

const formError = ref('')

const statuses = [
  'Open',
  'In Progress',
  'Review',
  'Done',
]

const tasksByStatus = computed(() => {
  const groups = {
    Open: [],
    'In Progress': [],
    Review: [],
    Done: [],
  }

  tasks.value.forEach((task) => {
    if (groups[task.status]) {
      groups[task.status].push(task)
    }
  })

  return groups
})

const progress = computed(() => {
  if (!tasks.value.length) {
    return 0
  }

  const done = tasks.value.filter(
    (task) => task.status === 'Done',
  ).length

  return Math.round(
    (done / tasks.value.length) * 100,
  )
})

function formatDate(date) {
  if (!date) {
    return ''
  }

  return new Intl.DateTimeFormat('de-CH', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${date}T12:00:00`))
}

function selectPreset() {
  const preset = taskPresets.find(
    (item) => item.name === newTask.preset,
  )

  if (!preset) {
    return
  }

  newTask.title = preset.name
  newTask.contentType = preset.contentType
  newTask.platform = preset.platform
}

function addTask() {
  if (
    !newTask.title.trim() ||
    !newTask.contentType ||
    !newTask.platform ||
    !newTask.assignee.trim()
  ) {
    formError.value =
      'Titel, Content-Typ, Plattform und verantwortliche Person sind Pflicht.'

    return
  }

  taskStore.addTask({
    id: `task-${Date.now()}`,
    matchId: match.value.id,
    title: newTask.title.trim(),
    contentType: newTask.contentType,
    platform: newTask.platform,
    publishTime: newTask.publishTime,
    status: 'Open',
    priority: newTask.priority,
    assignee: newTask.assignee.trim(),
  })

  newTask.preset = ''
  newTask.title = ''
  newTask.contentType = ''
  newTask.platform = ''
  newTask.publishTime = ''
  newTask.priority = 'Medium'
  newTask.assignee = ''

  formError.value = ''
  showTaskForm.value = false
}

function changeStatus(task, status) {
  taskStore.updateTaskStatus(task.id, status)
}

function deleteTask(taskId) {
  taskStore.deleteTask(taskId)
}
</script>

<template>
  <section
    v-if="match"
    class="match-detail"
  >
    <RouterLink
      class="back-link"
      to="/matches"
    >
      ← Alle Matches
    </RouterLink>

    <div class="match-hero">
      <div class="match-hero-main">
        <div class="match-detail-top">
          <span class="detail-competition">
            {{ match.competition }}
          </span>

          <span class="detail-date">
            {{ formatDate(match.date) }}
          </span>
        </div>

        <div class="detail-teams">
          <div class="detail-team">
            <span>Home</span>
            <h1>{{ match.homeTeam }}</h1>
          </div>

          <div class="detail-vs">
            VS
          </div>

          <div class="detail-team detail-team-away">
            <span>Away</span>
            <h1>{{ match.awayTeam }}</h1>
          </div>
        </div>
      </div>

      <div class="match-info-panel">
        <div>
          <span>Kickoff</span>
          <strong>{{ match.kickoffTime }}</strong>
        </div>

        <div>
          <span>Stadion</span>
          <strong>{{ match.stadium }}</strong>
        </div>

        <div>
          <span>Content Progress</span>
          <strong>{{ progress }} %</strong>
        </div>
      </div>
    </div>

    <section class="match-data-section">
      <div class="section-title">
        <div>
          <p class="planner-label">
            Match center
          </p>

          <h2>Aufstellung & Stats</h2>
        </div>
      </div>

      <div class="match-data-grid">
        <article class="lineup-panel">
          <div class="data-card-heading">
            <div>
              <span>Starting XI</span>
              <h3>Aufstellung</h3>
            </div>

            <span class="data-status">
              Noch offen
            </span>
          </div>

          <div class="lineup-teams">
            <div>
              <span>Home</span>
              <strong>{{ match.homeTeam }}</strong>
            </div>

            <div>
              <span>Away</span>
              <strong>{{ match.awayTeam }}</strong>
            </div>
          </div>

          <div class="lineup-placeholder">
            <div class="pitch">
              <div class="pitch-line"></div>

              <span class="pitch-dot dot-one"></span>
              <span class="pitch-dot dot-two"></span>
              <span class="pitch-dot dot-three"></span>
              <span class="pitch-dot dot-four"></span>
              <span class="pitch-dot dot-five"></span>
            </div>

            <p>
              Die Aufstellung kann später manuell erfasst oder über eine API geladen werden.
            </p>
          </div>
        </article>

        <article class="stats-panel">
          <div class="data-card-heading">
            <div>
              <span>Match data</span>
              <h3>Stats</h3>
            </div>
          </div>

          <div class="stats-list">
            <div>
              <span>Ballbesitz</span>

              <div>
                <strong>–</strong>
                <small>:</small>
                <strong>–</strong>
              </div>
            </div>

            <div>
              <span>Schüsse</span>

              <div>
                <strong>–</strong>
                <small>:</small>
                <strong>–</strong>
              </div>
            </div>

            <div>
              <span>Schüsse aufs Tor</span>

              <div>
                <strong>–</strong>
                <small>:</small>
                <strong>–</strong>
              </div>
            </div>

            <div>
              <span>Ecken</span>

              <div>
                <strong>–</strong>
                <small>:</small>
                <strong>–</strong>
              </div>
            </div>

            <div>
              <span>Fouls</span>

              <div>
                <strong>–</strong>
                <small>:</small>
                <strong>–</strong>
              </div>
            </div>
          </div>

          <p class="stats-note">
            Noch keine Matchdaten vorhanden.
          </p>
        </article>
      </div>
    </section>

    <section class="content-planner">
      <div class="planner-header">
        <div>
          <p class="planner-label">
            Content planner
          </p>

          <h2>Content-Aufgaben</h2>

          <p>
            Plane alle Inhalte, die rund um diesen Matchday produziert werden.
          </p>
        </div>

        <button
          class="add-task-button"
          type="button"
          @click="showTaskForm = !showTaskForm"
        >
          {{ showTaskForm ? 'Schliessen' : '+ Aufgabe hinzufügen' }}
        </button>
      </div>

      <form
        v-if="showTaskForm"
        class="task-form"
        @submit.prevent="addTask"
      >
        <div class="task-form-heading">
          <div>
            <span>Neue Aufgabe</span>
            <h3>Content planen</h3>
          </div>

          <span>
            {{ match.homeTeam }} vs {{ match.awayTeam }}
          </span>
        </div>

        <div class="task-form-grid">
          <div class="form-field form-field-wide">
            <label for="preset">
              Vorlage
            </label>

            <select
              id="preset"
              v-model="newTask.preset"
              @change="selectPreset"
            >
              <option value="">
                Aufgabe auswählen
              </option>

              <option
                v-for="preset in taskPresets"
                :key="preset.name"
                :value="preset.name"
              >
                {{ preset.name }}
              </option>
            </select>
          </div>

          <div class="form-field form-field-wide">
            <label for="title">
              Titel
            </label>

            <input
              id="title"
              v-model="newTask.title"
              type="text"
              placeholder="z. B. Starting XI"
            >
          </div>

          <div class="form-field">
            <label for="contentType">
              Content-Typ
            </label>

            <select
              id="contentType"
              v-model="newTask.contentType"
            >
              <option value="">
                Auswählen
              </option>
              <option>Graphic</option>
              <option>Photo</option>
              <option>Video</option>
              <option>Reel</option>
              <option>Story</option>
              <option>Interview</option>
              <option>Article</option>
            </select>
          </div>

          <div class="form-field">
            <label for="platform">
              Plattform
            </label>

            <select
              id="platform"
              v-model="newTask.platform"
            >
              <option value="">
                Auswählen
              </option>
              <option>Instagram</option>
              <option>TikTok</option>
              <option>YouTube</option>
              <option>Website</option>
              <option>X</option>
            </select>
          </div>

          <div class="form-field">
            <label for="publishTime">
              Veröffentlichungszeit
            </label>

            <input
              id="publishTime"
              v-model="newTask.publishTime"
              type="time"
            >
          </div>

          <div class="form-field">
            <label for="priority">
              Priorität
            </label>

            <select
              id="priority"
              v-model="newTask.priority"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <div class="form-field form-field-wide">
            <label for="assignee">
              Verantwortlich
            </label>

            <input
              id="assignee"
              v-model="newTask.assignee"
              type="text"
              placeholder="Name"
            >
          </div>
        </div>

        <p
          v-if="formError"
          class="form-error"
        >
          {{ formError }}
        </p>

        <div class="form-actions">
          <button
            class="secondary-button"
            type="button"
            @click="showTaskForm = false"
          >
            Abbrechen
          </button>

          <button
            class="save-task-button"
            type="submit"
          >
            Aufgabe erstellen
          </button>
        </div>
      </form>

      <div class="progress-block">
        <div>
          <span>Matchday Progress</span>
          <strong>{{ progress }} %</strong>
        </div>

        <div class="progress-track">
          <span
            class="progress-fill"
            :style="{ width: `${progress}%` }"
          ></span>
        </div>
      </div>

      <div class="planner-grid">
        <article
          v-for="status in statuses"
          :key="status"
          class="planner-column"
        >
          <div class="column-heading">
            <span
              class="status-dot"
              :class="{
                'status-open': status === 'Open',
                'status-progress': status === 'In Progress',
                'status-review': status === 'Review',
                'status-done': status === 'Done',
              }"
            ></span>

            <h3>{{ status }}</h3>

            <span>
              {{ tasksByStatus[status].length }}
            </span>
          </div>

          <div
            v-if="tasksByStatus[status].length"
            class="task-list"
          >
            <article
              v-for="task in tasksByStatus[status]"
              :key="task.id"
              class="task-card"
            >
              <div class="task-card-top">
                <span>
                  {{ task.contentType }}
                </span>

                <span
                  class="priority"
                  :class="`priority-${task.priority.toLowerCase()}`"
                >
                  {{ task.priority }}
                </span>
              </div>

              <h4>{{ task.title }}</h4>

              <div class="task-details">
                <span>{{ task.platform }}</span>

                <span v-if="task.publishTime">
                  {{ task.publishTime }}
                </span>
              </div>

              <div class="task-assignee">
                {{ task.assignee }}
              </div>

              <select
                class="status-select"
                :value="task.status"
                @change="changeStatus(task, $event.target.value)"
              >
                <option
                  v-for="option in statuses"
                  :key="option"
                  :value="option"
                >
                  {{ option }}
                </option>
              </select>

              <button
                class="delete-task"
                type="button"
                @click="deleteTask(task.id)"
              >
                Löschen
              </button>
            </article>
          </div>

          <div
            v-else
            class="column-empty"
          >
            Noch keine Aufgaben.
          </div>
        </article>
      </div>
    </section>
  </section>

  <section
    v-else
    class="match-not-found"
  >
    <p class="eyebrow">
      Match nicht gefunden
    </p>

    <h1>Dieses Match existiert nicht.</h1>

    <RouterLink to="/matches">
      Zur Matchübersicht
    </RouterLink>
  </section>
</template>

<style scoped>
.match-detail {
  padding: 18px 0 50px;
}

.back-link {
  display: inline-flex;
  margin-bottom: 24px;

  color: #71818f;

  font-size: 11px;
  font-weight: 700;
}

.match-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(260px, 0.45fr);
  gap: 16px;

  padding: 16px;

  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 28px;

  background: rgba(255, 255, 255, 0.7);

  box-shadow:
    0 22px 60px rgba(32, 67, 94, 0.07);

  backdrop-filter: blur(18px);
}

.match-hero-main {
  padding: 26px;
}

.match-detail-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.detail-competition {
  padding: 6px 10px;

  border-radius: 999px;

  background: rgba(23, 131, 193, 0.1);
  color: #1478ae;

  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.08em;

  text-transform: uppercase;
}

.detail-date {
  color: #82919e;

  font-size: 11px;
}

.detail-teams {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 24px;

  margin-top: 58px;
}

.detail-team {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-team span {
  color: #98a4af;

  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.12em;

  text-transform: uppercase;
}

.detail-team h1 {
  margin: 0;

  color: #10283f;

  font-size: clamp(30px, 4vw, 54px);
  font-weight: 700;
  line-height: 0.98;
  letter-spacing: -0.055em;
}

.detail-team-away {
  align-items: flex-end;
  text-align: right;
}

.detail-vs {
  display: grid;
  place-items: center;

  width: 44px;
  height: 44px;

  border: 1px solid #dce5eb;
  border-radius: 50%;

  color: #8d9aa5;

  font-size: 9px;
  font-weight: 800;
}

.match-info-panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;

  padding: 22px;

  border-radius: 20px;

  background:
    linear-gradient(
      160deg,
      #123753,
      #0a2238
    );

  color: #ffffff;
}

.match-info-panel div {
  display: flex;
  flex-direction: column;
  gap: 6px;

  padding: 14px;

  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 13px;

  background: rgba(255, 255, 255, 0.05);
}

.match-info-panel span {
  color: #7692a7;

  font-size: 8px;
  font-weight: 800;

  text-transform: uppercase;
}

.match-info-panel strong {
  font-size: 13px;
}

.match-data-section,
.content-planner {
  margin-top: 42px;
}

.section-title,
.planner-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  margin-bottom: 18px;
}

.section-title h2,
.planner-header h2 {
  margin: 0;

  color: #10283f;

  font-size: 28px;
  letter-spacing: -0.04em;
}

.planner-label {
  margin: 0 0 8px;

  color: #1783c1;

  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.15em;

  text-transform: uppercase;
}

.match-data-grid {
  display: grid;
  grid-template-columns: 1.35fr 0.65fr;
  gap: 14px;
}

.lineup-panel,
.stats-panel {
  padding: 20px;

  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 20px;

  background: rgba(255, 255, 255, 0.66);

  backdrop-filter: blur(16px);
}

.data-card-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.data-card-heading span {
  color: #8e9ba6;

  font-size: 8px;
  font-weight: 800;

  text-transform: uppercase;
}

.data-card-heading h3 {
  margin: 5px 0 0;

  color: #23394c;

  font-size: 17px;
}

.data-status {
  padding: 5px 8px;

  border-radius: 999px;

  background: #f0f3f5;
}

.lineup-teams {
  display: grid;
  grid-template-columns: 1fr 1fr;

  gap: 12px;

  margin-top: 24px;
}

.lineup-teams div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.lineup-teams div:last-child {
  text-align: right;
}

.lineup-teams span {
  color: #9aa6b0;

  font-size: 8px;

  text-transform: uppercase;
}

.lineup-teams strong {
  color: #24394c;

  font-size: 13px;
}

.lineup-placeholder {
  display: grid;
  grid-template-columns: 180px 1fr;
  align-items: center;
  gap: 24px;

  margin-top: 20px;
}

.pitch {
  position: relative;

  height: 210px;

  overflow: hidden;

  border-radius: 15px;

  background:
    linear-gradient(
      180deg,
      #406f63,
      #315b52
    );
}

.pitch::before {
  position: absolute;
  inset: 12px;

  content: "";

  border: 1px solid rgba(255, 255, 255, 0.48);
}

.pitch-line {
  position: absolute;
  top: 50%;
  left: 12px;
  right: 12px;

  border-top: 1px solid rgba(255, 255, 255, 0.48);
}

.pitch-dot {
  position: absolute;

  width: 14px;
  height: 14px;

  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 50%;

  background: #1783c1;
}

.dot-one {
  top: 18px;
  left: 83px;
}

.dot-two {
  top: 65px;
  left: 38px;
}

.dot-three {
  top: 65px;
  right: 38px;
}

.dot-four {
  bottom: 44px;
  left: 60px;
}

.dot-five {
  bottom: 44px;
  right: 60px;
}

.lineup-placeholder p {
  margin: 0;

  color: #83909b;

  font-size: 11px;
  line-height: 1.6;
}

.stats-list {
  margin-top: 20px;
}

.stats-list > div {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 13px 0;

  border-bottom: 1px solid rgba(26, 61, 90, 0.08);
}

.stats-list > div > span {
  color: #7d8b97;

  font-size: 10px;
}

.stats-list div div {
  display: flex;
  gap: 8px;
}

.stats-list strong {
  color: #24394c;

  font-size: 12px;
}

.stats-list small {
  color: #a2abb3;
}

.stats-note {
  margin: 16px 0 0;

  color: #a0aab3;

  font-size: 9px;
}

.planner-header {
  gap: 30px;
}

.planner-header > div > p:last-child {
  max-width: 580px;
  margin: 8px 0 0;

  color: #788795;

  font-size: 12px;
}

.add-task-button {
  padding: 11px 15px;

  border: 0;
  border-radius: 12px;

  cursor: pointer;

  background: #10283f;
  color: #ffffff;

  font-size: 11px;
  font-weight: 700;
}

.task-form {
  margin-bottom: 18px;
  padding: 20px;

  border: 1px solid rgba(255, 255, 255, 0.85);
  border-radius: 20px;

  background: rgba(255, 255, 255, 0.74);

  backdrop-filter: blur(18px);
}

.task-form-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  margin-bottom: 20px;
}

.task-form-heading span {
  color: #8b99a5;

  font-size: 9px;
}

.task-form-heading h3 {
  margin: 4px 0 0;

  color: #24394c;
}

.task-form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-field-wide {
  grid-column: 1 / -1;
}

.form-field label {
  color: #7f8c98;

  font-size: 9px;
  font-weight: 800;

  text-transform: uppercase;
}

.form-field input,
.form-field select {
  height: 42px;

  padding: 0 12px;

  border: 1px solid #dce5eb;
  border-radius: 11px;

  outline: none;

  background: #ffffff;
  color: #24394c;

  font-size: 12px;
}

.form-field input:focus,
.form-field select:focus {
  border-color: #75b5d7;

  box-shadow:
    0 0 0 3px rgba(23, 131, 193, 0.08);
}

.form-error {
  margin: 14px 0 0;

  color: #b54848;

  font-size: 10px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;

  margin-top: 18px;
}

.secondary-button,
.save-task-button {
  padding: 10px 13px;

  border: 0;
  border-radius: 10px;

  cursor: pointer;

  font-size: 10px;
  font-weight: 700;
}

.secondary-button {
  background: #edf1f4;
  color: #62717f;
}

.save-task-button {
  background: #10283f;
  color: #ffffff;
}

.progress-block {
  margin-bottom: 14px;
  padding: 14px 16px;

  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 15px;

  background: rgba(255, 255, 255, 0.62);
}

.progress-block > div:first-child {
  display: flex;
  justify-content: space-between;

  margin-bottom: 9px;

  color: #73818e;

  font-size: 9px;
  font-weight: 700;

  text-transform: uppercase;
}

.progress-track {
  height: 5px;

  overflow: hidden;

  border-radius: 999px;

  background: #e2e9ed;
}

.progress-fill {
  display: block;

  height: 100%;

  border-radius: inherit;

  background: #1783c1;

  transition: width 0.25s ease;
}

.planner-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.planner-column {
  min-height: 270px;
  padding: 14px;

  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 18px;

  background: rgba(255, 255, 255, 0.62);
}

.column-heading {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 8px;

  padding-bottom: 12px;

  border-bottom: 1px solid rgba(24, 61, 91, 0.08);
}

.column-heading h3 {
  margin: 0;

  color: #415365;

  font-size: 11px;
}

.column-heading > span:last-child {
  color: #9aa6b0;

  font-size: 9px;
}

.status-dot {
  width: 7px;
  height: 7px;

  border-radius: 50%;
}

.status-open {
  background: #9aa6b0;
}

.status-progress {
  background: #1783c1;
}

.status-review {
  background: #d3a62d;
}

.status-done {
  background: #3a9b69;
}

.column-empty {
  display: grid;
  place-items: center;

  min-height: 210px;

  color: #a0aab3;

  font-size: 10px;
}

.task-list {
  display: grid;
  gap: 9px;

  margin-top: 10px;
}

.task-card {
  padding: 12px;

  border: 1px solid #e4e9ed;
  border-radius: 13px;

  background: #ffffff;
}

.task-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;

  color: #83919d;

  font-size: 8px;

  text-transform: uppercase;
}

.priority {
  padding: 4px 6px;

  border-radius: 999px;
}

.priority-low {
  background: #eef4f1;
  color: #5f8570;
}

.priority-medium {
  background: #f8f2df;
  color: #9a7a27;
}

.priority-high {
  background: #fae7e7;
  color: #b05555;
}

.task-card h4 {
  margin: 12px 0 8px;

  color: #24394c;

  font-size: 13px;
}

.task-details {
  display: flex;
  justify-content: space-between;

  color: #8a97a2;

  font-size: 9px;
}

.task-assignee {
  margin-top: 10px;

  color: #5c6c7a;

  font-size: 9px;
  font-weight: 650;
}

.status-select {
  width: 100%;
  height: 32px;

  margin-top: 12px;
  padding: 0 8px;

  border: 1px solid #dfe6eb;
  border-radius: 8px;

  background: #f8fafb;

  color: #526474;

  font-size: 9px;
}

.delete-task {
  width: 100%;

  margin-top: 7px;
  padding: 7px;

  border: 0;
  border-radius: 7px;

  cursor: pointer;

  background: transparent;
  color: #a06767;

  font-size: 8px;
}

.match-not-found {
  padding: 80px 0;
}

@media (max-width: 950px) {
  .match-hero,
  .match-data-grid {
    grid-template-columns: 1fr;
  }

  .planner-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .detail-teams {
    grid-template-columns: 1fr;
  }

  .detail-team-away {
    align-items: flex-start;
    text-align: left;
  }

  .detail-vs {
    width: auto;
    height: auto;

    justify-content: start;

    border: 0;
  }

  .lineup-placeholder {
    grid-template-columns: 1fr;
  }

  .pitch {
    max-width: 220px;
  }

  .planner-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .task-form-grid,
  .planner-grid {
    grid-template-columns: 1fr;
  }

  .form-field-wide {
    grid-column: auto;
  }
}
</style>