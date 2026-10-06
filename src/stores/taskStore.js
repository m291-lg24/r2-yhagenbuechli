import { defineStore } from 'pinia'

const STORAGE_KEY = 'matchday-content-tasks'

export const useTaskStore = defineStore('taskStore', {
  state: () => ({
    tasks: [],
  }),

  getters: {
    tasksForMatch: (state) => {
      return (matchId) => {
        return state.tasks.filter(
          (task) => String(task.matchId) === String(matchId),
        )
      }
    },

    getTasksByMatch: (state) => {
      return (matchId) => {
        return state.tasks.filter(
          (task) => String(task.matchId) === String(matchId),
        )
      }
    },
  },

  actions: {
    loadTasks() {
      const storedTasks = localStorage.getItem(STORAGE_KEY)

      if (!storedTasks) {
        this.tasks = []
        return
      }

      try {
        const parsedTasks = JSON.parse(storedTasks)

        this.tasks = Array.isArray(parsedTasks)
          ? parsedTasks
          : []
      } catch (error) {
        console.error(
          'Tasks konnten nicht geladen werden:',
          error,
        )

        this.tasks = []
      }
    },

    saveTasks() {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(this.tasks),
      )
    },

    addTask(task) {
      const id =
        typeof crypto !== 'undefined' &&
        typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`

      this.tasks.push({
        ...task,
        id,
      })

      this.saveTasks()
    },

    updateTaskStatus(taskId, newStatus) {
      const task = this.tasks.find(
        (task) => task.id === taskId,
      )

      if (!task) {
        return
      }

      task.status = newStatus
      this.saveTasks()
    },

    deleteTask(taskId) {
      this.tasks = this.tasks.filter(
        (task) => task.id !== taskId,
      )

      this.saveTasks()
    },
  },
})