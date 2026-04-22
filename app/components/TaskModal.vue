<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/50" @click="$emit('close')" />
    <div class="relative bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg max-w-md w-full">
      <h2 class="text-xl font-semibold mb-4">Create New Task</h2>
      <TaskForm @submit="handleSubmit" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  submit: [name: string]
}>()

function handleSubmit(name: string) {
  emit('submit', name)
  emit('close')
}
</script>
