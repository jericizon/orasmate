<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label class="block text-sm font-medium mb-1">Task Name</label>
      <input
        v-model="name"
        type="text"
        required
        placeholder="Enter task name"
        class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
    <button
      type="submit"
      class="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
    >
      Create Task
    </button>
  </form>
</template>

<script setup lang="ts">
const name = ref('')

const emit = defineEmits<{
  submit: [name: string]
}>()

function handleSubmit() {
  if (name.value.trim()) {
    emit('submit', name.value.trim())
    name.value = ''
  }
}
</script>
