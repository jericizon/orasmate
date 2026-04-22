<template>
  <div class="min-h-screen p-8">
    <header class="flex justify-between items-center mb-8">
      <div class="flex items-center gap-4">
        <NuxtLink to="/projects" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </NuxtLink>
        <h1 class="text-3xl font-bold">{{ project?.name }}</h1>
      </div>
      <ThemeToggle />
    </header>

    <div v-if="project" class="grid gap-8 max-w-4xl mx-auto">
      <!-- Create Task Form -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 class="text-xl font-semibold mb-4">Create New Task</h2>
        <TaskForm @submit="handleCreateTask" />
      </div>

      <!-- Tasks List -->
      <div>
        <h2 class="text-xl font-semibold mb-4">Tasks</h2>
        <div v-if="tasks.length === 0" class="text-gray-500 dark:text-gray-400 py-8 text-center">
          No tasks yet. Create one above to get started.
        </div>
        <div v-else class="grid gap-4">
          <TaskCard
            v-for="task in tasks"
            :key="task.id"
            :task="task"
            :total-time-ms="timerStore.getTotalTimeForTask(task.id)"
            :is-running="timerStore.activeEntry?.taskId === task.id"
            @select="handleSelectTask(task.id)"
            @delete="handleDeleteTask(task.id)"
          />
        </div>
      </div>

      <!-- Active Timer for Selected Task -->
      <div v-if="selectedTask" class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 class="text-xl font-semibold mb-4">Timer: {{ selectedTask.name }}</h2>
        <div class="flex flex-col items-center gap-4">
          <TimerDisplay :duration-ms="timerStore.getCurrentDuration()" />
          <TimerControls
            :is-running="timerStore.activeEntry?.isRunning || false"
            :is-paused="timerStore.activeEntry?.isPaused || false"
            @start="timerStore.startTimer(selectedTask.id)"
            @pause="timerStore.pauseTimer()"
            @resume="timerStore.resumeTimer()"
            @stop="timerStore.stopTimer()"
          />
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12">
      <p class="text-gray-500 dark:text-gray-400">Project not found</p>
      <NuxtLink to="/projects" class="text-blue-500 hover:underline">
        Back to Projects
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const projectStore = useProjectStore()
const taskStore = useTaskStore()
const timerStore = useTimerStore()

const selectedTaskId = ref<string | null>(null)

const project = computed(() => {
  const id = route.params.id as string
  return projectStore.getProjectById(id)
})

const tasks = computed(() => {
  if (!project.value) return []
  return taskStore.getTasksByProject(project.value.id)
})

const selectedTask = computed(() => {
  if (!selectedTaskId.value) return null
  return taskStore.getTaskById(selectedTaskId.value)
})

function handleCreateTask(name: string) {
  if (project.value) {
    const taskId = crypto.randomUUID()
    taskStore.addTask(project.value.id, name)
    // Auto-select the new task
    selectedTaskId.value = taskId
  }
}

function handleDeleteTask(id: string) {
  if (confirm('Delete this task and all its time entries?')) {
    // Remove timer entries for this task
    timerStore.entries = timerStore.entries.filter(e => e.taskId !== id)
    if (timerStore.activeEntry?.taskId === id) {
      timerStore.stopTimer()
    }
    if (selectedTaskId.value === id) {
      selectedTaskId.value = null
    }
    taskStore.removeTask(id)
  }
}

function handleSelectTask(id: string) {
  selectedTaskId.value = id
}

// Initialize timer on mount
onMounted(() => {
  if (timerStore.activeEntry && timerStore.activeEntry.isRunning) {
    // Timer is already running from previous session
    const task = taskStore.getTaskById(timerStore.activeEntry.taskId)
    if (task && task.projectId === project.value?.id) {
      selectedTaskId.value = task.id
    }
  }
})

// Add beforeunload warning
useBeforeUnload()
</script>
