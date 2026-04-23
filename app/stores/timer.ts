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
    activeEntries: [] as TimeEntry[],
    entries: [] as TimeEntry[],
    isPageVisible: true
  }),

  persist: true,

  actions: {
    initPageVisibility() {
      if (typeof document !== 'undefined') {
        this.isPageVisible = !document.hidden
        
        const handleVisibilityChange = () => {
          this.isPageVisible = !document.hidden
        }
        
        document.addEventListener('visibilitychange', handleVisibilityChange)
        
        // Return cleanup function
        return () => {
          document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
      }
      return () => {}
    },
    startTimer(taskId: string, pauseOthers: boolean = true) {
      // Pause other running timers if requested
      if (pauseOthers) {
        this.pauseAllTimers()
      }

      // Check if there's already an active entry for this task
      const existingEntry = this.activeEntries.find(e => e.taskId === taskId)
      if (existingEntry) {
        if (existingEntry.isPaused) {
          this.resumeTimer(existingEntry.id)
        }
        return
      }

      this.activeEntries.push({
        id: crypto.randomUUID(),
        taskId,
        startTime: Date.now(),
        endTime: null,
        duration: 0,
        isRunning: true,
        isPaused: false,
        pausedAt: null,
        totalPausedTime: 0
      })
    },

    pauseTimer(entryId?: string) {
      if (entryId) {
        const entry = this.activeEntries.find(e => e.id === entryId)
        if (entry && entry.isRunning) {
          entry.isPaused = true
          entry.isRunning = false
          entry.pausedAt = Date.now()
        }
      } else {
        // Pause all running timers
        this.activeEntries.forEach(entry => {
          if (entry.isRunning) {
            entry.isPaused = true
            entry.isRunning = false
            entry.pausedAt = Date.now()
          }
        })
      }
    },

    resumeTimer(entryId: string) {
      const entry = this.activeEntries.find(e => e.id === entryId)
      if (entry && entry.isPaused) {
        const pauseDuration = entry.pausedAt ? Date.now() - entry.pausedAt : 0
        entry.totalPausedTime += pauseDuration
        entry.isPaused = false
        entry.isRunning = true
        entry.pausedAt = null
      }
    },


    pauseAllTimers() {
      this.activeEntries.forEach(entry => {
        if (entry.isRunning) {
          entry.isPaused = true
          entry.isRunning = false
          entry.pausedAt = Date.now()
        }
      })
    },

    getCurrentDuration(taskId?: string): number {
      const now = Date.now()
      let total = 0

      this.activeEntries.forEach(entry => {
        if (taskId && entry.taskId !== taskId) return

        if (entry.isRunning) {
          total += now - entry.startTime - entry.totalPausedTime
        } else if (entry.isPaused) {
          total += entry.pausedAt! - entry.startTime - entry.totalPausedTime
        }
      })

      return total
    },

    getTotalTimeForTask(taskId: string): number {
      let total = 0

      // Sum completed entries
      total += this.entries
        .filter(e => e.taskId === taskId)
        .reduce((sum, e) => sum + e.duration, 0)

      // Add active timer time if it's for this task
      total += this.getCurrentDuration(taskId)

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
      this.activeEntries.forEach(entry => {
        if (projectTaskIds.has(entry.taskId)) {
          const now = Date.now()
          if (entry.isRunning) {
            total += now - entry.startTime - entry.totalPausedTime
          } else if (entry.isPaused) {
            total += entry.pausedAt! - entry.startTime - entry.totalPausedTime
          }
        }
      })

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
      const now = Date.now()
      this.activeEntries.forEach(entry => {
        if (entry.startTime >= today.getTime()) {
          if (entry.isRunning) {
            total += now - entry.startTime - entry.totalPausedTime
          } else if (entry.isPaused) {
            total += entry.pausedAt! - entry.startTime - entry.totalPausedTime
          }
        }
      })

      return total
    },

    getActiveEntryForTask(taskId: string): TimeEntry | null {
      return this.activeEntries.find(e => e.taskId === taskId) || null
    }
  }
})
