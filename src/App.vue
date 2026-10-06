<script setup>
import AppHeader from './components/AppHeader.vue'
</script>

<template>
  <div class="app">
    <AppHeader />

    <main class="page-container">
      <RouterView />
    </main>
  </div>
</template>