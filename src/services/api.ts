import axios from 'axios';
import { Todo, LoginCredentials, User, TodoFormData } from '../types';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Todo APIs
export const todoApi = {
  getAllTodos: async () => {
    // Fetch all todos without pagination
    const params: any = {
      _sort: 'createdAt',
      _order: 'desc',
    };
    
    const response = await api.get<Todo[]>('/todos', { params });
    return response.data;
  },

  getTodos: async (page: number = 1, limit: number = 10, search?: string) => {
    // Fetch all todos first (JSON Server v1 doesn't support _like)
    const params: any = {
      _sort: 'createdAt',
      _order: 'desc',
    };
    
    const response = await api.get<Todo[]>('/todos', { params });
    let filteredData = response.data;
    
    // Filter by search term on client side
    if (search && search.trim()) {
      const searchLower = search.toLowerCase();
      filteredData = response.data.filter((todo) =>
        todo.title.toLowerCase().includes(searchLower) ||
        todo.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Manual pagination
    const total = filteredData.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filteredData.slice(startIndex, endIndex);
    
    return {
      data: paginatedData,
      totalPages: Math.ceil(total / limit),
    };
  },

  getTodoById: async (id: string) => {
    const response = await api.get<Todo>(`/todos/${id}`);
    return response.data;
  },

  createTodo: async (todo: TodoFormData) => {
    // Get current user from localStorage
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    const newTodo = {
      ...todo,
      userId: user?.id || '1', // Default to user 1 if not found
      completed: false,
      createdAt: new Date().toISOString(),
    };
    const response = await api.post<Todo>('/todos', newTodo);
    return response.data;
  },

  updateTodo: async (id: string, todo: Partial<Todo>) => {
    const response = await api.patch<Todo>(`/todos/${id}`, todo);
    return response.data;
  },

  deleteTodo: async (id: string) => {
    await api.delete(`/todos/${id}`);
  },

  toggleTodo: async (id: string, completed: boolean) => {
    const response = await api.patch<Todo>(`/todos/${id}`, { completed });
    return response.data;
  },
};

// Auth APIs (Mock implementation)
export const authApi = {
  login: async (credentials: LoginCredentials) => {
    // Simulate API call
    const response = await api.get<User[]>('/users', {
      params: {
        username: credentials.username,
      },
    });

    const user = response.data[0];
    if (user) {
      // In a real app, you would verify password on backend
      // For demo, we'll just return a mock token
      const token = btoa(`${credentials.username}:${credentials.password}`);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return { user, token };
    }

    throw new Error('Invalid credentials');
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr) as User;
    }
    return null;
  },
};
