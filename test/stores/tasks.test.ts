import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useTaskStore } from '~/stores/tasks'
import { useProjectStore } from '~/stores/projects'

describe('Task Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('addTask', () => {
    it('creates a new task under a project', () => {
      const projectStore = useProjectStore()
      const taskStore = useTaskStore()
      
      projectStore.addProject('My Project', '#3b82f6')
      const projectId = projectStore.projects[0].id
      
      taskStore.addTask(projectId, 'My Task')
      
      expect(taskStore.tasks).toHaveLength(1)
      expect(taskStore.tasks[0].projectId).toBe(projectId)
      expect(taskStore.tasks[0].name).toBe('My Task')
      expect(taskStore.tasks[0].id).toBeDefined()
      expect(taskStore.tasks[0].createdAt).toBeDefined()
    })

    it('generates unique IDs for each task', () => {
      const projectStore = useProjectStore()
      const taskStore = useTaskStore()
      
      projectStore.addProject('My Project', '#3b82f6')
      const projectId = projectStore.projects[0].id
      
      taskStore.addTask(projectId, 'Task 1')
      taskStore.addTask(projectId, 'Task 2')
      
      expect(taskStore.tasks[0].id).not.toBe(taskStore.tasks[1].id)
    })
  })

  describe('removeTask', () => {
    it('removes a task by ID', () => {
      const projectStore = useProjectStore()
      const taskStore = useTaskStore()
      
      projectStore.addProject('My Project', '#3b82f6')
      const projectId = projectStore.projects[0].id
      
      taskStore.addTask(projectId, 'Task 1')
      taskStore.addTask(projectId, 'Task 2')
      const taskId = taskStore.tasks[0].id
      
      taskStore.removeTask(taskId)
      
      expect(taskStore.tasks).toHaveLength(1)
      expect(taskStore.tasks[0].name).toBe('Task 2')
    })

    it('does nothing if task ID does not exist', () => {
      const projectStore = useProjectStore()
      const taskStore = useTaskStore()
      
      projectStore.addProject('My Project', '#3b82f6')
      const projectId = projectStore.projects[0].id
      
      taskStore.addTask(projectId, 'Task 1')
      const initialLength = taskStore.tasks.length
      
      taskStore.removeTask('non-existent-id')
      
      expect(taskStore.tasks).toHaveLength(initialLength)
    })
  })

  describe('getTasksByProject', () => {
    it('returns all tasks for a project', () => {
      const projectStore = useProjectStore()
      const taskStore = useTaskStore()
      
      projectStore.addProject('Project 1', '#3b82f6')
      projectStore.addProject('Project 2', '#10b981')
      
      const projectId1 = projectStore.projects[0].id
      const projectId2 = projectStore.projects[1].id
      
      taskStore.addTask(projectId1, 'Task 1')
      taskStore.addTask(projectId1, 'Task 2')
      taskStore.addTask(projectId2, 'Task 3')
      
      const tasks1 = taskStore.getTasksByProject(projectId1)
      const tasks2 = taskStore.getTasksByProject(projectId2)
      
      expect(tasks1).toHaveLength(2)
      expect(tasks2).toHaveLength(1)
      expect(tasks1.every(t => t.projectId === projectId1)).toBe(true)
    })

    it('returns empty array if project has no tasks', () => {
      const projectStore = useProjectStore()
      const taskStore = useTaskStore()
      
      projectStore.addProject('My Project', '#3b82f6')
      const projectId = projectStore.projects[0].id
      
      const tasks = taskStore.getTasksByProject(projectId)
      
      expect(tasks).toHaveLength(0)
    })
  })

  describe('getTaskById', () => {
    it('returns the task with the given ID', () => {
      const projectStore = useProjectStore()
      const taskStore = useTaskStore()
      
      projectStore.addProject('My Project', '#3b82f6')
      const projectId = projectStore.projects[0].id
      
      taskStore.addTask(projectId, 'My Task')
      const taskId = taskStore.tasks[0].id
      
      const task = taskStore.getTaskById(taskId)
      
      expect(task).toBeDefined()
      expect(task?.name).toBe('My Task')
      expect(task?.projectId).toBe(projectId)
    })

    it('returns undefined if task ID does not exist', () => {
      const taskStore = useTaskStore()
      
      const task = taskStore.getTaskById('non-existent-id')
      
      expect(task).toBeUndefined()
    })
  })

  describe('updateTask', () => {
    it('updates task name', () => {
      const projectStore = useProjectStore()
      const taskStore = useTaskStore()
      
      projectStore.addProject('My Project', '#3b82f6')
      const projectId = projectStore.projects[0].id
      
      taskStore.addTask(projectId, 'Old Name')
      const taskId = taskStore.tasks[0].id
      
      taskStore.updateTask(taskId, { name: 'New Name' })
      
      expect(taskStore.tasks[0].name).toBe('New Name')
    })

    it('does nothing if task ID does not exist', () => {
      const projectStore = useProjectStore()
      const taskStore = useTaskStore()
      
      projectStore.addProject('My Project', '#3b82f6')
      const projectId = projectStore.projects[0].id
      
      taskStore.addTask(projectId, 'Task 1')
      const originalName = taskStore.tasks[0].name
      
      taskStore.updateTask('non-existent-id', { name: 'Changed' })
      
      expect(taskStore.tasks[0].name).toBe(originalName)
    })
  })
})
