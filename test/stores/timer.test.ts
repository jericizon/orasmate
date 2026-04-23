import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useTimerStore } from '~/stores/timer'
import { useTaskStore } from '~/stores/tasks'
import { useProjectStore } from '~/stores/projects'

describe('Timer Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('startTimer', () => {
    it('starts a new timer for a task', () => {
      const projectStore = useProjectStore()
      const taskStore = useTaskStore()
      const timerStore = useTimerStore()
      
      projectStore.addProject('My Project', '#3b82f6')
      const projectId = projectStore.projects[0].id
      taskStore.addTask(projectId, 'My Task')
      const taskId = taskStore.tasks[0].id
      
      timerStore.startTimer(taskId)
      
      expect(timerStore.activeEntry).toBeDefined()
      expect(timerStore.activeEntry?.taskId).toBe(taskId)
      expect(timerStore.activeEntry?.isRunning).toBe(true)
      expect(timerStore.activeEntry?.isPaused).toBe(false)
      expect(timerStore.activeEntry?.startTime).toBeDefined()
      expect(timerStore.activeEntry?.endTime).toBe(null)
    })

    it('stops any active timer before starting a new one', () => {
      const projectStore = useProjectStore()
      const taskStore = useTaskStore()
      const timerStore = useTimerStore()
      
      projectStore.addProject('My Project', '#3b82f6')
      const projectId = projectStore.projects[0].id
      taskStore.addTask(projectId, 'Task 1')
      taskStore.addTask(projectId, 'Task 2')
      const taskId1 = taskStore.tasks[0].id
      const taskId2 = taskStore.tasks[1].id
      
      timerStore.startTimer(taskId1)
      vi.advanceTimersByTime(5000)
      timerStore.pauseTimer()
      timerStore.startTimer(taskId2)
      
      expect(timerStore.entries).toHaveLength(1)
      expect(timerStore.entries[0].taskId).toBe(taskId1)
      expect(timerStore.entries[0].isPaused).toBe(true)
      expect(timerStore.activeEntry?.taskId).toBe(taskId2)
    })

    it('pauses any running timer before starting a new one', () => {
      const projectStore = useProjectStore()
      const taskStore = useTaskStore()
      const timerStore = useTimerStore()
      
      projectStore.addProject('My Project', '#3b82f6')
      const projectId = projectStore.projects[0].id
      taskStore.addTask(projectId, 'Task 1')
      taskStore.addTask(projectId, 'Task 2')
      const taskId1 = taskStore.tasks[0].id
      const taskId2 = taskStore.tasks[1].id
      
      timerStore.startTimer(taskId1)
      timerStore.pauseTimer()
      timerStore.startTimer(taskId2)
      
      expect(timerStore.entries).toHaveLength(1)
      expect(timerStore.entries[0].isPaused).toBe(true)
      expect(timerStore.activeEntry?.taskId).toBe(taskId2)
    })
  })

  describe('pauseTimer', () => {
    it('pauses the active timer', () => {
      const projectStore = useProjectStore()
      const taskStore = useTaskStore()
      const timerStore = useTimerStore()
      
      projectStore.addProject('My Project', '#3b82f6')
      const projectId = projectStore.projects[0].id
      taskStore.addTask(projectId, 'My Task')
      const taskId = taskStore.tasks[0].id
      
      timerStore.startTimer(taskId)
      vi.advanceTimersByTime(5000)
      timerStore.pauseTimer()
      
      expect(timerStore.activeEntry?.isPaused).toBe(true)
      expect(timerStore.activeEntry?.pausedAt).toBeDefined()
    })

    it('does nothing if no timer is running', () => {
      const timerStore = useTimerStore()
      
      expect(() => timerStore.pauseTimer()).not.toThrow()
      expect(timerStore.activeEntry).toBeNull()
    })
  })

  describe('resumeTimer', () => {
    it('resumes a paused timer', () => {
      const projectStore = useProjectStore()
      const taskStore = useTaskStore()
      const timerStore = useTimerStore()
      
      projectStore.addProject('My Project', '#3b82f6')
      const projectId = projectStore.projects[0].id
      taskStore.addTask(projectId, 'My Task')
      const taskId = taskStore.tasks[0].id
      
      timerStore.startTimer(taskId)
      vi.advanceTimersByTime(5000)
      timerStore.pauseTimer()
      vi.advanceTimersByTime(3000)
      timerStore.resumeTimer()
      
      expect(timerStore.activeEntry?.isPaused).toBe(false)
      expect(timerStore.activeEntry?.pausedAt).toBeNull()
      expect(timerStore.activeEntry?.totalPausedTime).toBe(3000)
    })

    it('does nothing if no timer is paused', () => {
      const timerStore = useTimerStore()
      
      expect(() => timerStore.resumeTimer()).not.toThrow()
      expect(timerStore.activeEntry).toBeNull()
    })
  })


  describe('getCurrentDuration', () => {
    it('returns current duration for running timer', () => {
      const projectStore = useProjectStore()
      const taskStore = useTaskStore()
      const timerStore = useTimerStore()
      
      projectStore.addProject('My Project', '#3b82f6')
      const projectId = projectStore.projects[0].id
      taskStore.addTask(projectId, 'My Task')
      const taskId = taskStore.tasks[0].id
      
      timerStore.startTimer(taskId)
      vi.advanceTimersByTime(5000)
      
      const duration = timerStore.getCurrentDuration()
      expect(duration).toBe(5000)
    })

    it('returns 0 if no timer is active', () => {
      const timerStore = useTimerStore()
      
      expect(timerStore.getCurrentDuration()).toBe(0)
    })

    it('accounts for pause time in paused timer', () => {
      const projectStore = useProjectStore()
      const taskStore = useTaskStore()
      const timerStore = useTimerStore()
      
      projectStore.addProject('My Project', '#3b82f6')
      const projectId = projectStore.projects[0].id
      taskStore.addTask(projectId, 'My Task')
      const taskId = taskStore.tasks[0].id
      
      timerStore.startTimer(taskId)
      vi.advanceTimersByTime(5000)
      timerStore.pauseTimer()
      vi.advanceTimersByTime(2000)
      
      const duration = timerStore.getCurrentDuration()
      expect(duration).toBe(5000)
    })
  })

  describe('getTotalTimeForTask', () => {
    it('returns total time for a task from completed entries', () => {
      const projectStore = useProjectStore()
      const taskStore = useTaskStore()
      const timerStore = useTimerStore()
      
      projectStore.addProject('My Project', '#3b82f6')
      const projectId = projectStore.projects[0].id
      taskStore.addTask(projectId, 'Task 1')
      taskStore.addTask(projectId, 'Task 2')
      const taskId1 = taskStore.tasks[0].id
      const taskId2 = taskStore.tasks[1].id
      
      timerStore.startTimer(taskId1)
      vi.advanceTimersByTime(5000)
      timerStore.pauseTimer()
      
      timerStore.startTimer(taskId1)
      vi.advanceTimersByTime(3000)
      timerStore.pauseTimer()
      
      timerStore.startTimer(taskId2)
      vi.advanceTimersByTime(2000)
      timerStore.pauseTimer()
      
      expect(timerStore.getTotalTimeForTask(taskId1)).toBe(8000)
      expect(timerStore.getTotalTimeForTask(taskId2)).toBe(2000)
    })

    it('includes active timer time in total', () => {
      const projectStore = useProjectStore()
      const taskStore = useTaskStore()
      const timerStore = useTimerStore()
      
      projectStore.addProject('My Project', '#3b82f6')
      const projectId = projectStore.projects[0].id
      taskStore.addTask(projectId, 'My Task')
      const taskId = taskStore.tasks[0].id
      
      timerStore.startTimer(taskId)
      vi.advanceTimersByTime(5000)
      
      expect(timerStore.getTotalTimeForTask(taskId)).toBe(5000)
    })
  })

  describe('getTotalTimeForProject', () => {
    it('returns total time for all tasks in a project', () => {
      const projectStore = useProjectStore()
      const taskStore = useTaskStore()
      const timerStore = useTimerStore()
      
      projectStore.addProject('Project 1', '#3b82f6')
      projectStore.addProject('Project 2', '#10b981')
      const projectId1 = projectStore.projects[0].id
      const projectId2 = projectStore.projects[1].id
      
      taskStore.addTask(projectId1, 'Task 1')
      taskStore.addTask(projectId1, 'Task 2')
      taskStore.addTask(projectId2, 'Task 3')
      const taskId1 = taskStore.tasks[0].id
      const taskId2 = taskStore.tasks[1].id
      const taskId3 = taskStore.tasks[2].id
      
      timerStore.startTimer(taskId1)
      vi.advanceTimersByTime(5000)
      timerStore.pauseTimer()
      
      timerStore.startTimer(taskId2)
      vi.advanceTimersByTime(3000)
      timerStore.pauseTimer()
      
      timerStore.startTimer(taskId3)
      vi.advanceTimersByTime(2000)
      timerStore.pauseTimer()
      
      expect(timerStore.getTotalTimeForProject(projectId1)).toBe(8000)
      expect(timerStore.getTotalTimeForProject(projectId2)).toBe(2000)
    })
  })

  describe('getTodayTotal', () => {
    it('returns total time tracked today', () => {
      const projectStore = useProjectStore()
      const taskStore = useTaskStore()
      const timerStore = useTimerStore()
      
      projectStore.addProject('My Project', '#3b82f6')
      const projectId = projectStore.projects[0].id
      taskStore.addTask(projectId, 'My Task')
      const taskId = taskStore.tasks[0].id
      
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      timerStore.startTimer(taskId)
      vi.advanceTimersByTime(5000)
      timerStore.pauseTimer()
      
      expect(timerStore.getTodayTotal()).toBe(5000)
    })
  })
})
