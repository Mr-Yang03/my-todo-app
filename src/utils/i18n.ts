import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      app: {
        title: 'Todo App',
        logout: 'Logout',
      },
      auth: {
        login: 'Login',
        username: 'Username',
        password: 'Password',
        loginButton: 'Sign In',
        welcome: 'Welcome to Todo App',
      },
      todos: {
        title: 'My Todos',
        addNew: 'Add New Todo',
        search: 'Search todos...',
        noTodos: 'No todos found',
        createTodo: 'Create Todo',
        editTodo: 'Edit Todo',
        deleteTodo: 'Delete Todo',
        confirmDelete: 'Are you sure you want to delete this todo?',
        todoTitle: 'Title',
        todoDescription: 'Description',
        completed: 'Completed',
        pending: 'Pending',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        createdAt: 'Created at',
      },
    },
  },
  vi: {
    translation: {
      app: {
        title: 'Ứng dụng Công việc',
        logout: 'Đăng xuất',
      },
      auth: {
        login: 'Đăng nhập',
        username: 'Tên đăng nhập',
        password: 'Mật khẩu',
        loginButton: 'Đăng nhập',
        welcome: 'Chào mừng đến với Ứng dụng Công việc',
      },
      todos: {
        title: 'Công việc của tôi',
        addNew: 'Thêm công việc mới',
        search: 'Tìm kiếm công việc...',
        noTodos: 'Không tìm thấy công việc',
        createTodo: 'Tạo công việc',
        editTodo: 'Sửa công việc',
        deleteTodo: 'Xóa công việc',
        confirmDelete: 'Bạn có chắc chắn muốn xóa công việc này?',
        todoTitle: 'Tiêu đề',
        todoDescription: 'Mô tả',
        completed: 'Đã hoàn thành',
        pending: 'Đang thực hiện',
        save: 'Lưu',
        cancel: 'Hủy',
        delete: 'Xóa',
        edit: 'Sửa',
        createdAt: 'Ngày tạo',
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
