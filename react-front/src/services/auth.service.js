import { api } from './api'

export const authService = {
  login:          (email, password) => api.post('/auth/login', { email, password }),
  activate:       (email, code)     => api.patch('/users/activate', { email, code }),
  resendWhatsApp: (phone)           => api.post('/resend-whatsapp', { phone }),
}
