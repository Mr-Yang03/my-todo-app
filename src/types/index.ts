export interface Todo {
  id: string;
  userId: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  searchQuery: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface TodoFormData {
  title: string;
  description: string;
  userId?: string;
}
