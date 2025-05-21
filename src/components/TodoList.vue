<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { Todo } from '@/types/todo'
import { todoService } from '@/services/todoService'
import TodoItem from './TodoItem.vue'
import TodoForm from './TodoForm.vue'
import TodoFilter from './TodoFilter.vue'

const todos = ref<Todo[]>([])
const loading = ref(true)
const filterStatus = ref<'all' | 'active' | 'completed'>('all')
const currentPage = ref(1)
const itemsPerPage = 10

watch(filterStatus, () => {
  currentPage.value = 1
})

const filteredTodos = computed(() => {
  let filtered = todos.value
  switch (filterStatus.value) {
    case 'active':
      filtered = filtered.filter((todo) => !todo.completed)
      break
    case 'completed':
      filtered = filtered.filter((todo) => todo.completed)
      break
  }
  return filtered
})

const completedTasks = computed(() => todos.value.filter((todo) => todo.completed).length)

const loadTodos = async () => {
  loading.value = true
  try {
    const fetchedTodos = await todoService.fetchTodos()
    todos.value = fetchedTodos
    await todoService.saveTodosToLocalStorage(fetchedTodos)
  } catch (error) {
    console.error('Error loading todos:', error)
    const storedTodos = todoService.getTodosFromLocalStorage()
    if (storedTodos.length) {
      todos.value = storedTodos
    }
  } finally {
    loading.value = false
  }
}

const addTodo = (title: string) => {
  const newTodo: Todo = {
    id: Date.now(),
    title,
    completed: false,
  }
  todos.value.unshift(newTodo)
  todoService.saveTodosToLocalStorage(todos.value)
}

const updateTodo = (updatedTodo: Todo) => {
  const index = todos.value.findIndex((todo) => todo.id === updatedTodo.id)
  if (index !== -1) {
    todos.value[index] = updatedTodo
    todoService.saveTodosToLocalStorage(todos.value)
  }
}

const deleteTodo = (id: number) => {
  todos.value = todos.value.filter((todo) => todo.id !== id)
  todoService.saveTodosToLocalStorage(todos.value)
}

const paginatedTodos = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredTodos.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredTodos.value.length / itemsPerPage))

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

onMounted(loadTodos)
</script>

<template>
  <div class="todo-list">
    <div class="todo-list__header">
      <h1>Список задач</h1>
      <TodoFilter
        v-model="filterStatus"
        :total-tasks="todos.length"
        :completed-tasks="completedTasks"
      />
    </div>

    <TodoForm @add="addTodo" />

    <div v-if="loading" class="todo-list__loading">Загрузка...</div>

    <div v-else-if="filteredTodos.length === 0" class="todo-list__empty">Нет задач</div>

    <div v-else>
      <div class="todo-list__items">
        <TransitionGroup name="list">
          <TodoItem
            v-for="todo in paginatedTodos"
            :key="todo.id"
            :todo="todo"
            @update="updateTodo"
            @delete="deleteTodo"
          />
        </TransitionGroup>
      </div>
      <div v-if="totalPages > 1" class="todo-list__pagination">
        <button class="pagination-btn" :disabled="currentPage === 1" @click="prevPage">←</button>
        <span class="pagination-info"> {{ currentPage }} из {{ totalPages }} </span>
        <button class="pagination-btn" :disabled="currentPage === totalPages" @click="nextPage">
          →
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.todo-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 32px 16px;

  &__header {
    margin-bottom: 32px;

    h1 {
      font-size: 32px;
      color: $text-color;
      margin-bottom: 16px;
    }
  }

  &__loading,
  &__empty {
    text-align: center;
    padding: 32px;
    color: $light-text;
    font-size: 20px;
  }

  &__items {
    margin-top: 32px;
  }
  &__pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    margin-top: 24px;
    padding: 16px;
  }
}

.pagination-btn {
  padding: 8px 16px;
  border: none;
  border-radius: $border-radius;
  background-color: $primary-color;
  color: white;
  cursor: pointer;
  transition: background-color $transition-duration ease;

  &:hover:not(:disabled) {
    background-color: rgba($primary-color, 0.8);
  }

  &:disabled {
    background-color: $light-text;
    cursor: not-allowed;
  }
}

.pagination-info {
  font-size: 16px;
  color: $text-color;
}

.list-enter-active,
.list-leave-active {
  transition: all $transition-duration ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
