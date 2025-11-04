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
  getTodos: async (page: number = 1, limit: number = 10, search?: string) => {
    const params: any = {
      _page: page,
      _limit: limit,
      _sort: 'createdAt',
      _order: 'desc',
    };
    
    if (search) {
      params.q = search;
    }
    
    const response = await api.get<Todo[]>('/todos', { params });
    const total = response.headers['x-total-count'];
    return {
      data: response.data,
      totalPages: Math.ceil(total / limit),
    };
  },

  getTodoById: async (id: string) => {
    const response = await api.get<Todo>(`/todos/${id}`);
    return response.data;
  },

  createTodo: async (todo: TodoFormData) => {
    const newTodo = {
      ...todo,
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
