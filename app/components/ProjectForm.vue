<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label class="block text-sm font-medium mb-1">Project Name</label>
      <input
        v-model="name"
        type="text"
        required
        placeholder="Enter project name"
        class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
    <div>
      <label class="block text-sm font-medium mb-1">Color</label>
      <div class="flex gap-2">
        <button
          v-for="color in colors"
          :key="color"
          type="button"
          @click="selectedColor = color"
          class="w-8 h-8 rounded-full transition-transform hover:scale-110"
          :class="{ 'ring-2 ring-offset-2 ring-offset-gray-900 ring-blue-500': selectedColor === color }"
          :style="{ backgroundColor: color }"
        />
      </div>
    </div>
    <button
      type="submit"
      class="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
    >
      Create Project
    </button>
  </form>
</template>

<script setup lang="ts">
const name = ref('')
const selectedColor = ref('#3b82f6')

const colors = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#84cc16'  // lime
]

const emit = defineEmits<{
  submit: [name: string, color: string]
}>()

function handleSubmit() {
  if (name.value.trim()) {
    emit('submit', name.value.trim(), selectedColor.value)
    name.value = ''
  }
}
</script>
