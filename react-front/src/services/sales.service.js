import { api } from './api'

export const salesService = {
  /**
   * POST /vendas (JWT)
   * Cria uma nova venda
   */
  create: async (vendaData) => {
    try {
      return await api.post('/vendas', vendaData)
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
      return await api.get('/vendas')
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
      return await api.get(`/vendas/${id}`)
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
      return await api.patch(`/vendas/${id}`, vendaData)
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
      return await api.delete(`/vendas/${id}`)
    } catch (error) {
      console.error('Erro ao remover venda:', error)
      throw error
    }
  },
}
