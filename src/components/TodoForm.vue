<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'add', title: string): void
}>()

const newTodoTitle = ref('')
const showError = ref(false)
const isSubmitting = ref(false)

const handleSubmit = async () => {
  if (newTodoTitle.value.trim()) {
    isSubmitting.value = true

    try {
      emit('add', newTodoTitle.value.trim())
      newTodoTitle.value = ''
      showError.value = false
    } catch (error) {
      console.error('Error adding todo:', error)
    } finally {
      isSubmitting.value = false
    }
  } else {
    showError.value = true
  }
}
</script>

<template>
  <form class="todo-form" @submit.prevent="handleSubmit">
    <div class="todo-form__input-wrapper">
      <input
        v-model="newTodoTitle"
        type="text"
        class="todo-form__input"
        placeholder="Введите новую задачу"
        :class="{ 'todo-form__input--error': showError }"
        @input="showError = false"
      />
      <span v-if="showError" class="todo-form__error"> Пожалуйста, введите текст задачи </span>
    </div>

    <button type="submit" class="todo-form__button" :disabled="isSubmitting">
      {{ isSubmitting ? 'Добавление...' : 'Добавить' }}
    </button>
  </form>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.todo-form {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;

  @media (max-width: $mobile) {
    flex-direction: column;
  }

  &__input-wrapper {
    flex: 1;
    position: relative;
  }

  &__input {
    width: 100%;
    padding: 12px 16px;
    font-size: 16px;
    border: 2px solid $border-color;
    border-radius: $border-radius;
    transition: border-color $transition-duration ease;

    &:focus {
      outline: none;
      border-color: $primary-color;
    }

    &--error {
      border-color: $error-color;
    }

    &::placeholder {
      color: $light-text;
    }
  }

  &__error {
    position: absolute;
    left: 0;
    bottom: -20px;
    font-size: 13px;
    color: $error-color;
  }

  &__button {
    padding: 12px 32px;
    font-size: 16px;
    color: white;
    background-color: $primary-color;
    border-radius: $border-radius;
    transition: background-color $transition-duration ease;
    min-width: 120px;

    &:hover:not(:disabled) {
      background-color: $success-color;
    }

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    @media (max-width: $mobile) {
      width: 100%;
    }
  }
}
</style>
