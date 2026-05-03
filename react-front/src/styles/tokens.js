/**
 * @file tokens.js
 * @description Design tokens centrais do projeto Inventory Management.
 * Todos os estilos visuais devem referenciar estes tokens em vez de valores hardcoded.
 * Importe com: import { colors, radius, shadow, spacing, tones } from '../styles/tokens'
 */

/**
 * Paleta de cores do sistema.
 *
 * Cores de marca (primary):
 *   primary       — Índigo principal (#6366F1). Usado em botões, links e focos ativos.
 *   primarySoft   — Fundo suave índigo (#EEF2FF). Usado em badges e destaques leves.
 *   primaryBorder — Borda índigo (#C7D2FE). Usado em contornos de campos focados.
 *
 * Cores de superfície:
 *   bg            — Fundo geral da página (#F9FAFB). Cor de fundo padrão do layout.
 *   surface       — Superfície de card/modal (#FFFFFF). Fundo de componentes elevados.
 *   border        — Borda padrão (#E2E8F0). Divisores e contornos normais.
 *   borderStrong  — Borda forte (#CBD5E1). Contornos com maior contraste.
 *
 * Cores de texto:
 *   text          — Texto principal (#020617). Títulos e corpo de alta legibilidade.
 *   textSecondary — Texto secundário (#475569). Labels, subtítulos e metadados.
 *   textMuted     — Texto suave (#94A3B8). Placeholders e informações opcionais.
 *
 * Cores semânticas (cada tom tem versão sólida, suave e de borda):
 *   success*      — Verde (#16A34A). Confirmações, status ativo, feedback positivo.
 *   error*        — Vermelho (#DC2626). Erros, validações e ações destrutivas.
 *   warning*      — Âmbar (#F59E0B). Avisos e estados de atenção.
 *   info*         — Azul (#0EA5E9). Informações neutras e dicas.
 */
export const colors = {
  primary: '#6366F1',
  primarySoft: '#EEF2FF',
  primaryBorder: '#C7D2FE',

  bg: '#F9FAFB',
  surface: '#FFFFFF',
  border: '#E2E8F0',
  borderStrong: '#CBD5E1',

  text: '#020617',
  textSecondary: '#475569',
  textMuted: '#94A3B8',

  success: '#16A34A',
  successSoft: '#DCFCE7',
  successBorder: '#BBF7D0',

  error: '#DC2626',
  errorSoft: '#FEE2E2',
  errorBorder: '#FECACA',

  warning: '#F59E0B',
  warningSoft: '#FEF3C7',
  warningBorder: '#FDE68A',

  info: '#0EA5E9',
  infoSoft: '#E0F2FE',
  infoBorder: '#BAE6FD',
};

/**
 * Raios de borda (border-radius) em pixels.
 *   sm   — 6px.  Elementos pequenos: tags, chips, tooltips.
 *   md   — 10px. Padrão: inputs, botões, cards internos.
 *   lg   — 16px. Cards principais e modais.
 *   xl   — 24px. Painéis grandes e drawers.
 *   full — 9999px. Elementos totalmente arredondados (pills, avatares).
 */
export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999,
};

/**
 * Sombras pré-definidas (box-shadow).
 *   sm    — Sombra sutil. Cards em repouso e divisores elevados.
 *   md    — Sombra média. Dropdowns, popovers e cards interativos.
 *   lg    — Sombra forte. Modais e painéis flutuantes.
 *   focus — Anel de foco índigo. Aplicado em inputs/botões no estado :focus.
 */
export const shadow = {
  sm: '0 1px 2px rgba(0,0,0,.05)',
  md: '0 4px 12px rgba(0,0,0,.08)',
  lg: '0 10px 25px rgba(0,0,0,.10)',
  focus: '0 0 0 3px rgba(99,102,241,.18)',
};

/**
 * Espaçamentos em pixels (escala de 4pt).
 * Use sempre estes valores para padding, margin, gap e dimensões.
 *   4  — Micro espaçamento. Ícones internos, gaps mínimos.
 *   8  — Espaçamento pequeno. Gaps de linha, padding de chips.
 *   12 — Espaçamento base. Padding interno de botões e badges.
 *   16 — Espaçamento médio. Gap entre campos de formulário.
 *   24 — Padding padrão de cards e seções.
 *   32 — Espaçamento grande. Separação entre grupos de conteúdo.
 *   48 — Espaçamento extra. Margens de seção em layout.
 *   64 — Espaçamento máximo. Separação entre blocos de página.
 */
export const spacing = {
  4: 4, 8: 8, 12: 12, 16: 16, 24: 24, 32: 32, 48: 48, 64: 64,
};

/**
 * Tones semânticos — objetos com bg, color, border e icon para cada estado.
 * Use com os componentes Badge, Alert e IconBox via prop `tone`.
 *
 *   neutral — Cinza. Estado padrão / sem classificação.
 *   accent  — Índigo. Destaque ou item selecionado.
 *   success — Verde. Sucesso, ativo, aprovado.
 *   error   — Vermelho. Falha, inativo, rejeitado.
 *   warning — Âmbar. Atenção, pendente, em revisão.
 *   info    — Azul. Informação neutra, em andamento.
 *
 * Cada tone expõe:
 *   bg     — Cor de fundo suave.
 *   color  — Cor de texto com contraste adequado sobre bg.
 *   border — Cor de borda complementar.
 *   icon   — Cor para ícones e dots.
 */
export const tones = {
  neutral: { bg: '#F1F5F9', color: '#334155', border: '#E2E8F0', icon: '#64748B' },
  accent:  { bg: '#EEF2FF', color: '#4338CA', border: '#C7D2FE', icon: '#6366F1' },
  success: { bg: '#DCFCE7', color: '#15803D', border: '#BBF7D0', icon: '#16A34A' },
  error:   { bg: '#FEE2E2', color: '#B91C1C', border: '#FECACA', icon: '#DC2626' },
  warning: { bg: '#FEF3C7', color: '#B45309', border: '#FDE68A', icon: '#F59E0B' },
  info:    { bg: '#E0F2FE', color: '#0369A1', border: '#BAE6FD', icon: '#0EA5E9' },
};
