<template>
  <div class="font-mono text-6xl font-bold tabular-nums">
    {{ formattedTime }}
  </div>
</template>

<script setup lang="ts">
interface Props {
  durationMs: number
}

const props = defineProps<Props>()

const formattedTime = computed(() => {
  const totalMinutes = Math.floor(props.durationMs / 60000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${hours}:${minutes.toString().padStart(2, '0')}`
})
</script>
