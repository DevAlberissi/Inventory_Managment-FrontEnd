import { useNavigate } from 'react-router-dom'
import {
  Users, Package, TrendingUp, MessageCircle, ShieldCheck, BarChart3,
  Check, ArrowRight, UserPlus, Play, Quote,
} from 'lucide-react'
import { Logo, Button, Card, Badge, Navbar, SectionHeader, IconBox } from '../components'

/* ---------- sub-components ---------- */

const TrustItem = ({ text }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#475569', fontWeight: 500 }}>
    <span style={{ width: 18, height: 18, borderRadius: 9999, background: '#DCFCE7', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <Check size={11} color="#16A34A" />
    </span>
    {text}
  </span>
)

const BigStat = ({ value, label, border }) => (
  <div style={{ padding: '32px 24px', borderLeft: border ? '1px solid #E2E8F0' : 'none', textAlign: 'center' }}>
    <div style={{ fontSize: 36, fontWeight: 700, color: '#020617', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
    <div style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>{label}</div>
  </div>
)

const Feature = ({ icon, title, body }) => (
  <Card padding={24}>
    <div style={{ marginBottom: 16 }}>
      <IconBox icon={icon} tone="accent" size={40} radius={10} />
    </div>
    <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 600, color: '#020617' }}>{title}</h3>
    <p style={{ margin: 0, fontSize: 14, color: '#64748B', lineHeight: 1.55 }}>{body}</p>
  </Card>
)

const Step = ({ n, title, body, last }) => (
  <div style={{ display: 'flex', gap: 16, paddingBottom: last ? 0 : 20, position: 'relative' }}>
    <div style={{ flex: '0 0 36px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: 36, height: 36, borderRadius: 9999, background: '#6366F1', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>{n}</div>
      {!last && <div style={{ width: 2, flex: 1, background: '#E2E8F0', marginTop: 6 }} />}
    </div>
    <div style={{ paddingTop: 6 }}>
      <div style={{ fontSize: 16, fontWeight: 600, color: '#020617', marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 14, color: '#64748B', lineHeight: 1.5 }}>{body}</div>
    </div>
  </div>
)

const MiniStat = ({ label, value, tone }) => (
  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, padding: 10 }}>
    <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 2 }}>{label}</div>
    <div style={{ fontSize: 15, fontWeight: 700, color: tone, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }}>{value}</div>
  </div>
)

const HeroPreview = () => (
  <div style={{ position: 'relative' }}>
    <Card padding={20} style={{ boxShadow: '0 10px 25px rgba(0,0,0,.10)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#94A3B8' }}>Hoje</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#020617' }}>Resumo do estoque</div>
        </div>
        <Badge tone="success" dot>Ao vivo</Badge>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
        <MiniStat label="Vendas" value="R$ 4.820" tone="#16A34A" />
        <MiniStat label="Saídas" value="142" tone="#6366F1" />
        <MiniStat label="Baixo" value="7" tone="#F59E0B" />
      </div>
      <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 14 }}>
        {[
          { name: 'Caixa organizadora 30L', qty: '42 un.', tone: 'success' },
          { name: 'Etiqueta térmica 100×50', qty: '18 un.', tone: 'success' },
          { name: 'Fita adesiva transparente', qty: '3 baixo', tone: 'warning' },
        ].map((r, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < 2 ? '1px solid #F1F5F9' : 'none' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <IconBox icon={<Package />} tone="neutral" size={28} radius={6} />
              <span style={{ fontSize: 13, color: '#020617', fontWeight: 500 }}>{r.name}</span>
            </div>
            <Badge tone={r.tone} dot>{r.qty}</Badge>
          </div>
        ))}
      </div>
    </Card>
    <div style={{
      position: 'absolute', bottom: -24, left: -24, background: '#fff',
      border: '1px solid #E2E8F0', borderRadius: 14, padding: '12px 16px',
      boxShadow: '0 10px 25px rgba(0,0,0,.10)', display: 'flex', gap: 12, alignItems: 'center',
      maxWidth: 260,
    }}>
      <IconBox icon={<MessageCircle />} tone="success" size={36} radius={10} />
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#020617' }}>Código enviado</div>
        <div style={{ fontSize: 12, color: '#64748B' }}>(**) *****-4321 · há 2s</div>
      </div>
    </div>
  </div>
)

const FakeTerminal = () => (
  <div style={{ background: '#020617', color: '#E2E8F0', padding: 24, fontFamily: 'ui-monospace, monospace', fontSize: 13, lineHeight: 1.7 }}>
    <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
      <span style={{ width: 10, height: 10, borderRadius: 9999, background: '#475569' }} />
      <span style={{ width: 10, height: 10, borderRadius: 9999, background: '#475569' }} />
      <span style={{ width: 10, height: 10, borderRadius: 9999, background: '#475569' }} />
    </div>
    <div><span style={{ color: '#6366F1' }}>POST</span> /users <span style={{ color: '#64748B' }}>· seller cadastrado</span></div>
    <div><span style={{ color: '#16A34A' }}>WhatsApp</span> → código 4279 enviado</div>
    <div><span style={{ color: '#6366F1' }}>PATCH</span> /users/activate <span style={{ color: '#64748B' }}>· conta ativa</span></div>
    <div><span style={{ color: '#6366F1' }}>POST</span> /products <span style={{ color: '#64748B' }}>· "Caixa 30L"</span></div>
    <div><span style={{ color: '#6366F1' }}>POST</span> /products <span style={{ color: '#64748B' }}>· "Etiqueta 100×50"</span></div>
    <div style={{ color: '#16A34A' }}>✓ catálogo pronto · 2 SKUs</div>
    <div style={{ color: '#94A3B8', marginTop: 8 }}>storefront publicado em <span style={{ color: '#fff' }}>stockhub.app/embala-mais</span> ▌</div>
  </div>
)

/* ---------- main component ---------- */

const Home = () => {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>

      <Navbar />

      {/* Hero */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 32px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 48, alignItems: 'center' }}>
          <div>
            <Badge tone="accent">Novo · Integração com WhatsApp</Badge>
            <h1 style={{ fontSize: 56, lineHeight: 1.05, letterSpacing: '-0.03em', fontWeight: 700, color: '#020617', margin: '20px 0 18px' }}>
              Seu estoque,<br />
              <span style={{ color: '#6366F1' }}>organizado</span> de ponta a ponta.
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.55, color: '#475569', margin: '0 0 28px', maxWidth: 520 }}>
              Cadastre sellers, produtos e movimentações em uma única plataforma.
              Acompanhe estoque em tempo real e venda direto pelo seu storefront.
            </p>
            <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
              <Button variant="primary" onClick={() => navigate('/cadastrar')}>
                <UserPlus size={16} /> Criar conta grátis
              </Button>
              <Button variant="secondary" onClick={() => navigate('/login')}>
                <Play size={16} /> Ver demonstração
              </Button>
            </div>
            <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
              <TrustItem text="14 dias grátis" />
              <TrustItem text="Sem cartão" />
              <TrustItem text="Suporte em PT-BR" />
            </div>
          </div>
          <HeroPreview />
        </div>
      </section>

      {/* Logo strip */}
      <section style={{ borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0', background: '#F9FAFB' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#94A3B8' }}>+ de 1.200 sellers já confiam</span>
          <div style={{ display: 'flex', gap: 36, color: '#94A3B8', fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em', flexWrap: 'wrap' }}>
            <span>NORTE.</span>
            <span>Mercado<strong style={{ color: '#64748B' }}>Box</strong></span>
            <span>kraft&amp;co</span>
            <span>EMBALA+</span>
            <span>logística·br</span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
          <BigStat value="1.2K+" label="Sellers ativos" />
          <BigStat value="3.4M" label="Produtos cadastrados" border />
          <BigStat value="R$ 89M" label="Volume movimentado" border />
          <BigStat value="99.98%" label="Uptime garantido" border />
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 32px 80px' }}>
        <SectionHeader
          label="Recursos"
          title="Tudo que você precisa para vender mais."
          subtitle="Sem planilhas, sem ferramentas soltas. Tudo num lugar só."
          style={{ marginBottom: 48 }}
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <Feature icon={<Users />} title="Multi-seller" body="Convide parceiros, defina permissões e acompanhe o desempenho de cada um." />
          <Feature icon={<Package />} title="Catálogo unificado" body="Cadastre produtos com foto, preço e estoque. Organize por categoria." />
          <Feature icon={<TrendingUp />} title="Movimentações em tempo real" body="Entradas, saídas e ajustes registrados automaticamente. Histórico completo." />
          <Feature icon={<MessageCircle />} title="Verificação por WhatsApp" body="Onboarding com código de 4 dígitos. Sem fricção, sem e-mail perdido." />
          <Feature icon={<ShieldCheck />} title="Acesso seguro" body="JWT, sessões revogáveis e rastreio de auditoria por seller." />
          <Feature icon={<BarChart3 />} title="Dashboards claros" body="Estoque baixo, ruptura, top vendas. Você vê o que importa de relance." />
        </div>
      </section>

      {/* Workflow */}
      <section id="workflow" style={{ background: '#F9FAFB', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
            <div>
              <SectionHeader
                label="Como funciona"
                title="Em 3 passos você está vendendo."
                align="left"
                style={{ marginBottom: 24 }}
              />
              <Step n="1" title="Cadastre o seller" body="Nome, e-mail, CNPJ. Código de verificação chega no WhatsApp em segundos." />
              <Step n="2" title="Suba seu catálogo" body="Adicione produtos com foto e preço. Defina quantidade e categoria." />
              <Step n="3" title="Acompanhe e venda" body="Storefront pronto, painel de movimentações ao vivo, alertas de estoque." last />
              <div style={{ marginTop: 28 }}>
                <Button variant="primary" onClick={() => navigate('/cadastrar')}>
                  <ArrowRight size={16} /> Criar minha conta
                </Button>
              </div>
            </div>
            <Card padding={0} style={{ overflow: 'hidden' }}>
              <FakeTerminal />
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '80px 32px', textAlign: 'center' }}>
        <Quote size={32} color="#6366F1" />
        <p style={{ fontSize: 24, lineHeight: 1.4, fontWeight: 500, color: '#020617', margin: '16px 0 24px', letterSpacing: '-0.01em' }}>
          "Saímos da planilha pro StockHub em uma tarde. Hoje gerencio 12 sellers e 800 SKUs sem encostar num Excel."
        </p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 9999, background: '#EEF2FF', color: '#4338CA', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>MR</div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#020617' }}>Marina Ribeiro</div>
            <div style={{ fontSize: 13, color: '#64748B' }}>Fundadora · Embala+</div>
          </div>
        </div>
      </section>

      {/* CTA dark */}
      <section style={{ padding: '0 32px 80px' }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', borderRadius: 24, padding: '56px 48px',
          background: '#020617', color: '#fff',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 32, flexWrap: 'wrap',
        }}>
          <div>
            <h2 style={{ margin: '0 0 8px', fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em' }}>Pronto para parar de gerenciar no Excel?</h2>
            <p style={{ margin: 0, color: '#94A3B8', fontSize: 16 }}>14 dias grátis. Sem cartão. Cancele quando quiser.</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Button variant="primary" onClick={() => navigate('/cadastrar')}>
              <UserPlus size={16} /> Começar agora
            </Button>
            <button
              onClick={() => navigate('/login')}
              style={{ background: 'transparent', color: '#fff', border: '1px solid #334155', padding: '10px 18px', borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}
            >
              Já tenho conta
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #E2E8F0', padding: '32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <Logo />
          <div style={{ fontSize: 13, color: '#94A3B8' }}>© 2026 StockHub. Feito com cuidado em São Paulo.</div>
        </div>
      </footer>
    </div>
  )
}

export default Home
