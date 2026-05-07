import { api } from './api'
import { API_BASE_URL } from '../config/constants'

export const salesService = {
  /**
   * POST /vendas (JWT)
   * Cria uma nova venda
   */
  create: async (vendaData) => {
    try {
      const token = localStorage.getItem('token')
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      }

      const response = await fetch(`${API_BASE_URL}/vendas`, {
        method: 'POST',
        headers,
        body: JSON.stringify(vendaData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.mensagem || errorData.message || `Erro ${response.status}: Falha ao registrar venda`
        throw new Error(errorMessage)
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao criar venda:', error)
      throw error
    }
  },

  /**
   * GET /vendas (JWT)
   * Retorna lista de vendas do seller autenticado
   */
  list: async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = token ? { Authorization: `Bearer ${token}` } : {}

      const response = await fetch(`${API_BASE_URL}/vendas`, {
        method: 'GET',
        headers,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.mensagem || errorData.message || `Erro ${response.status}: Falha ao carregar vendas`
        throw new Error(errorMessage)
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao listar vendas:', error)
      throw error
    }
  },

  /**
   * GET /vendas/:id (JWT)
   * Retorna uma venda específica
   */
  getById: async (id) => {
    try {
      const token = localStorage.getItem('token')
      const headers = token ? { Authorization: `Bearer ${token}` } : {}

      const response = await fetch(`${API_BASE_URL}/vendas/${id}`, {
        method: 'GET',
        headers,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.mensagem || errorData.message || `Erro ${response.status}: Falha ao carregar venda`
        throw new Error(errorMessage)
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao obter venda:', error)
      throw error
    }
  },

  /**
   * PATCH /vendas/:id (JWT)
   * Atualiza uma venda
   */
  update: async (id, vendaData) => {
    try {
      const token = localStorage.getItem('token')
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      }

      const response = await fetch(`${API_BASE_URL}/vendas/${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(vendaData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.mensagem || errorData.message || `Erro ${response.status}: Falha ao atualizar venda`
        throw new Error(errorMessage)
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao atualizar venda:', error)
      throw error
    }
  },

  /**
   * DELETE /vendas/:id (JWT)
   * Remove uma venda
   */
  delete: async (id) => {
    try {
      const token = localStorage.getItem('token')
      const headers = token ? { Authorization: `Bearer ${token}` } : {}

      const response = await fetch(`${API_BASE_URL}/vendas/${id}`, {
        method: 'DELETE',
        headers,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.mensagem || errorData.message || `Erro ${response.status}: Falha ao remover venda`
        throw new Error(errorMessage)
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao remover venda:', error)
      throw error
    }
  },
}
