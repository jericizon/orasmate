import { defineStore } from 'pinia'

export interface Project {
  id: string
  name: string
  color: string
  createdAt: number
  order: number
}

export const useProjectStore = defineStore('projects', {
  state: () => ({
    projects: [] as Project[]
  }),

  persist: true,

  getters: {
    sortedProjects: (state) => {
      return [...state.projects].sort((a, b) => a.order - b.order)
    }
  },

  actions: {
    addProject(name: string, color: string) {
      const project: Project = {
        id: crypto.randomUUID(),
        name,
        color,
        createdAt: Date.now(),
        order: this.projects.length
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
    },

    migrateProjects() {
      this.projects.forEach((project, index) => {
        if (project.order === undefined) {
          project.order = index
        }
      })
    },

    reorderProject(fromIndex: number, toIndex: number) {
      if (fromIndex === toIndex) return
      if (fromIndex < 0 || fromIndex >= this.projects.length) return
      if (toIndex < 0 || toIndex >= this.projects.length) return

      const [movedProject] = this.projects.splice(fromIndex, 1)
      if (movedProject) {
        this.projects.splice(toIndex, 0, movedProject)
      }

      this.projects.forEach((project, index) => {
        project.order = index
      })
    }
  },

  hydrate(state) {
    state.migrateProjects()
  }
})
