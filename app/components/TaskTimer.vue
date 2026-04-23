<template>
  <div class="flex items-center gap-2">
    <div class="font-mono text-sm tabular-nums w-20 text-right">
      {{ formattedTime }}
    </div>
    <div class="flex items-center gap-1">
      <button
        v-if="!isRunning && !isPaused"
        @click="$emit('start', true)"
        class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
        title="Start timer"
      >
        <Play :size="16" />
      </button>
      <button
        v-if="isRunning"
        @click="$emit('pause')"
        class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
        title="Pause timer"
      >
        <Pause :size="16" />
      </button>
      <button
        v-if="isPaused"
        @click="$emit('resume')"
        class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
        title="Resume timer"
      >
        <Play :size="16" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Play, Pause } from 'lucide-vue-next'

interface Props {
  taskId: string
  durationMs: number
}

const props = defineProps<Props>()

const timerStore = useTimerStore()

defineEmits<{
  start: [pauseOthers: boolean]
  pause: []
  resume: []
}>()

const activeEntry = computed(() => timerStore.getActiveEntryForTask(props.taskId))
const isRunning = computed(() => activeEntry.value?.isRunning || false)
const isPaused = computed(() => activeEntry.value?.isPaused || false)

const currentDurationMs = ref(props.durationMs)

// Update duration every second when timer is running and page is visible
let intervalId: number | null = null

watch(() => isRunning.value, (running) => {
  if (running) {
    intervalId = window.setInterval(() => {
      // Only update UI if page is visible
      if (timerStore.isPageVisible) {
        currentDurationMs.value += 1000
      }
    }, 1000)
  } else {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
    // Reset to the actual duration when not running
    currentDurationMs.value = props.durationMs
  }
})

watch(() => props.durationMs, (newDuration) => {
  if (!isRunning.value) {
    currentDurationMs.value = newDuration
  }
})

// Sync UI with actual duration when page becomes visible
watch(() => timerStore.isPageVisible, (isVisible) => {
  if (isVisible && isRunning.value) {
    currentDurationMs.value = timerStore.getCurrentDuration(props.taskId)
  }
})

onMounted(() => {
  // Initialize page visibility detection
  const cleanup = timerStore.initPageVisibility()
  
  // Start interval if timer is already running (e.g., after page reload)
  if (isRunning.value) {
    intervalId = window.setInterval(() => {
      // Only update UI if page is visible
      if (timerStore.isPageVisible) {
        currentDurationMs.value += 1000
      }
    }, 1000)
  }
  
  // Cleanup on unmount
  onUnmounted(() => {
    cleanup()
  })
})

// onUnmounted moved to onMounted for proper cleanup ordering

const formattedTime = computed(() => {
  const totalSeconds = Math.floor(currentDurationMs.value / 1000)
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
</script>
