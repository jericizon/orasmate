import { defineStore } from 'pinia'

export interface Project {
  id: string
  name: string
  color: string
  createdAt: number
}

export const useProjectStore = defineStore('projects', {
  state: () => ({
    projects: [] as Project[]
  }),

  persist: true,

  actions: {
    addProject(name: string, color: string) {
      const project: Project = {
        id: crypto.randomUUID(),
        name,
        color,
        createdAt: Date.now()
      }
      this.projects.push(project)
    },

    removeProject(id: string) {
      const index = this.projects.findIndex(p => p.id === id)
      if (index !== -1) {
        this.projects.splice(index, 1)
      }
    },

    getProjectById(id: string): Project | undefined {
      return this.projects.find(p => p.id === id)
    },

    updateProject(id: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>) {
      const project = this.getProjectById(id)
      if (project) {
        Object.assign(project, updates)
      }
    }
  }
})
