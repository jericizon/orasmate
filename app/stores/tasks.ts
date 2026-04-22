import { defineStore } from 'pinia'

export interface Task {
  id: string
  projectId: string
  name: string
  createdAt: number
}

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasks: [] as Task[]
  }),

  persist: true,

  actions: {
    addTask(projectId: string, name: string) {
      const task: Task = {
        id: crypto.randomUUID(),
        projectId,
        name,
        createdAt: Date.now()
      }
      this.tasks.push(task)
    },

    removeTask(id: string) {
      const index = this.tasks.findIndex(t => t.id === id)
      if (index !== -1) {
        this.tasks.splice(index, 1)
      }
    },

    getTasksByProject(projectId: string): Task[] {
      return this.tasks.filter(t => t.projectId === projectId)
    },

    getTaskById(id: string): Task | undefined {
      return this.tasks.find(t => t.id === id)
    },

    updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'projectId' | 'createdAt'>>) {
      const task = this.getTaskById(id)
      if (task) {
        Object.assign(task, updates)
      }
    }
  }
})
