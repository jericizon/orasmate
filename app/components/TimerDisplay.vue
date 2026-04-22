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
  const totalSeconds = Math.floor(props.durationMs / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})
</script>
