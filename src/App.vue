<script setup lang="ts">
import { computed } from 'vue'
import TodoList from './components/TodoList.vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<template>
  <div class="app">
    <header class="app__header">
      <div class="container">
        <h1 class="app__title">Todo App</h1>
      </div>
    </header>

    <main class="app__main">
      <div class="container">
        <TodoList />
      </div>
    </main>

    <footer class="app__footer">
      <div class="container">
        <p>© {{ currentYear }} Todo App</p>
      </div>
    </footer>
  </div>
</template>

<style lang="scss">
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/main';

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  &__header {
    background-color: #4caf50;
    color: white;
    padding: 1rem 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
  }

  &__main {
    flex: 1;
    padding: 2rem 0;
  }

  &__footer {
    background-color: #333;
    color: white;
    padding: 1rem 0;
    text-align: center;
    font-size: 0.9rem;
  }
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (max-width: 768px) {
    padding: 0 0.8rem;
  }
}
</style>
