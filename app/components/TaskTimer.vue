<template>
  <div class="flex items-center gap-2">
    <div class="font-mono text-sm tabular-nums w-20 text-right">
      {{ formattedTime }}
    </div>
    <div class="flex items-center gap-1">
      <button
        v-if="!isRunning && !isPaused"
        @click="$emit('start')"
        class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
        title="Start timer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      </button>
      <button
        v-if="isRunning"
        @click="$emit('pause')"
        class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
        title="Pause timer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
        </svg>
      </button>
      <button
        v-if="isPaused"
        @click="$emit('resume')"
        class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
        title="Resume timer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      </button>
      <button
        v-if="isRunning || isPaused"
        @click="$emit('stop')"
        class="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-600 dark:text-gray-400 transition-colors"
        title="Stop timer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <rect x="6" y="6" width="12" height="12" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  durationMs: number
  isRunning: boolean
  isPaused: boolean
}

const props = defineProps<Props>()

defineEmits<{
  start: []
  pause: []
  resume: []
  stop: []
}>()

const currentDurationMs = ref(props.durationMs)

// Update duration every second when timer is running
let intervalId: number | null = null

watch(() => props.isRunning, (isRunning) => {
  if (isRunning) {
    intervalId = window.setInterval(() => {
      currentDurationMs.value += 1000
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
  if (!props.isRunning) {
    currentDurationMs.value = newDuration
  }
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})

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
