import { api } from './api'

export const dashboardService = {
  getProducts: () => api.get('/products'),
  deactivateProduct: (id) => api.patch(`/products/${id}/deactivate`),
  getDashboard: () => api.get('/dashboards'),
}
