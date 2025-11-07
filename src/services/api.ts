import axios from 'axios';
import toast from 'react-hot-toast';
import { Todo, LoginCredentials, User, TodoFormData } from '../types';
import { toastMessages } from '../utils/toastMessages';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.message;
      
      switch (status) {
        case 400:
          toast.error(toastMessages.apiError[400](message));
          break;
        case 401:
          toast.error(toastMessages.apiError[401]);
          break;
        case 403:
          toast.error(toastMessages.apiError[403]);
          break;
        case 404:
          toast.error(toastMessages.apiError[404]);
          break;
        case 500:
          toast.error(toastMessages.apiError[500]);
          break;
        default:
          toast.error(toastMessages.apiError.default(message));
      }
    } else if (error.request) {
      toast.error(toastMessages.network.error);
    } else {
      toast.error(toastMessages.apiError.default(error.message));
    }
    
    return Promise.reject(error);
  }
);

export const todoApi = {
  getAllTodos: async (userId?: string) => {
    const params: any = {
      _sort: 'createdAt',
      _order: 'desc',
    };
    
    if (userId) {
      params.userId = userId;
    }
    
    const response = await api.get<Todo[]>('/todos', { params });
    return response.data;
  },

  getTodos: async (page: number = 1, limit: number = 10, search?: string) => {
    const params: any = {
      _sort: 'createdAt',
      _order: 'desc',
    };
    
    const response = await api.get<Todo[]>('/todos', { params });
    let filteredData = response.data;
    
    if (search && search.trim()) {
      const searchLower = search.toLowerCase();
      filteredData = response.data.filter((todo) =>
        todo.title.toLowerCase().includes(searchLower) ||
        todo.description.toLowerCase().includes(searchLower)
      );
    }
    
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
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    const newTodo = {
      ...todo,
      userId: user?.id || '1',
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

export const authApi = {
  register: async (credentials: LoginCredentials & { email: string; name: string }) => {
    const existingUsers = await api.get<User[]>('/users', {
      params: {
        username: credentials.username,
      },
    });

    if (existingUsers.data.length > 0) {
      throw new Error('Username already exists');
    }

    const newUser: Omit<User, 'id'> = {
      username: credentials.username,
      email: credentials.email,
      name: credentials.name,
    };

    const response = await api.post<User>('/users', newUser);
    const user = response.data;

    const token = btoa(`${credentials.username}:${credentials.password}`);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return { user, token };
  },

  login: async (credentials: LoginCredentials) => {
    const response = await api.get<User[]>('/users', {
      params: {
        username: credentials.username,
      },
    });

    const user = response.data[0];
    if (user) {
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
