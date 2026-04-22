import { defineStore } from 'pinia'

export interface TimeEntry {
  id: string
  taskId: string
  startTime: number
  endTime: number | null
  duration: number
  isRunning: boolean
  isPaused: boolean
  pausedAt: number | null
  totalPausedTime: number
}

export const useTimerStore = defineStore('timer', {
  state: () => ({
    activeEntry: null as TimeEntry | null,
    entries: [] as TimeEntry[]
  }),

  persist: true,

  actions: {
    startTimer(taskId: string) {
      // Stop or pause any active timer first
      if (this.activeEntry) {
        if (this.activeEntry.isRunning) {
          this.stopTimer()
        } else {
          // It's paused, finalize it
          this.activeEntry.endTime = Date.now()
          this.activeEntry.isRunning = false
          this.entries.push({ ...this.activeEntry })
        }
      }

      this.activeEntry = {
        id: crypto.randomUUID(),
        taskId,
        startTime: Date.now(),
        endTime: null,
        duration: 0,
        isRunning: true,
        isPaused: false,
        pausedAt: null,
        totalPausedTime: 0
      }
    },

    pauseTimer() {
      if (this.activeEntry && this.activeEntry.isRunning) {
        this.activeEntry.isPaused = true
        this.activeEntry.isRunning = false
        this.activeEntry.pausedAt = Date.now()
      }
    },

    resumeTimer() {
      if (this.activeEntry && this.activeEntry.isPaused) {
        const pauseDuration = this.activeEntry.pausedAt ? Date.now() - this.activeEntry.pausedAt : 0
        this.activeEntry.totalPausedTime += pauseDuration
        this.activeEntry.isPaused = false
        this.activeEntry.isRunning = true
        this.activeEntry.pausedAt = null
      }
    },

    stopTimer() {
      if (!this.activeEntry) return

      const now = Date.now()
      this.activeEntry.endTime = now
      this.activeEntry.duration = now - this.activeEntry.startTime - this.activeEntry.totalPausedTime
      this.activeEntry.isRunning = false
      this.activeEntry.isPaused = false

      this.entries.push({ ...this.activeEntry })
      this.activeEntry = null
    },

    getCurrentDuration(): number {
      if (!this.activeEntry) return 0

      const now = Date.now()
      if (this.activeEntry.isRunning) {
        return now - this.activeEntry.startTime - this.activeEntry.totalPausedTime
      } else if (this.activeEntry.isPaused) {
        return this.activeEntry.pausedAt! - this.activeEntry.startTime - this.activeEntry.totalPausedTime
      }
      return 0
    },

    getTotalTimeForTask(taskId: string): number {
      let total = 0
      
      // Sum completed entries
      total += this.entries
        .filter(e => e.taskId === taskId)
        .reduce((sum, e) => sum + e.duration, 0)
      
      // Add active timer time if it's for this task
      if (this.activeEntry && this.activeEntry.taskId === taskId) {
        total += this.getCurrentDuration()
      }
      
      return total
    },

    getTotalTimeForProject(projectId: string, taskIds: string[]): number {
      let total = 0
      const projectTaskIds = new Set(taskIds)
      
      // Sum completed entries for project tasks
      total += this.entries
        .filter(e => projectTaskIds.has(e.taskId))
        .reduce((sum, e) => sum + e.duration, 0)
      
      // Add active timer time if it's for a project task
      if (this.activeEntry && projectTaskIds.has(this.activeEntry.taskId)) {
        total += this.getCurrentDuration()
      }
      
      return total
    },

    getTodayTotal(): number {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      let total = 0
      
      // Sum completed entries from today
      total += this.entries
        .filter(e => e.startTime >= today.getTime())
        .reduce((sum, e) => sum + e.duration, 0)
      
      // Add active timer time if started today
      if (this.activeEntry && this.activeEntry.startTime >= today.getTime()) {
        total += this.getCurrentDuration()
      }
      
      return total
    }
  }
})
