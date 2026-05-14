import { api } from './api'

export const dashboardService = {
  getProducts: () => api.get('/products'),
  getProductById: (id) => api.get(`/products/${id}`),
  deactivateProduct: (id) => api.patch(`/products/${id}/deactivate`),
  activateProduct: (id) => api.patch(`/products/${id}/activate`),
  getDashboard: () => api.get('/dashboards'),
}
