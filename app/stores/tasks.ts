import { defineStore } from 'pinia'

export interface Task {
  id: string
  projectId: string
  name: string
  createdAt: number
  order: number
}

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasks: [] as Task[]
  }),

  persist: true,

  getters: {
    getTasksByProject: (state) => {
      return (projectId: string) => {
        return state.tasks
          .filter(t => t.projectId === projectId)
          .sort((a, b) => a.order - b.order)
      }
    }
  },

  actions: {
    addTask(projectId: string, name: string) {
      const projectTasks = this.tasks.filter(t => t.projectId === projectId)
      const task: Task = {
        id: crypto.randomUUID(),
        projectId,
        name,
        createdAt: Date.now(),
        order: projectTasks.length
      }
      this.tasks.push(task)
    },

    removeTask(id: string) {
      const index = this.tasks.findIndex(t => t.id === id)
      if (index !== -1) {
        this.tasks.splice(index, 1)
      }
    },

    getTaskById(id: string): Task | undefined {
      return this.tasks.find(t => t.id === id)
    },

    updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'projectId' | 'createdAt'>>) {
      const task = this.getTaskById(id)
      if (task) {
        Object.assign(task, updates)
      }
    },

    migrateTasks() {
      const projectTasksMap = new Map<string, Task[]>()

      this.tasks.forEach(task => {
        if (!projectTasksMap.has(task.projectId)) {
          projectTasksMap.set(task.projectId, [])
        }
        projectTasksMap.get(task.projectId)!.push(task)
      })

      projectTasksMap.forEach(tasks => {
        tasks.sort((a, b) => a.createdAt - b.createdAt)
        tasks.forEach((task, index) => {
          if (task.order === undefined) {
            task.order = index
          }
        })
      })
    },

    reorderTask(projectId: string, fromIndex: number, toIndex: number) {
      const projectTasks = this.getTasksByProject(projectId)

      if (fromIndex === toIndex) return
      if (fromIndex < 0 || fromIndex >= projectTasks.length) return
      if (toIndex < 0 || toIndex >= projectTasks.length) return

      const [movedTask] = projectTasks.splice(fromIndex, 1)
      if (movedTask) {
        projectTasks.splice(toIndex, 0, movedTask)
      }

      projectTasks.forEach((task, index) => {
        task.order = index
      })
    }
  },

  hydrate(state) {
    state.migrateTasks()
  }
})
