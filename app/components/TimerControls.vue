<template>
  <div class="flex gap-2">
    <button
      v-if="!isRunning && !isPaused"
      @click="$emit('start')"
      class="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
    >
      Start
    </button>
    <button
      v-if="isRunning"
      @click="$emit('pause')"
      class="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition-colors"
    >
      Pause
    </button>
    <button
      v-if="isPaused"
      @click="$emit('resume')"
      class="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
    >
      Resume
    </button>
    <button
      v-if="isRunning || isPaused"
      @click="$emit('stop')"
      class="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
    >
      Stop
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isRunning: boolean
  isPaused: boolean
}

defineProps<Props>()

defineEmits<{
  start: []
  pause: []
  resume: []
  stop: []
}>()
</script>
