<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/50" @click="$emit('close')" />
    <div class="relative bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg max-w-md w-full">
      <h2 class="text-xl font-semibold mb-4">{{ title }}</h2>
      <p class="text-gray-600 dark:text-gray-300 mb-6">{{ message }}</p>
      <div class="flex justify-end gap-3">
        <button
          @click="$emit('cancel')"
          class="px-4 py-2 rounded-lg transition-colors"
          :class="cancelButtonClass"
        >
          {{ cancelLabel }}
        </button>
        <button
          @click="$emit('confirm')"
          class="px-4 py-2 rounded-lg transition-colors"
          :class="confirmButtonClass"
        >
          {{ confirmLabel }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'info' | 'warning'
}

const props = withDefaults(defineProps<Props>(), {
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  variant: 'info'
})

const emit = defineEmits<{
  confirm: []
  cancel: []
  close: []
}>()

const confirmButtonClass = computed(() => {
  switch (props.variant) {
    case 'danger':
      return 'bg-red-500 hover:bg-red-600 text-white'
    case 'warning':
      return 'bg-yellow-500 hover:bg-yellow-600 text-white'
    case 'info':
    default:
      return 'bg-blue-500 hover:bg-blue-600 text-white'
  }
})

const cancelButtonClass = computed(() => {
  return 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
})
</script>
