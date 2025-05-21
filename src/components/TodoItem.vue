<script setup lang="ts">
import { ref } from 'vue'
import type { Todo } from '@/types/todo'

const props = defineProps<{
  todo: Todo
}>()

const emit = defineEmits<{
  (e: 'update', todo: Todo): void
  (e: 'delete', id: number): void
}>()

const isEditing = ref(false)
const editedTitle = ref(props.todo.title)
const editInput = ref<HTMLInputElement | null>(null)

const toggleComplete = () => {
  emit('update', {
    ...props.todo,
    completed: !props.todo.completed,
  })
}

const startEdit = () => {
  isEditing.value = true
  editedTitle.value = props.todo.title
  setTimeout(() => {
    editInput.value?.focus()
  })
}

const saveEdit = () => {
  const trimmedTitle = editedTitle.value.trim()
  if (trimmedTitle) {
    emit('update', {
      ...props.todo,
      title: trimmedTitle,
    })
  }
  isEditing.value = false
}
</script>

<template>
  <div class="todo-item" :class="{ 'todo-item--completed': todo.completed }">
    <div class="todo-item__content">
      <input
        type="checkbox"
        class="todo-item__checkbox"
        :checked="todo.completed"
        @change="toggleComplete"
      />

      <template v-if="isEditing">
        <input
          v-model="editedTitle"
          class="todo-item__edit-input"
          @keyup.enter="saveEdit"
          @blur="saveEdit"
          ref="editInput"
        />
      </template>
      <template v-else>
        <span class="todo-item__title" @dblclick="startEdit">
          {{ todo.title }}
        </span>
      </template>
    </div>

    <div class="todo-item__actions">
      <button class="todo-item__btn todo-item__btn--edit" @click="startEdit">✎</button>
      <button class="todo-item__btn todo-item__btn--delete" @click="$emit('delete', todo.id)">
        ✕
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  margin-bottom: 8px;
  background-color: white;
  border-radius: $border-radius;
  box-shadow: $box-shadow;

  &--completed {
    .todo-item__title {
      text-decoration: line-through;
      color: $light-text;
    }
  }

  &__content {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1;
  }

  &__checkbox {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }

  &__title {
    font-size: 16px;
    word-break: break-word;
    color: $text-color;
  }

  &__edit-input {
    flex: 1;
    padding: 8px;
    border: 1px solid $border-color;
    border-radius: 4px;
    font-size: 16px;

    &:focus {
      outline: none;
      border-color: $primary-color;
    }
  }

  &__actions {
    display: flex;
    gap: 8px;
  }

  &__btn {
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color $transition-duration ease;

    &--edit {
      background-color: #f0f0f0;
      &:hover {
        background-color: #e0e0e0;
      }
    }

    &--delete {
      background-color: #ff4444;
      color: white;
      &:hover {
        background-color: #cc0000;
      }
    }
  }
}
</style>
