export function useBeforeUnload() {
  const timerStore = useTimerStore()

  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    if (timerStore.activeEntry?.isRunning) {
      event.preventDefault()
      event.returnValue = ''
      return 'A timer is currently running. The timer will continue tracking time even if you close the browser. Are you sure you want to leave?'
    }
  }

  onMounted(() => {
    window.addEventListener('beforeunload', handleBeforeUnload)
  })

  onUnmounted(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload)
  })
}
