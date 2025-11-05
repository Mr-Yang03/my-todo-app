import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { RootState } from '../store';
import {
  fetchAllTodosRequest,
  createTodoRequest,
  updateTodoRequest,
  deleteTodoRequest,
  toggleTodoRequest,
} from '../features/todos/todoSlice';
import { Todo, TodoFormData } from '../types';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { FormWrapper } from '../components/FormWrapper';
import { FormInput } from '../components/FormInput';
import { FormTextArea } from '../components/FormTextArea';
import { Pagination } from '../components/Pagination';
import { todoSchema } from '../utils/validationSchemas';
import { useSearchParams } from '../hooks/useSearchParams';
import { useDebounce } from '../hooks/useDebounce';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

const TodoContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex: 1;
  max-width: 500px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px #dbeafe;
  }
`;

const TodoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const TodoCard = styled.div<{ completed?: boolean }>`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const TodoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
`;

const TodoTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const TodoDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0.5rem 0;
`;

const TodoFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
`;

const TodoDate = styled.span`
  color: #9ca3af;
  font-size: 0.75rem;
`;

const TodoActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: #fef3c7;
  color: #92400e;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;

  input[type='checkbox'] {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
`;

export default function PendingTodosPage() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [params, updateParams] = useSearchParams({
    page: 1,
    search: '',
  });

  const [searchInput, setSearchInput] = useState(params.search);
  const debouncedSearch = useDebounce(searchInput, 500);

  // Get todos from Redux state
  const { todos: allTodos, loading } = useSelector((state: RootState) => state.todos);

  // Detect modal state from URL
  const isCreateModalOpen = location.pathname === '/pending/task/create';
  const isEditModalOpen = location.pathname.match(/^\/pending\/task\/[^\/]+\/edit$/);
  const isDeleteModalOpen = location.pathname.match(/^\/pending\/task\/[^\/]+\/delete$/);
  
  // Get taskId from URL if editing or deleting
  const taskIdMatch = location.pathname.match(/\/pending\/task\/([^\/]+)\/(edit|delete)/);
  const taskId = taskIdMatch ? taskIdMatch[1] : null;
  
  const selectedTodo = taskId ? allTodos.find(todo => todo.id === taskId) || null : null;

  // Fetch todos filtered by userId at server level using Redux saga
  useEffect(() => {
    if (user) {
      dispatch(fetchAllTodosRequest({ userId: user.id }));
    }
  }, [user, dispatch]);

  // Update URL when search changes
  useEffect(() => {
    if (debouncedSearch !== params.search) {
      updateParams({ search: debouncedSearch, page: 1 });
    }
  }, [debouncedSearch, params.search, updateParams]);

  // Step 1: Filter pending todos (client-side, vì JSON Server không filter boolean tốt)
  const pendingTodos = allTodos.filter((todo) => !todo.completed);

  // Step 2: Apply search filter (client-side, vì JSON Server v1 không hỗ trợ _like)
  const filteredTodos = debouncedSearch.trim()
    ? pendingTodos.filter(
        (todo) =>
          todo.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          todo.description.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    : pendingTodos;

  // Step 3: Pagination (cuối cùng)
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredTodos.length / itemsPerPage);
  const startIndex = (params.page - 1) * itemsPerPage;
  const paginatedTodos = filteredTodos.slice(startIndex, startIndex + itemsPerPage);

  const handleCreateTodo = () => {
    navigate('/pending/task/create');
  };

  const handleEditTodo = (todo: Todo) => {
    navigate(`/pending/task/${todo.id}/edit`);
  };

  const handleDeleteClick = (todoId: string) => {
    navigate(`/pending/task/${todoId}/delete`);
  };

  const handleDeleteConfirm = () => {
    if (taskId) {
      dispatch(deleteTodoRequest(taskId));
      // Refetch after delete
      setTimeout(() => {
        if (user) {
          dispatch(fetchAllTodosRequest({ userId: user.id }));
        }
      }, 100);
    }
    navigate('/pending');
  };

  const handleToggleTodo = (todo: Todo) => {
    dispatch(toggleTodoRequest({ id: todo.id, completed: !todo.completed }));
    // Refetch after toggle
    setTimeout(() => {
      if (user) {
        dispatch(fetchAllTodosRequest({ userId: user.id }));
      }
    }, 100);
  };

  const handleSubmit = (data: TodoFormData) => {
    if (isEditModalOpen && selectedTodo) {
      dispatch(updateTodoRequest({ id: selectedTodo.id, data }));
    } else {
      dispatch(createTodoRequest(data));
    }
    // Refetch after create/update
    setTimeout(() => {
      if (user) {
        dispatch(fetchAllTodosRequest({ userId: user.id }));
      }
    }, 100);
    navigate('/pending');
  };

  const handlePageChange = (page: number) => {
    updateParams({ page });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <TodoContainer>
      <Header>
        <Title>⏳ Pending Tasks</Title>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder={t('todos.search')}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Button onClick={handleCreateTodo}>{t('todos.addNew')}</Button>
        </SearchContainer>
      </Header>

      {loading && allTodos.length === 0 ? (
        <LoadingSpinner>
          <Spinner />
        </LoadingSpinner>
      ) : paginatedTodos.length === 0 ? (
        <EmptyState>
          <h3>No pending tasks found</h3>
          <p>Click "{t('todos.addNew')}" to create a new task</p>
        </EmptyState>
      ) : (
        <>
          <TodoGrid>
            {paginatedTodos.map((todo) => (
              <TodoCard key={todo.id}>
                <TodoHeader>
                  <TodoTitle>{todo.title}</TodoTitle>
                  <StatusBadge>{t('todos.pending')}</StatusBadge>
                </TodoHeader>
                <TodoDescription>{todo.description}</TodoDescription>
                <TodoFooter>
                  <CheckboxLabel>
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggleTodo(todo)}
                    />
                    <span>{t('todos.completed')}</span>
                  </CheckboxLabel>
                  <TodoActions>
                    <Button variant="secondary" onClick={() => handleEditTodo(todo)}>
                      {t('todos.edit')}
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteClick(todo.id)}
                    >
                      {t('todos.delete')}
                    </Button>
                  </TodoActions>
                </TodoFooter>
                <TodoDate>
                  {t('todos.createdAt')}: {formatDate(todo.createdAt)}
                </TodoDate>
              </TodoCard>
            ))}
          </TodoGrid>

          {totalPages > 1 && (
            <Pagination
              currentPage={params.page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      <Modal
        isOpen={isCreateModalOpen || isEditModalOpen ? true : false}
        onClose={() => navigate('/pending')}
        title={isEditModalOpen ? t('todos.editTodo') : t('todos.createTodo')}
      >
        <FormWrapper<TodoFormData>
          onSubmit={handleSubmit}
          defaultValues={
            selectedTodo
              ? {
                  title: selectedTodo.title,
                  description: selectedTodo.description,
                }
              : { title: '', description: '' }
          }
          validationSchema={todoSchema}
        >
          <FormInput name="title" label={t('todos.todoTitle')} />
          <FormTextArea name="description" label={t('todos.todoDescription')} />
          <FormActions>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/pending')}
            >
              {t('todos.cancel')}
            </Button>
            <Button type="submit">{t('todos.save')}</Button>
          </FormActions>
        </FormWrapper>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteModalOpen ? true : false}
        title={t('todos.deleteTodo')}
        message={t('todos.confirmDelete')}
        onConfirm={handleDeleteConfirm}
        onCancel={() => navigate('/pending')}
        confirmText={t('todos.delete')}
        cancelText={t('todos.cancel')}
      />
    </TodoContainer>
  );
}
