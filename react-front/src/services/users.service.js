import { api } from './api'

export const usersService = {
  create: (data) => api.post('/users', data),
}
