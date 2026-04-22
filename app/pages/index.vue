<template>
  <div class="min-h-screen p-8">
    <header class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">Orasmate</h1>
      <ThemeToggle />
    </header>

    <div class="grid gap-8 max-w-4xl mx-auto">
      <!-- Today's Stats -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 class="text-xl font-semibold mb-4">Today's Total</h2>
        <div class="text-4xl font-mono font-bold">{{ formattedTodayTotal }}</div>
      </div>

      <!-- Active Timer -->
      <div v-if="timerStore.activeEntry" class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 class="text-xl font-semibold mb-4">Active Timer</h2>
        <div class="flex flex-col items-center gap-4">
          <TimerDisplay :duration-ms="timerStore.getCurrentDuration()" />
          <TimerControls
            :is-running="timerStore.activeEntry.isRunning"
            :is-paused="timerStore.activeEntry.isPaused"
            @start="resumeTimer"
            @pause="timerStore.pauseTimer()"
            @resume="resumeTimer"
            @stop="timerStore.stopTimer()"
          />
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="flex gap-4">
        <NuxtLink
          to="/projects"
          class="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors"
        >
          View Projects
        </NuxtLink>
        <NuxtLink
          to="/projects"
          class="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold py-3 px-6 rounded-lg text-center transition-colors"
        >
          Manage Projects
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const projectStore = useProjectStore()
const taskStore = useTaskStore()
const timerStore = useTimerStore()

const formattedTodayTotal = computed(() => {
  const totalMinutes = Math.floor(timerStore.getTodayTotal() / 60000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
})

function resumeTimer() {
  timerStore.resumeTimer()
}

// Initialize timer on mount - check if there's an active timer
onMounted(() => {
  if (timerStore.activeEntry && timerStore.activeEntry.isRunning) {
    // Timer is already running from previous session
    // It will continue tracking based on startTime timestamp
  }
})

// Add beforeunload warning
useBeforeUnload()
</script>
