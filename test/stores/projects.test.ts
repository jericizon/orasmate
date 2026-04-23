import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useProjectStore } from '~/stores/projects'

describe('Project Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('addProject', () => {
    it('creates a new project with name and color', () => {
      const store = useProjectStore()
      
      store.addProject('My Project', '#3b82f6')
      
      expect(store.projects).toHaveLength(1)
      expect(store.projects[0].name).toBe('My Project')
      expect(store.projects[0].color).toBe('#3b82f6')
      expect(store.projects[0].id).toBeDefined()
      expect(store.projects[0].createdAt).toBeDefined()
    })

    it('generates unique IDs for each project', () => {
      const store = useProjectStore()
      
      store.addProject('Project 1', '#3b82f6')
      store.addProject('Project 2', '#10b981')
      
      expect(store.projects[0].id).not.toBe(store.projects[1].id)
    })
  })

  describe('removeProject', () => {
    it('removes a project by ID', () => {
      const store = useProjectStore()
      
      store.addProject('Project 1', '#3b82f6')
      store.addProject('Project 2', '#10b981')
      const projectId = store.projects[0].id
      
      store.removeProject(projectId)
      
      expect(store.projects).toHaveLength(1)
      expect(store.projects[0].name).toBe('Project 2')
    })

    it('does nothing if project ID does not exist', () => {
      const store = useProjectStore()
      
      store.addProject('Project 1', '#3b82f6')
      const initialLength = store.projects.length
      
      store.removeProject('non-existent-id')
      
      expect(store.projects).toHaveLength(initialLength)
    })
  })

  describe('getProjectById', () => {
    it('returns the project with the given ID', () => {
      const store = useProjectStore()
      
      store.addProject('My Project', '#3b82f6')
      const projectId = store.projects[0].id
      
      const project = store.getProjectById(projectId)
      
      expect(project).toBeDefined()
      expect(project?.name).toBe('My Project')
      expect(project?.color).toBe('#3b82f6')
    })

    it('returns undefined if project ID does not exist', () => {
      const store = useProjectStore()
      
      const project = store.getProjectById('non-existent-id')
      
      expect(project).toBeUndefined()
    })
  })

  describe('updateProject', () => {
    it('updates project name', () => {
      const store = useProjectStore()
      
      store.addProject('Old Name', '#3b82f6')
      const projectId = store.projects[0].id
      
      store.updateProject(projectId, { name: 'New Name' })
      
      expect(store.projects[0].name).toBe('New Name')
    })

    it('updates project color', () => {
      const store = useProjectStore()
      
      store.addProject('My Project', '#3b82f6')
      const projectId = store.projects[0].id
      
      store.updateProject(projectId, { color: '#10b981' })
      
      expect(store.projects[0].color).toBe('#10b981')
    })

    it('updates both name and color', () => {
      const store = useProjectStore()
      
      store.addProject('Old Name', '#3b82f6')
      const projectId = store.projects[0].id
      
      store.updateProject(projectId, { name: 'New Name', color: '#10b981' })
      
      expect(store.projects[0].name).toBe('New Name')
      expect(store.projects[0].color).toBe('#10b981')
    })

    it('does nothing if project ID does not exist', () => {
      const store = useProjectStore()
      
      store.addProject('Project 1', '#3b82f6')
      const originalName = store.projects[0].name
      
      store.updateProject('non-existent-id', { name: 'Changed' })
      
      expect(store.projects[0].name).toBe(originalName)
    })
  })

  describe('Order Field', () => {
    it('should have order field in project interface', () => {
      const store = useProjectStore()
      store.addProject('Test Project', '#FF0000')
      const project = store.projects[0]
      expect(project).toHaveProperty('order')
      expect(typeof project.order).toBe('number')
    })
  })
})
