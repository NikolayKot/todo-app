import type { Todo } from '@/types/todo'

const STORAGE_KEY = 'vue-todos'

export const todoService = {
  // Получение задач из localStorage
  getTodosFromLocalStorage(): Todo[] {
    const todos = localStorage.getItem(STORAGE_KEY)
    return todos ? JSON.parse(todos) : []
  },

  // Сохранение задач в localStorage
  saveTodosToLocalStorage(todos: Todo[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  },

  // Получение задач с сервера
  async fetchTodos(): Promise<Todo[]> {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos')
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const todos = await response.json()
      // Берем только первые 20 задач
      return todos.slice(0, 20).map((todo: any) => ({
        id: todo.id,
        title: todo.title,
        completed: todo.completed,
      }))
    } catch (error) {
      console.error('Error fetching todos:', error)
      // В случае ошибки возвращаем тестовые данные
      return [
        { id: 1, title: 'Тест 1', completed: false },
        { id: 2, title: 'Тест 2', completed: false },
        { id: 3, title: 'Тест 3', completed: false },
      ]
    }
  },
}
