import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Todo, TodoFormData } from '../../types';

interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  searchQuery: string;
}

const initialState: TodoState = {
  todos: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  searchQuery: '',
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    // Fetch all todos by userId
    fetchAllTodosRequest: (state, action: PayloadAction<{ userId?: string }>) => {
      state.loading = true;
      state.error = null;
    },
    fetchAllTodosSuccess: (state, action: PayloadAction<Todo[]>) => {
      state.loading = false;
      state.todos = action.payload;
    },
    fetchAllTodosFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch todos (old, for compatibility)
    fetchTodosRequest: (
      state,
      action: PayloadAction<{ page: number; search?: string }>
    ) => {
      state.loading = true;
      state.error = null;
      state.currentPage = action.payload.page;
      state.searchQuery = action.payload.search || '';
    },
    fetchTodosSuccess: (
      state,
      action: PayloadAction<{ todos: Todo[]; totalPages: number }>
    ) => {
      state.loading = false;
      state.todos = action.payload.todos;
      state.totalPages = action.payload.totalPages;
    },
    fetchTodosFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Create todo
    createTodoRequest: (state, action: PayloadAction<TodoFormData>) => {
      state.loading = true;
      state.error = null;
    },
    createTodoSuccess: (state, action: PayloadAction<Todo>) => {
      state.loading = false;
      state.todos.unshift(action.payload);
    },
    createTodoFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update todo
    updateTodoRequest: (
      state,
      action: PayloadAction<{ id: string; data: Partial<Todo> }>
    ) => {
      state.loading = true;
      state.error = null;
    },
    updateTodoSuccess: (state, action: PayloadAction<Todo>) => {
      state.loading = false;
      const index = state.todos.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.todos[index] = action.payload;
      }
    },
    updateTodoFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete todo
    deleteTodoRequest: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    deleteTodoSuccess: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.todos = state.todos.filter((t) => t.id !== action.payload);
    },
    deleteTodoFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Toggle todo
    toggleTodoRequest: (
      state,
      action: PayloadAction<{ id: string; completed: boolean }>
    ) => {
      // Optimistic update
      const todo = state.todos.find((t) => t.id === action.payload.id);
      if (todo) {
        todo.completed = action.payload.completed;
      }
    },
    toggleTodoSuccess: (state, action: PayloadAction<Todo>) => {
      const index = state.todos.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.todos[index] = action.payload;
      }
    },
    toggleTodoFailure: (
      state,
      action: PayloadAction<{ id: string; error: string }>
    ) => {
      // Revert optimistic update
      const todo = state.todos.find((t) => t.id === action.payload.id);
      if (todo) {
        todo.completed = !todo.completed;
      }
      state.error = action.payload.error;
    },
  },
});

export const {
  fetchAllTodosRequest,
  fetchAllTodosSuccess,
  fetchAllTodosFailure,
  fetchTodosRequest,
  fetchTodosSuccess,
  fetchTodosFailure,
  createTodoRequest,
  createTodoSuccess,
  createTodoFailure,
  updateTodoRequest,
  updateTodoSuccess,
  updateTodoFailure,
  deleteTodoRequest,
  deleteTodoSuccess,
  deleteTodoFailure,
  toggleTodoRequest,
  toggleTodoSuccess,
  toggleTodoFailure,
} = todoSlice.actions;

export default todoSlice.reducer;
