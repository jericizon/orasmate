<template>
  <div class="min-h-screen p-8">
    <header class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">Orasmate</h1>
      <div class="flex items-center gap-4">
        <button
          v-if="hasRunningTimer"
          @click="handleGlobalPause"
          class="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          title="Pause all timers"
        >
          Pause All
        </button>
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
                    v-if="timerStore.getActiveEntryForTask(task.id)?.isRunning"
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
                    :task-id="task.id"
                    :duration-ms="timerStore.getTotalTimeForTask(task.id)"
                    @start="handleStartTimer(task.id, $event)"
                    @pause="handlePauseTimer(task.id)"
                    @resume="handleResumeTimer(task.id)"
                    @stop="handleStopTimer(task.id)"
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

    <!-- Confirmation Modal -->
    <ConfirmModal
      :is-open="confirmModalOpen"
      :title="confirmModalConfig.title"
      :message="confirmModalConfig.message"
      :confirm-label="confirmModalConfig.confirmLabel"
      :cancel-label="confirmModalConfig.cancelLabel"
      :variant="confirmModalConfig.variant"
      @confirm="confirmModalConfig.onConfirm"
      @cancel="confirmModalOpen = false"
      @close="confirmModalOpen = false"
    />

    <!-- Timer Switching Modal -->
    <ConfirmModal
      :is-open="timerSwitchModalOpen"
      title="Start Timer"
      message="Another timer is currently running. What would you like to do?"
      confirm-label="Pause & Start New"
      cancel-label="Start Without Pausing"
      variant="warning"
      @confirm="handlePauseAndStartNew"
      @cancel="handleStartWithoutPausing"
      @close="timerSwitchModalOpen = false"
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

// Confirmation modal state
const confirmModalOpen = ref(false)
const confirmModalConfig = ref({
  title: '',
  message: '',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  variant: 'info' as 'danger' | 'info' | 'warning',
  onConfirm: () => {}
})

// Timer switching confirmation modal state
const timerSwitchModalOpen = ref(false)
const pendingTaskId = ref<string | null>(null)

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

const hasRunningTimer = computed(() => {
  return timerStore.activeEntries.some(e => e.isRunning)
})

function handleGlobalPause() {
  timerStore.pauseAllTimers()
}

function handleStartTimer(taskId: string, pauseOthers: boolean) {
  // Check if there are other running timers
  const hasOtherRunningTimers = timerStore.activeEntries.some(
    e => e.taskId !== taskId && e.isRunning
  )

  if (hasOtherRunningTimers && pauseOthers) {
    // Show confirmation modal
    pendingTaskId.value = taskId
    timerSwitchModalOpen.value = true
  } else {
    timerStore.startTimer(taskId, pauseOthers)
  }
}

function handlePauseAndStartNew() {
  if (pendingTaskId.value) {
    timerStore.pauseAllTimers()
    timerStore.startTimer(pendingTaskId.value, false)
    timerSwitchModalOpen.value = false
    pendingTaskId.value = null
  }
}

function handleStartWithoutPausing() {
  if (pendingTaskId.value) {
    timerStore.startTimer(pendingTaskId.value, false)
    timerSwitchModalOpen.value = false
    pendingTaskId.value = null
  }
}

function handlePauseTimer(taskId: string) {
  const entry = timerStore.getActiveEntryForTask(taskId)
  if (entry) {
    timerStore.pauseTimer(entry.id)
  }
}

function handleResumeTimer(taskId: string) {
  const entry = timerStore.getActiveEntryForTask(taskId)
  if (entry) {
    timerStore.resumeTimer(entry.id)
  }
}

function handleStopTimer(taskId: string) {
  const entry = timerStore.getActiveEntryForTask(taskId)
  if (entry) {
    timerStore.stopTimer(entry.id)
  }
}

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
  confirmModalConfig.value = {
    title: 'Delete Project',
    message: 'Delete this project and all its tasks?',
    confirmLabel: 'Delete',
    cancelLabel: 'Cancel',
    variant: 'danger',
    onConfirm: () => {
      const tasks = taskStore.getTasksByProject(id)
      tasks.forEach(task => {
        taskStore.removeTask(task.id)
        timerStore.entries = timerStore.entries.filter(e => e.taskId !== task.id)
        const entry = timerStore.getActiveEntryForTask(task.id)
        if (entry) {
          timerStore.stopTimer(entry.id)
        }
      })
      projectStore.removeProject(id)
      confirmModalOpen.value = false
    }
  }
  confirmModalOpen.value = true
}

function handleDeleteTask(id: string) {
  confirmModalConfig.value = {
    title: 'Delete Task',
    message: 'Delete this task and all its time entries?',
    confirmLabel: 'Delete',
    cancelLabel: 'Cancel',
    variant: 'danger',
    onConfirm: () => {
      timerStore.entries = timerStore.entries.filter(e => e.taskId !== id)
      const entry = timerStore.getActiveEntryForTask(id)
      if (entry) {
        timerStore.stopTimer(entry.id)
      }
      taskStore.removeTask(id)
      confirmModalOpen.value = false
    }
  }
  confirmModalOpen.value = true
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
