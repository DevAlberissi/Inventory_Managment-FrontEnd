import { api } from './api'

export const usersService = {
  create: (data) => api.post('/users', data),
  getMe: () => api.get('/users/me'),
  updateMe: (data) => api.patch('/users/me', data),
}
