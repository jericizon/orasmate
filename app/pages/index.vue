<template>
  <div class="min-h-screen p-8">
    <header class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">Orasmate</h1>
      <div class="flex items-center gap-4">
        <button
          @click="projectModalOpen = true"
          class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          New Project
        </button>
        <ThemeToggle />
      </div>
    </header>

    <div class="grid gap-8 max-w-4xl mx-auto">
      <!-- Today's Stats -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 class="text-xl font-semibold mb-4">Today's Total</h2>
        <div class="text-4xl font-mono font-bold">{{ formattedTodayTotal }}</div>
      </div>

      <!-- Projects List with Tasks -->
      <div>
        <h2 class="text-xl font-semibold mb-4">Projects</h2>
        <div v-if="projectStore.projects.length === 0" class="text-gray-500 dark:text-gray-400 py-8 text-center">
          No projects yet. Create one to get started.
        </div>
        <div v-else class="space-y-6">
          <div
            v-for="project in projectStore.projects"
            :key="project.id"
            class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
          >
            <!-- Project Header -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <div
                  class="w-4 h-4 rounded-full"
                  :style="{ backgroundColor: project.color }"
                />
                <h3
                  v-if="editingProjectId !== project.id"
                  class="font-semibold text-lg cursor-pointer"
                  @dblclick="startEditingProject(project.id, project.name)"
                >{{ project.name }}</h3>
                <input
                  v-else
                  ref="projectEditInput"
                  v-model="editingProjectName"
                  @blur="finishEditingProject(project.id)"
                  @keyup.enter="finishEditingProject(project.id)"
                  @keyup.esc="cancelEditingProject"
                  class="font-semibold text-lg bg-transparent border-b border-blue-500 focus:outline-none"
                />
                <span class="text-sm text-gray-500 dark:text-gray-400">
                  {{ taskStore.getTasksByProject(project.id).length }} task{{ taskStore.getTasksByProject(project.id).length !== 1 ? 's' : '' }}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <button
                  @click="openTaskModal(project.id)"
                  class="text-sm text-blue-500 hover:text-blue-600 transition-colors"
                >
                  + Add Task
                </button>
                <button
                  @click="handleDeleteProject(project.id)"
                  class="text-gray-400 hover:text-red-500 transition-colors"
                  title="Delete project"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244-2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Tasks List -->
            <div v-if="taskStore.getTasksByProject(project.id).length === 0" class="text-gray-500 dark:text-gray-400 py-4 text-center text-sm">
              No tasks yet. Add one above.
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="task in taskStore.getTasksByProject(project.id)"
                :key="task.id"
                class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div class="flex items-center gap-3 flex-1">
                  <div
                    v-if="timerStore.activeEntry?.taskId === task.id && timerStore.activeEntry.isRunning"
                    class="w-3 h-3 bg-green-500 rounded-full animate-pulse"
                    title="Timer running"
                  />
                  <span
                    v-if="editingTaskId !== task.id"
                    class="font-medium cursor-pointer"
                    @dblclick="startEditingTask(task.id, task.name)"
                  >{{ task.name }}</span>
                  <input
                    v-else
                    ref="taskEditInput"
                    v-model="editingTaskName"
                    @blur="finishEditingTask(task.id)"
                    @keyup.enter="finishEditingTask(task.id)"
                    @keyup.esc="cancelEditingTask"
                    class="font-medium bg-transparent border-b border-blue-500 focus:outline-none flex-1"
                  />
                </div>
                <div class="flex items-center gap-4">
                  <TaskTimer
                    :duration-ms="timerStore.getTotalTimeForTask(task.id)"
                    :is-running="timerStore.activeEntry?.taskId === task.id && timerStore.activeEntry.isRunning"
                    :is-paused="timerStore.activeEntry?.taskId === task.id && timerStore.activeEntry.isPaused"
                    @start="timerStore.startTimer(task.id)"
                    @pause="timerStore.pauseTimer()"
                    @resume="timerStore.resumeTimer()"
                    @stop="timerStore.stopTimer()"
                  />
                  <button
                    @click="handleDeleteTask(task.id)"
                    class="text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete task"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244-2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Project Modal -->
    <ProjectModal
      :is-open="projectModalOpen"
      @close="projectModalOpen = false"
      @submit="handleCreateProject"
    />

    <!-- Task Modal -->
    <TaskModal
      :is-open="taskModalOpen"
      @close="taskModalOpen = false"
      @submit="handleCreateTask"
    />
  </div>
</template>

<script setup lang="ts">
const projectStore = useProjectStore()
const taskStore = useTaskStore()
const timerStore = useTimerStore()

const projectModalOpen = ref(false)
const taskModalOpen = ref(false)
const selectedProjectId = ref<string | null>(null)
const editingTaskId = ref<string | null>(null)
const editingTaskName = ref('')
const editingProjectId = ref<string | null>(null)
const editingProjectName = ref('')

const formattedTodayTotal = computed(() => {
  const totalSeconds = Math.floor(timerStore.getTodayTotal() / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  }
  return `${seconds}s`
})

function handleCreateProject(name: string, color: string) {
  projectStore.addProject(name, color)
}

function openTaskModal(projectId: string) {
  selectedProjectId.value = projectId
  taskModalOpen.value = true
}

function handleCreateTask(name: string) {
  if (selectedProjectId.value) {
    taskStore.addTask(selectedProjectId.value, name)
  }
}

function handleDeleteProject(id: string) {
  if (confirm('Delete this project and all its tasks?')) {
    const tasks = taskStore.getTasksByProject(id)
    tasks.forEach(task => {
      taskStore.removeTask(task.id)
      timerStore.entries = timerStore.entries.filter(e => e.taskId !== task.id)
      if (timerStore.activeEntry?.taskId === task.id) {
        timerStore.stopTimer()
      }
    })
    projectStore.removeProject(id)
  }
}

function handleDeleteTask(id: string) {
  if (confirm('Delete this task and all its time entries?')) {
    timerStore.entries = timerStore.entries.filter(e => e.taskId !== id)
    if (timerStore.activeEntry?.taskId === id) {
      timerStore.stopTimer()
    }
    taskStore.removeTask(id)
  }
}

function startEditingTask(taskId: string, taskName: string) {
  editingTaskId.value = taskId
  editingTaskName.value = taskName
  nextTick(() => {
    const input = document.querySelector('input[ref="taskEditInput"]') as HTMLInputElement
    input?.focus()
    input?.select()
  })
}

function finishEditingTask(taskId: string) {
  if (editingTaskName.value.trim()) {
    taskStore.updateTask(taskId, { name: editingTaskName.value.trim() })
  }
  editingTaskId.value = null
  editingTaskName.value = ''
}

function cancelEditingTask() {
  editingTaskId.value = null
  editingTaskName.value = ''
}

function startEditingProject(projectId: string, projectName: string) {
  editingProjectId.value = projectId
  editingProjectName.value = projectName
  nextTick(() => {
    const input = document.querySelector('input[ref="projectEditInput"]') as HTMLInputElement
    input?.focus()
    input?.select()
  })
}

function finishEditingProject(projectId: string) {
  if (editingProjectName.value.trim()) {
    projectStore.updateProject(projectId, { name: editingProjectName.value.trim() })
  }
  editingProjectId.value = null
  editingProjectName.value = ''
}

function cancelEditingProject() {
  editingProjectId.value = null
  editingProjectName.value = ''
}

// Initialize timer on mount
onMounted(() => {
  if (timerStore.activeEntry && timerStore.activeEntry.isRunning) {
    // Timer is already running from previous session
  }
})

// Add beforeunload warning
useBeforeUnload()
</script>
