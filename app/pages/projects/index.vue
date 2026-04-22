<template>
  <div class="min-h-screen p-8">
    <header class="flex justify-between items-center mb-8">
      <div class="flex items-center gap-4">
        <NuxtLink to="/" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </NuxtLink>
        <h1 class="text-3xl font-bold">Projects</h1>
      </div>
      <ThemeToggle />
    </header>

    <div class="grid gap-8 max-w-4xl mx-auto">
      <!-- Create Project Form -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 class="text-xl font-semibold mb-4">Create New Project</h2>
        <ProjectForm @submit="handleCreateProject" />
      </div>

      <!-- Projects List -->
      <div>
        <h2 class="text-xl font-semibold mb-4">Your Projects</h2>
        <div v-if="projectStore.projects.length === 0" class="text-gray-500 dark:text-gray-400 py-8 text-center">
          No projects yet. Create one above to get started.
        </div>
        <div v-else class="grid gap-4">
          <ProjectCard
            v-for="project in projectStore.projects"
            :key="project.id"
            :project="project"
            :task-count="taskStore.getTasksByProject(project.id).length"
            :total-time-ms="getProjectTotalTime(project.id)"
            @select="navigateToProject(project.id)"
            @delete="handleDeleteProject(project.id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const projectStore = useProjectStore()
const taskStore = useTaskStore()
const timerStore = useTimerStore()

function handleCreateProject(name: string, color: string) {
  projectStore.addProject(name, color)
}

function handleDeleteProject(id: string) {
  if (confirm('Delete this project and all its tasks?')) {
    // Delete all tasks for this project
    const tasks = taskStore.getTasksByProject(id)
    tasks.forEach(task => {
      taskStore.removeTask(task.id)
      // Remove timer entries for this task
      timerStore.entries = timerStore.entries.filter(e => e.taskId !== task.id)
      if (timerStore.activeEntry?.taskId === task.id) {
        timerStore.stopTimer()
      }
    })
    projectStore.removeProject(id)
  }
}

function getProjectTotalTime(projectId: string): number {
  const taskIds = taskStore.getTasksByProject(projectId).map(t => t.id)
  return timerStore.getTotalTimeForProject(projectId, taskIds)
}

function navigateToProject(id: string) {
  navigateTo(`/projects/${id}`)
}

// Add beforeunload warning
useBeforeUnload()
</script>
