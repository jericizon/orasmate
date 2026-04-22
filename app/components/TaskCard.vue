<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex items-center justify-between"
    @click="$emit('select', task.id)"
  >
    <div>
      <h4 class="font-semibold">{{ task.name }}</h4>
      <div class="text-sm text-gray-500 dark:text-gray-400">
        {{ formattedTotalTime }}
      </div>
    </div>
    <div class="flex items-center gap-2">
      <button
        v-if="isRunning"
        class="w-3 h-3 bg-green-500 rounded-full animate-pulse"
        title="Timer running"
      />
      <button
        @click.stop="$emit('delete', task.id)"
        class="text-gray-400 hover:text-red-500 transition-colors"
        title="Delete task"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '~/stores/tasks'

interface Props {
  task: Task
  totalTimeMs: number
  isRunning: boolean
}

const props = defineProps<Props>()

defineEmits<{
  select: [id: string]
  delete: [id: string]
}>()

const formattedTotalTime = computed(() => {
  const totalSeconds = Math.floor(props.totalTimeMs / 1000)
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
