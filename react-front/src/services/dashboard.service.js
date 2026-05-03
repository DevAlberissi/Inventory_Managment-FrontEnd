import { api } from './api'

// Mock de respostas para rotas que ainda não existem na API
const MOCK_SALES_SUMMARY = {
  totalVendas: 'R$ 12.480,00',
  totalTransacoes: 47,
  ticketMedio: 'R$ 265,53',
  crescimentoMensal: '+12,4%',
}

const MOCK_RECENT_SALES = [
  { id: 1, produto: 'Caixa organizadora 30L',     quantidade: 5,  valor: 'R$ 249,95', data: '03/05/2026' },
  { id: 2, produto: 'Etiqueta térmica 100×50',    quantidade: 12, valor: 'R$ 179,88', data: '02/05/2026' },
  { id: 3, produto: 'Fita adesiva transparente',  quantidade: 3,  valor: 'R$ 44,85',  data: '01/05/2026' },
  { id: 4, produto: 'Caixa papelão 40×30',        quantidade: 8,  valor: 'R$ 320,00', data: '30/04/2026' },
  { id: 5, produto: 'Plástico bolha 1m²',         quantidade: 2,  valor: 'R$ 58,00',  data: '29/04/2026' },
]

export const dashboardService = {
  /** Rota real: GET /products (JWT) */
  getProducts: () => api.get('/products'),

  /** Mock — rota GET /dashboard/summary ainda não existe na API */
  getSalesSummary: async () => MOCK_SALES_SUMMARY,

  /** Mock — rota GET /sales ainda não existe na API */
  getRecentSales: async () => ({ vendas: MOCK_RECENT_SALES }),
}
