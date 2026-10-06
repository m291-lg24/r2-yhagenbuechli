<script setup>
import {
  computed,
  reactive,
  ref,
} from 'vue'

import { useRoute } from 'vue-router'

import { useMatchStore } from '../stores/matchStore'
import { useTaskStore } from '../stores/taskStore'

const route = useRoute()

const matchStore = useMatchStore()
const taskStore = useTaskStore()

const showTaskForm = ref(false)
const editingTaskId = ref(null)
const deleteTaskId = ref(null)
const formError = ref('')

const statuses = [
  'Open',
  'In Progress',
  'Review',
  'Done',
]

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

const taskForm = reactive({
  preset: '',
  title: '',
  contentType: '',
  platform: '',
  publishTime: '',
  priority: 'Medium',
  assignee: '',
  status: 'Open',
})

const match = computed(() => {
  return matchStore.getMatchById(route.params.id)
})

const tasks = computed(() => {
  if (!match.value) {
    return []
  }

  return taskStore.getTasksByMatch(
    match.value.id,
  )
})

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

  const completedTasks =
    tasks.value.filter(
      (task) => task.status === 'Done',
    ).length

  return Math.round(
    (completedTasks / tasks.value.length) *
      100,
  )
})

const nextTask = computed(() => {
  const openTasks = tasks.value
    .filter(
      (task) =>
        task.status !== 'Done' &&
        task.publishTime,
    )
    .sort((a, b) =>
      a.publishTime.localeCompare(
        b.publishTime,
      ),
    )

  return openTasks[0] ?? null
})

function formatDate(date) {
  if (!date) {
    return ''
  }

  return new Intl.DateTimeFormat(
    'de-CH',
    {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    },
  ).format(
    new Date(`${date}T12:00:00`),
  )
}

function selectPreset() {
  const preset = taskPresets.find(
    (item) =>
      item.name === taskForm.preset,
  )

  if (!preset) {
    return
  }

  taskForm.title = preset.name
  taskForm.contentType =
    preset.contentType
  taskForm.platform = preset.platform
}

function resetForm() {
  taskForm.preset = ''
  taskForm.title = ''
  taskForm.contentType = ''
  taskForm.platform = ''
  taskForm.publishTime = ''
  taskForm.priority = 'Medium'
  taskForm.assignee = ''
  taskForm.status = 'Open'

  editingTaskId.value = null
  formError.value = ''
}

function openCreateForm() {
  resetForm()

  showTaskForm.value = true

  window.scrollTo({
    top: 500,
    behavior: 'smooth',
  })
}

function closeForm() {
  showTaskForm.value = false
  resetForm()
}

function editTask(task) {
  editingTaskId.value = task.id

  taskForm.preset = ''
  taskForm.title = task.title
  taskForm.contentType =
    task.contentType
  taskForm.platform = task.platform
  taskForm.publishTime =
    task.publishTime || ''
  taskForm.priority =
    task.priority || 'Medium'
  taskForm.assignee =
    task.assignee || ''
  taskForm.status =
    task.status || 'Open'

  formError.value = ''
  showTaskForm.value = true
}

function validateForm() {
  if (!taskForm.title.trim()) {
    formError.value =
      'Bitte gib einen Titel ein.'

    return false
  }

  if (!taskForm.contentType) {
    formError.value =
      'Bitte wähle einen Content-Typ.'

    return false
  }

  if (!taskForm.platform) {
    formError.value =
      'Bitte wähle eine Plattform.'

    return false
  }

  if (!taskForm.assignee.trim()) {
    formError.value =
      'Bitte gib eine verantwortliche Person ein.'

    return false
  }

  formError.value = ''

  return true
}

function saveTask() {
  if (!validateForm()) {
    return
  }

  const taskData = {
    matchId: match.value.id,
    title: taskForm.title.trim(),
    contentType:
      taskForm.contentType,
    platform: taskForm.platform,
    publishTime:
      taskForm.publishTime,
    priority: taskForm.priority,
    assignee:
      taskForm.assignee.trim(),
    status: taskForm.status,
  }

  if (editingTaskId.value) {
    taskStore.updateTask(
      editingTaskId.value,
      taskData,
    )
  } else {
    taskStore.addTask(taskData)
  }

  closeForm()
}

function changeStatus(
  task,
  newStatus,
) {
  taskStore.updateTaskStatus(
    task.id,
    newStatus,
  )
}

function askDelete(taskId) {
  deleteTaskId.value = taskId
}

function cancelDelete() {
  deleteTaskId.value = null
}

function confirmDelete(taskId) {
  taskStore.deleteTask(taskId)

  deleteTaskId.value = null

  if (
    editingTaskId.value === taskId
  ) {
    closeForm()
  }
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

    <section class="match-hero">
      <div class="match-hero-main">
        <div class="match-detail-top">
          <span
            class="detail-competition"
          >
            {{ match.competition }}
          </span>

          <span class="detail-date">
            {{ formatDate(match.date) }}
          </span>
        </div>

        <div class="detail-teams">
          <div class="detail-team">
            <span>Home</span>

            <h1>
              {{ match.homeTeam }}
            </h1>
          </div>

          <div class="detail-vs">
            VS
          </div>

          <div
            class="
              detail-team
              detail-team-away
            "
          >
            <span>Away</span>

            <h1>
              {{ match.awayTeam }}
            </h1>
          </div>
        </div>
      </div>

      <aside
        class="match-info-panel"
      >
        <div>
          <span>Kickoff</span>

          <strong>
            {{ match.kickoffTime }}
          </strong>
        </div>

        <div>
          <span>Stadion</span>

          <strong>
            {{ match.stadium }}
          </strong>
        </div>

        <div>
          <span>
            Content Progress
          </span>

          <strong>
            {{ progress }} %
          </strong>
        </div>
      </aside>
    </section>

    <section
      v-if="nextTask"
      class="next-content-card"
    >
      <div>
        <span>
          Nächste Aufgabe
        </span>

        <strong>
          {{ nextTask.title }}
        </strong>
      </div>

      <div>
        <span>
          Veröffentlichung
        </span>

        <strong>
          {{ nextTask.publishTime }}
        </strong>
      </div>

      <div>
        <span>
          Verantwortlich
        </span>

        <strong>
          {{ nextTask.assignee }}
        </strong>
      </div>

      <div>
        <span>
          Plattform
        </span>

        <strong>
          {{ nextTask.platform }}
        </strong>
      </div>
    </section>

    <section
      class="content-planner"
    >
      <header
        class="planner-header"
      >
        <div>
          <p class="planner-label">
            Content planner
          </p>

          <h2>
            Content-Aufgaben
          </h2>

          <p>
            Plane und verwalte alle
            Inhalte für diesen
            Matchday.
          </p>
        </div>

        <button
          class="add-task-button"
          type="button"
          @click="openCreateForm"
        >
          + Aufgabe hinzufügen
        </button>
      </header>

      <form
        v-if="showTaskForm"
        class="task-form"
        @submit.prevent="saveTask"
      >
        <div
          class="
            task-form-heading
            form-field-wide
          "
        >
          <div>
            <span>
              {{
                editingTaskId
                  ? 'Aufgabe bearbeiten'
                  : 'Neue Aufgabe'
              }}
            </span>

            <h3>
              {{
                editingTaskId
                  ? 'Content anpassen'
                  : 'Content planen'
              }}
            </h3>
          </div>

          <button
            type="button"
            class="form-close"
            @click="closeForm"
          >
            ×
          </button>
        </div>

        <div
          v-if="!editingTaskId"
          class="
            form-field
            form-field-wide
          "
        >
          <label for="preset">
            Vorlage
          </label>

          <select
            id="preset"
            v-model="taskForm.preset"
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

        <div
          class="
            form-field
            form-field-wide
          "
        >
          <label for="title">
            Titel
          </label>

          <input
            id="title"
            v-model="taskForm.title"
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
            v-model="
              taskForm.contentType
            "
          >
            <option value="">
              Auswählen
            </option>

            <option>
              Graphic
            </option>

            <option>
              Photo
            </option>

            <option>
              Video
            </option>

            <option>
              Reel
            </option>

            <option>
              Story
            </option>

            <option>
              Interview
            </option>

            <option>
              Article
            </option>
          </select>
        </div>

        <div class="form-field">
          <label for="platform">
            Plattform
          </label>

          <select
            id="platform"
            v-model="
              taskForm.platform
            "
          >
            <option value="">
              Auswählen
            </option>

            <option>
              Instagram
            </option>

            <option>
              TikTok
            </option>

            <option>
              YouTube
            </option>

            <option>
              Website
            </option>

            <option>
              X
            </option>
          </select>
        </div>

        <div class="form-field">
          <label for="publishTime">
            Veröffentlichungszeit
          </label>

          <input
            id="publishTime"
            v-model="
              taskForm.publishTime
            "
            type="time"
          >
        </div>

        <div class="form-field">
          <label for="priority">
            Priorität
          </label>

          <select
            id="priority"
            v-model="
              taskForm.priority
            "
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        <div class="form-field">
          <label for="assignee">
            Verantwortlich
          </label>

          <input
            id="assignee"
            v-model="
              taskForm.assignee
            "
            type="text"
            placeholder="Name"
          >
        </div>

        <div class="form-field">
          <label for="status">
            Status
          </label>

          <select
            id="status"
            v-model="taskForm.status"
          >
            <option
              v-for="status in statuses"
              :key="status"
              :value="status"
            >
              {{ status }}
            </option>
          </select>
        </div>

        <p
          v-if="formError"
          class="
            form-error
            form-field-wide
          "
        >
          {{ formError }}
        </p>

        <div
          class="
            form-actions
            form-field-wide
          "
        >
          <button
            class="secondary-button"
            type="button"
            @click="closeForm"
          >
            Abbrechen
          </button>

          <button
            class="save-task-button"
            type="submit"
          >
            {{
              editingTaskId
                ? 'Änderungen speichern'
                : 'Aufgabe erstellen'
            }}
          </button>
        </div>
      </form>

      <div class="progress-block">
        <div>
          <span>
            Matchday Progress
          </span>

          <strong>
            {{ progress }} %
          </strong>
        </div>

        <div class="progress-track">
          <span
            class="progress-fill"
            :style="{
              width: `${progress}%`,
            }"
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
                'status-open':
                  status === 'Open',

                'status-progress':
                  status ===
                  'In Progress',

                'status-review':
                  status === 'Review',

                'status-done':
                  status === 'Done',
              }"
            ></span>

            <h3>
              {{ status }}
            </h3>

            <span>
              {{
                tasksByStatus[
                  status
                ].length
              }}
            </span>
          </div>

          <div
            v-if="
              tasksByStatus[
                status
              ].length
            "
            class="task-list"
          >
            <article
              v-for="task in
                tasksByStatus[
                  status
                ]"
              :key="task.id"
              class="task-card"
            >
              <div
                class="
                  task-card-top
                "
              >
                <span>
                  {{ task.contentType }}
                </span>

                <span
                  class="priority"
                  :class="
                    `priority-${
                      (
                        task.priority ||
                        'medium'
                      ).toLowerCase()
                    }`
                  "
                >
                  {{
                    task.priority ||
                    'Medium'
                  }}
                </span>
              </div>

              <h4>
                {{ task.title }}
              </h4>

              <div
                class="task-details"
              >
                <span>
                  {{ task.platform }}
                </span>

                <span
                  v-if="
                    task.publishTime
                  "
                >
                  {{
                    task.publishTime
                  }}
                </span>
              </div>

              <div
                class="task-assignee"
              >
                {{
                  task.assignee ||
                  'Nicht zugewiesen'
                }}
              </div>

              <select
                class="status-select"
                :value="task.status"
                @change="
                  changeStatus(
                    task,
                    $event.target.value,
                  )
                "
              >
                <option
                  v-for="
                    option in statuses
                  "
                  :key="option"
                  :value="option"
                >
                  {{ option }}
                </option>
              </select>

              <div
                class="task-actions"
              >
                <button
                  class="
                    edit-task
                  "
                  type="button"
                  @click="
                    editTask(task)
                  "
                >
                  Bearbeiten
                </button>

                <button
                  v-if="
                    deleteTaskId !==
                    task.id
                  "
                  class="
                    delete-task
                  "
                  type="button"
                  @click="
                    askDelete(
                      task.id,
                    )
                  "
                >
                  Löschen
                </button>
              </div>

              <div
                v-if="
                  deleteTaskId ===
                  task.id
                "
                class="
                  delete-confirm
                "
              >
                <p>
                  Aufgabe wirklich
                  löschen?
                </p>

                <div>
                  <button
                    type="button"
                    class="
                      delete-cancel
                    "
                    @click="
                      cancelDelete
                    "
                  >
                    Nein
                  </button>

                  <button
                    type="button"
                    class="
                      delete-confirm-button
                    "
                    @click="
                      confirmDelete(
                        task.id,
                      )
                    "
                  >
                    Ja, löschen
                  </button>
                </div>
              </div>
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

    <section
      class="match-data-section"
    >
      <div class="section-title">
        <div>
          <p class="planner-label">
            Match center
          </p>

          <h2>
            Aufstellung & Stats
          </h2>
        </div>
      </div>

      <div class="match-data-grid">
        <article
          class="lineup-panel"
        >
          <div
            class="
              data-card-heading
            "
          >
            <div>
              <span>
                Starting XI
              </span>

              <h3>
                Aufstellung
              </h3>
            </div>

            <span
              class="data-status"
            >
              Noch offen
            </span>
          </div>

          <div class="lineup-teams">
            <div>
              <span>Home</span>

              <strong>
                {{ match.homeTeam }}
              </strong>
            </div>

            <div>
              <span>Away</span>

              <strong>
                {{ match.awayTeam }}
              </strong>
            </div>
          </div>

          <div
            class="
              lineup-placeholder
            "
          >
            <div class="pitch">
              <div
                class="pitch-line"
              ></div>

              <span
                class="
                  pitch-dot
                  dot-one
                "
              ></span>

              <span
                class="
                  pitch-dot
                  dot-two
                "
              ></span>

              <span
                class="
                  pitch-dot
                  dot-three
                "
              ></span>

              <span
                class="
                  pitch-dot
                  dot-four
                "
              ></span>

              <span
                class="
                  pitch-dot
                  dot-five
                "
              ></span>
            </div>

            <p>
              Die Aufstellung wird
              später als eigener
              Matchday-Bereich
              ausgebaut.
            </p>
          </div>
        </article>

        <article
          class="stats-panel"
        >
          <div
            class="
              data-card-heading
            "
          >
            <div>
              <span>
                Match data
              </span>

              <h3>
                Stats
              </h3>
            </div>
          </div>

          <div class="stats-list">
            <div>
              <span>
                Ballbesitz
              </span>

              <div>
                <strong>–</strong>
                <small>:</small>
                <strong>–</strong>
              </div>
            </div>

            <div>
              <span>
                Schüsse
              </span>

              <div>
                <strong>–</strong>
                <small>:</small>
                <strong>–</strong>
              </div>
            </div>

            <div>
              <span>
                Schüsse aufs Tor
              </span>

              <div>
                <strong>–</strong>
                <small>:</small>
                <strong>–</strong>
              </div>
            </div>

            <div>
              <span>
                Ecken
              </span>

              <div>
                <strong>–</strong>
                <small>:</small>
                <strong>–</strong>
              </div>
            </div>
          </div>

          <p class="stats-note">
            Noch keine Matchdaten
            vorhanden.
          </p>
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

    <h1>
      Dieses Match existiert nicht.
    </h1>

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
  grid-template-columns:
    minmax(0, 1.55fr)
    minmax(260px, 0.45fr);

  gap: 16px;

  padding: 16px;

  border: 1px solid
    rgba(255, 255, 255, 0.8);

  border-radius: 28px;

  background:
    rgba(255, 255, 255, 0.7);

  box-shadow:
    0 22px 60px
    rgba(32, 67, 94, 0.07);
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

  background:
    rgba(23, 131, 193, 0.1);

  color: #1478ae;

  font-size: 9px;
  font-weight: 800;
}

.detail-date {
  color: #82919e;

  font-size: 11px;
}

.detail-teams {
  display: grid;
  grid-template-columns:
    1fr
    auto
    1fr;

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

  text-transform: uppercase;
}

.detail-team h1 {
  margin: 0;

  color: #10283f;

  font-size:
    clamp(30px, 4vw, 54px);

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
}

.match-info-panel div {
  display: flex;
  flex-direction: column;

  gap: 6px;

  padding: 14px;

  border: 1px solid
    rgba(255, 255, 255, 0.08);

  border-radius: 13px;

  background:
    rgba(255, 255, 255, 0.05);
}

.match-info-panel span {
  color: #7692a7;

  font-size: 8px;
  font-weight: 800;

  text-transform: uppercase;
}

.match-info-panel strong {
  color: white;

  font-size: 13px;
}

.next-content-card {
  display: grid;
  grid-template-columns:
    1.5fr
    repeat(3, 1fr);

  gap: 10px;

  margin-top: 16px;
  padding: 15px;

  border: 1px solid
    rgba(255, 255, 255, 0.8);

  border-radius: 17px;

  background:
    rgba(255, 255, 255, 0.68);
}

.next-content-card div {
  display: flex;
  flex-direction: column;

  gap: 4px;

  padding: 9px;
}

.next-content-card span {
  color: #98a4ad;

  font-size: 7px;
  font-weight: 800;

  text-transform: uppercase;
}

.next-content-card strong {
  color: #405466;

  font-size: 10px;
}

.content-planner,
.match-data-section {
  margin-top: 42px;
}

.planner-header,
.section-title {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  gap: 20px;

  margin-bottom: 18px;
}

.planner-label {
  margin: 0 0 8px;

  color: #1783c1;

  font-size: 9px;
  font-weight: 800;

  letter-spacing: 0.15em;

  text-transform: uppercase;
}

.planner-header h2,
.section-title h2 {
  margin: 0;

  color: #10283f;

  font-size: 28px;

  letter-spacing: -0.04em;
}

.planner-header
> div
> p:last-child {
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
  color: white;

  font-size: 11px;
  font-weight: 700;
}

.task-form {
  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 14px;

  margin-bottom: 18px;
  padding: 20px;

  border: 1px solid
    rgba(255, 255, 255, 0.85);

  border-radius: 20px;

  background:
    rgba(255, 255, 255, 0.76);
}

.form-field-wide {
  grid-column: 1 / -1;
}

.task-form-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.task-form-heading span {
  color: #8b99a5;

  font-size: 9px;

  text-transform: uppercase;
}

.task-form-heading h3 {
  margin: 5px 0 0;

  color: #24394c;
}

.form-close {
  display: grid;
  place-items: center;

  width: 34px;
  height: 34px;

  border: 0;
  border-radius: 50%;

  cursor: pointer;

  background: #edf2f5;
  color: #60717f;

  font-size: 18px;
}

.form-field {
  display: flex;
  flex-direction: column;

  gap: 6px;
}

.form-field label {
  color: #7f8c98;

  font-size: 9px;
  font-weight: 800;

  text-transform: uppercase;
}

.form-field input,
.form-field select {
  width: 100%;
  height: 42px;

  padding: 0 12px;

  border: 1px solid #dce5eb;
  border-radius: 11px;

  outline: none;

  background: white;
  color: #24394c;

  font-size: 12px;
}

.form-field input:focus,
.form-field select:focus {
  border-color: #75b5d7;

  box-shadow:
    0 0 0 3px
    rgba(23, 131, 193, 0.08);
}

.form-error {
  margin: 0;

  color: #b54848;

  font-size: 10px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;

  gap: 8px;
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
  color: white;
}

.progress-block {
  margin-bottom: 14px;
  padding: 14px 16px;

  border: 1px solid
    rgba(255, 255, 255, 0.8);

  border-radius: 15px;

  background:
    rgba(255, 255, 255, 0.62);
}

.progress-block
> div:first-child {
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

  transition:
    width 0.25s ease;
}

.planner-grid {
  display: grid;
  grid-template-columns:
    repeat(4, minmax(0, 1fr));

  gap: 12px;
}

.planner-column {
  min-height: 270px;

  padding: 14px;

  border: 1px solid
    rgba(255, 255, 255, 0.8);

  border-radius: 18px;

  background:
    rgba(255, 255, 255, 0.62);
}

.column-heading {
  display: grid;
  grid-template-columns:
    auto
    1fr
    auto;

  align-items: center;

  gap: 8px;

  padding-bottom: 12px;

  border-bottom: 1px solid
    rgba(24, 61, 91, 0.08);
}

.column-heading h3 {
  margin: 0;

  color: #415365;

  font-size: 11px;
}

.column-heading
> span:last-child {
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

.task-list {
  display: grid;

  gap: 9px;

  margin-top: 10px;
}

.task-card {
  padding: 12px;

  border: 1px solid #e4e9ed;
  border-radius: 13px;

  background: white;
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

  gap: 8px;

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

.task-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;

  gap: 6px;

  margin-top: 8px;
}

.edit-task,
.delete-task {
  padding: 8px;

  border: 0;
  border-radius: 8px;

  cursor: pointer;

  font-size: 8px;
  font-weight: 700;
}

.edit-task {
  background: #edf5f9;
  color: #327da5;
}

.delete-task {
  background: #faf1f1;
  color: #a25e5e;
}

.delete-confirm {
  margin-top: 8px;
  padding: 9px;

  border-radius: 9px;

  background: #faf2f2;
}

.delete-confirm p {
  margin: 0 0 8px;

  color: #8e5757;

  font-size: 8px;
}

.delete-confirm div {
  display: grid;
  grid-template-columns: 1fr 1fr;

  gap: 5px;
}

.delete-cancel,
.delete-confirm-button {
  padding: 7px;

  border: 0;
  border-radius: 7px;

  cursor: pointer;

  font-size: 8px;
  font-weight: 700;
}

.delete-cancel {
  background: white;
  color: #687885;
}

.delete-confirm-button {
  background: #a95454;
  color: white;
}

.column-empty {
  display: grid;
  place-items: center;

  min-height: 210px;

  color: #a0aab3;

  font-size: 10px;
}

.match-data-grid {
  display: grid;
  grid-template-columns:
    1.35fr
    0.65fr;

  gap: 14px;
}

.lineup-panel,
.stats-panel {
  padding: 20px;

  border: 1px solid
    rgba(255, 255, 255, 0.8);

  border-radius: 20px;

  background:
    rgba(255, 255, 255, 0.66);
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

.lineup-teams
div:last-child {
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
  grid-template-columns:
    180px
    1fr;

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

  border: 1px solid
    rgba(255, 255, 255, 0.48);
}

.pitch-line {
  position: absolute;

  top: 50%;
  left: 12px;
  right: 12px;

  border-top: 1px solid
    rgba(255, 255, 255, 0.48);
}

.pitch-dot {
  position: absolute;

  width: 14px;
  height: 14px;

  border: 2px solid
    rgba(255, 255, 255, 0.8);

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
  right: 60px;
  bottom: 44px;
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

  border-bottom: 1px solid
    rgba(26, 61, 90, 0.08);
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

.match-not-found {
  padding: 80px 0;
}

@media (max-width: 950px) {
  .match-hero,
  .match-data-grid {
    grid-template-columns: 1fr;
  }

  .planner-grid {
    grid-template-columns:
      repeat(2, 1fr);
  }

  .next-content-card {
    grid-template-columns:
      repeat(2, 1fr);
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

  .planner-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .task-form,
  .planner-grid,
  .next-content-card {
    grid-template-columns: 1fr;
  }

  .form-field-wide {
    grid-column: auto;
  }

  .match-data-grid {
    grid-template-columns: 1fr;
  }

  .lineup-placeholder {
    grid-template-columns: 1fr;
  }

  .pitch {
    max-width: 220px;
  }
}
</style>