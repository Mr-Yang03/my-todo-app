import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { todoApi } from '../services/api';
import { Todo, TodoFormData } from '../types';
import { toastMessages } from '../utils/toastMessages';

// Query keys
export const todoKeys = {
  all: ['todos'] as const,
  lists: () => [...todoKeys.all, 'list'] as const,
  list: (userId?: string) => [...todoKeys.lists(), { userId }] as const,
  details: () => [...todoKeys.all, 'detail'] as const,
  detail: (id: string) => [...todoKeys.details(), id] as const,
};

// Fetch all todos for a user
export function useTodos(userId?: string) {
  return useQuery({
    queryKey: todoKeys.list(userId),
    queryFn: () => todoApi.getAllTodos(userId),
    enabled: !!userId, // Only run query if userId exists
  });
}

// Create todo mutation
export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TodoFormData) => todoApi.createTodo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
      toast.success(toastMessages.todo.created);
    },
    onError: (error: Error) => {
      toast.error(toastMessages.todo.createError(error.message));
    },
  });
}

// Update todo mutation
export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Todo> }) =>
      todoApi.updateTodo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
      toast.success(toastMessages.todo.updated);
    },
    onError: (error: Error) => {
      toast.error(toastMessages.todo.updateError(error.message));
    },
  });
}

// Delete todo mutation
export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => todoApi.deleteTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
      toast.success(toastMessages.todo.deleted);
    },
    onError: (error: Error) => {
      toast.error(toastMessages.todo.deleteError(error.message));
    },
  });
}

// Toggle todo completion mutation
export function useToggleTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      todoApi.toggleTodo(id, completed),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
      const message = data.completed 
        ? toastMessages.todo.completed
        : toastMessages.todo.pending;
      toast.success(message);
    },
    onError: (error: Error) => {
      toast.error(toastMessages.todo.toggleError(error.message));
    },
  });
}
