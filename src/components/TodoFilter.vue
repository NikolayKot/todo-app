<script setup lang="ts">
import { computed } from 'vue'

type FilterStatus = 'all' | 'active' | 'completed'

interface Filter {
  label: string
  value: FilterStatus
}

const FILTERS: Filter[] = [
  { label: 'Все', value: 'all' },
  { label: 'Активные', value: 'active' },
  { label: 'Выполненные', value: 'completed' },
] as const

const props = withDefaults(
  defineProps<{
    modelValue: FilterStatus
    totalTasks: number
    completedTasks: number
  }>(),
  {
    modelValue: 'all',
    totalTasks: 0,
    completedTasks: 0,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: FilterStatus]
}>()

const activeTasks = computed(() => props.totalTasks - props.completedTasks)

const getFilterCount = computed(() => {
  return (filter: FilterStatus): number => {
    const counts = {
      all: props.totalTasks,
      active: activeTasks.value,
      completed: props.completedTasks,
    }
    return counts[filter] ?? 0
  }
})

const updateFilter = (value: FilterStatus) => {
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="todo-filter">
    <div class="todo-filter__stats">
      <span class="todo-filter__total">Всего задач: {{ totalTasks }}</span>
      <span class="todo-filter__completed">Выполнено: {{ completedTasks }}</span>
    </div>

    <div class="todo-filter__buttons">
      <button
        v-for="filter in FILTERS"
        :key="filter.value"
        class="todo-filter__button"
        :class="{ 'todo-filter__button--active': modelValue === filter.value }"
        @click="updateFilter(filter.value)"
      >
        {{ filter.label }}
        <span class="todo-filter__count">
          {{ getFilterCount(filter.value) }}
        </span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.todo-filter {
  background-color: #f5f5f5;
  border-radius: $border-radius;
  margin-bottom: 16px;

  &__stats {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    font-size: 0.9rem;
    color: $light-text;

    @media (max-width: $mobile) {
      flex-direction: column;
      gap: 8px;
    }
  }

  &__total,
  &__completed {
    padding: 4px 8px;
    background-color: white;
    border-radius: 4px;
    box-shadow: $box-shadow;
  }

  &__buttons {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;

    @media (max-width: $mobile) {
      flex-direction: column;
    }
  }

  &__button {
    padding: 8px 16px;
    border-radius: 4px;
    background-color: white;
    color: $text-color;
    transition: all $transition-duration ease;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;

    &:hover {
      background-color: #e0e0e0;
    }

    &--active {
      background-color: $primary-color;
      color: white;

      &:hover {
        background-color: $success-color;
      }

      .todo-filter__count {
        background-color: rgba(255, 255, 255, 0.2);
      }
    }

    @media (max-width: $mobile) {
      justify-content: space-between;
      width: 100%;
    }
  }

  &__count {
    background-color: rgba(0, 0, 0, 0.1);
    padding: 4px 8px;
    border-radius: 10px;
    font-size: 0.8rem;
    min-width: 24px;
    text-align: center;
  }
}
</style>
