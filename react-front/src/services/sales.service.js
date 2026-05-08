import { api } from './api'

export const salesService = {
  create: (body) => api.post('/vendas', body),
  list:   ()     => api.get('/vendas'),
  getById:(id)   => api.get(`/vendas/${id}`),
  delete: (id)   => api.delete(`/vendas/${id}`),
}
