import { call, put, takeEvery, takeLatest, all } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { todoApi } from '../../services/api';
import { Todo, TodoFormData } from '../../types';
import {
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
} from './todoSlice';

// Worker Sagas
function* fetchAllTodosSaga(
  action: PayloadAction<{ userId?: string }>
): Generator<any, void, any> {
  try {
    const { userId } = action.payload;
    const todos: Todo[] = yield call(todoApi.getAllTodos, userId);
    yield put(fetchAllTodosSuccess(todos));
  } catch (error) {
    yield put(
      fetchAllTodosFailure(
        error instanceof Error ? error.message : 'Failed to fetch todos'
      )
    );
  }
}

function* fetchTodosSaga(
  action: PayloadAction<{ page: number; search?: string }>
): Generator<any, void, any> {
  try {
    const { page, search } = action.payload;
    const response = yield call(todoApi.getTodos, page, 10, search);
    yield put(
      fetchTodosSuccess({
        todos: response.data,
        totalPages: response.totalPages,
      })
    );
  } catch (error) {
    yield put(
      fetchTodosFailure(
        error instanceof Error ? error.message : 'Failed to fetch todos'
      )
    );
  }
}

function* createTodoSaga(
  action: PayloadAction<TodoFormData>
): Generator<any, void, any> {
  try {
    const todo: Todo = yield call(todoApi.createTodo, action.payload);
    yield put(createTodoSuccess(todo));
  } catch (error) {
    yield put(
      createTodoFailure(
        error instanceof Error ? error.message : 'Failed to create todo'
      )
    );
  }
}

function* updateTodoSaga(
  action: PayloadAction<{ id: string; data: Partial<Todo> }>
): Generator<any, void, any> {
  try {
    const { id, data } = action.payload;
    const todo: Todo = yield call(todoApi.updateTodo, id, data);
    yield put(updateTodoSuccess(todo));
  } catch (error) {
    yield put(
      updateTodoFailure(
        error instanceof Error ? error.message : 'Failed to update todo'
      )
    );
  }
}

function* deleteTodoSaga(action: PayloadAction<string>): Generator<any, void, any> {
  try {
    yield call(todoApi.deleteTodo, action.payload);
    yield put(deleteTodoSuccess(action.payload));
  } catch (error) {
    yield put(
      deleteTodoFailure(
        error instanceof Error ? error.message : 'Failed to delete todo'
      )
    );
  }
}

function* toggleTodoSaga(
  action: PayloadAction<{ id: string; completed: boolean }>
): Generator<any, void, any> {
  const { id, completed } = action.payload;
  try {
    const todo: Todo = yield call(todoApi.toggleTodo, id, completed);
    yield put(toggleTodoSuccess(todo));
  } catch (error) {
    yield put(
      toggleTodoFailure({
        id,
        error: error instanceof Error ? error.message : 'Failed to toggle todo',
      })
    );
  }
}

// Watcher Sagas
function* watchFetchAllTodos() {
  yield takeLatest(fetchAllTodosRequest.type, fetchAllTodosSaga);
}

function* watchFetchTodos() {
  yield takeLatest(fetchTodosRequest.type, fetchTodosSaga);
}

function* watchCreateTodo() {
  yield takeEvery(createTodoRequest.type, createTodoSaga);
}

function* watchUpdateTodo() {
  yield takeEvery(updateTodoRequest.type, updateTodoSaga);
}

function* watchDeleteTodo() {
  yield takeEvery(deleteTodoRequest.type, deleteTodoSaga);
}

function* watchToggleTodo() {
  yield takeEvery(toggleTodoRequest.type, toggleTodoSaga);
}

// Root Saga
export default function* rootSaga() {
  yield all([
    watchFetchAllTodos(),
    watchFetchTodos(),
    watchCreateTodo(),
    watchUpdateTodo(),
    watchDeleteTodo(),
    watchToggleTodo(),
  ]);
}
