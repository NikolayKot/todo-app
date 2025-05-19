import { Todo } from '@/types/todo'

export const todoService = {
  async fetchTodos(): Promise<Todo[]> {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=10')
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching todos:', error)
      return []
    }
  },

  async saveTodosToLocalStorage(todos: Todo[]): Promise<void> {
    localStorage.setItem('todos', JSON.stringify(todos))
  },

  getTodosFromLocalStorage(): Todo[] | null {
    const todos = localStorage.getItem('todos')
    return todos ? JSON.parse(todos) : null
  },
}
