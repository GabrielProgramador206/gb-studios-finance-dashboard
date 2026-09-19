import { useEffect, useMemo, useRef, useState } from 'react'
import { Line, Doughnut } from 'react-chartjs-2'
import { utils, writeFile } from 'xlsx'
import { jsPDF } from 'jspdf'
import {
  ArrowDownRight, ArrowUpRight, BarChart3, Bell, Building2, ChevronDown,
  CircleDollarSign, CreditCard, FileDown, FileSpreadsheet, Goal, LayoutDashboard,
  Menu, Moon, Plus, ReceiptText, RefreshCw, Search, Settings, Sun, TrendingUp,
  WalletCards, X, Languages, Palette, Check
} from 'lucide-react'
import { accounts, cards, goals, monthlyFlow, starterTransactions } from './data/demo'

const LANGS = {
  pt: { locale: 'pt-BR', currency: 'BRL', short: 'PT', label: 'Português' },
  es: { locale: 'es-ES', currency: 'EUR', short: 'ES', label: 'Español' },
  en: { locale: 'en-US', currency: 'USD', short: 'EN', label: 'English' }
}

const RATES = { BRL: 1, USD: 0.18, EUR: 0.155 }

const COLOR_THEMES = {
  green: { accent: '#42d99f', accent2: '#7cecc2', rgb: '66,217,159', contrast: '#071a13' },
  red: { accent: '#ff5b6e', accent2: '#ff9a88', rgb: '255,91,110', contrast: '#26070c' },
  blue: { accent: '#4c8dff', accent2: '#79b3ff', rgb: '76,141,255', contrast: '#06152d' },
  yellow: { accent: '#f4c84a', accent2: '#ffe089', rgb: '244,200,74', contrast: '#241b03' },
  purple: { accent: '#8b6cff', accent2: '#b9a7ff', rgb: '139,108,255', contrast: '#160c36' },
  pink: { accent: '#f05da8', accent2: '#ff94c7', rgb: '240,93,168', contrast: '#310b21' }
}

const I18N = {
  pt: {
    personalize: 'Personalizar', system: 'SISTEMA', customization: 'PERSONALIZAÇÃO', customizationTitle: 'Cores da interface', customizationSubtitle: 'Escolha uma identidade visual para a demonstração. A preferência fica salva neste navegador.', colorPalette: 'Paleta de cores', livePreview: 'Prévia ao vivo', currentTheme: 'Tema atual', green: 'Verde', red: 'Vermelho', blue: 'Azul', yellow: 'Amarelo', purple: 'Roxo', pink: 'Rosa', defaultTheme: 'Padrão', applyTheme: 'Aplicar tema', themeApplied: 'Tema aplicado', brandIdentity: 'Identidade GB Studios',
    demo: 'AMBIENTE DEMO', workspace: 'Workspace', overview: 'VISÃO GERAL', finance: 'FINANCEIRO', analyses: 'ANÁLISES', settings: 'Configurações', admin: 'Administrador',
    dashboard: 'Dashboard', transactions: 'Transações', accounts: 'Contas', cards: 'Cartões', goals: 'Metas', analytics: 'Analytics', reports: 'Relatórios',
    search: 'Buscar transações...', newTransaction: 'Nova transação', portfolioDemo: 'Projeto demonstrativo para portfólio', reset: 'Resetar demonstração',
    greeting: 'Boa tarde, Gabriel.', intro: 'Acompanhe a saúde financeira e as principais movimentações da empresa.',
    dateHero: '18 SET 2026 · QUINTA-FEIRA', balance: 'Saldo consolidado', monthIncome: 'Entradas do mês', monthExpense: 'Saídas do mês', netResult: 'Resultado líquido', previousMonth: 'vs. mês anterior',
    cashFlow: 'FLUXO DE CAIXA', incomeVsExpense: 'Entradas x saídas', last6: 'Últimos 6 meses', distribution: 'DISTRIBUIÇÃO', expensesCategory: 'Despesas por categoria', expenses: 'despesas',
    movements: 'MOVIMENTAÇÕES', recentTransactions: 'Transações recentes', seeAll: 'Ver todas', financialHealth: 'SAÚDE FINANCEIRA', indicators: 'Indicadores', excellent: 'Excelente', cashCoverage: 'O caixa cobre 4,2 meses de despesas.', netMargin: 'Margem líquida', commitment: 'Comprometimento', reserve: 'Reserva',
    financialManagement: 'GESTÃO FINANCEIRA', transactionsSubtitle: 'Consulte, filtre e organize todas as movimentações.', exportExcel: 'Exportar Excel',
    assets: 'PATRIMÔNIO', accountsSubtitle: 'Visão consolidada das contas e reservas da empresa.', thisMonth: 'este mês',
    businessCredit: 'CRÉDITO EMPRESARIAL', cardsSubtitle: 'Limites, utilização, fechamento e vencimento.', used: 'Utilizado', available: 'Disponível', closes: 'Fecha', due: 'Vence',
    planning: 'PLANEJAMENTO', financialGoals: 'Metas financeiras', goalsSubtitle: 'Acompanhe objetivos e reservas estratégicas.', of: 'de', complete: 'concluído', remaining: 'Faltam',
    managementAnalysis: 'ANÁLISE GERENCIAL', analyticsSubtitle: 'Indicadores rápidos para leitura executiva.', updated: 'Atualizado agora', automaticInsight: 'INSIGHT AUTOMÁTICO', insightTitle: 'O resultado líquido cresceu acima das despesas.', insightText: 'Nos últimos 6 meses, a receita demonstrativa apresentou crescimento contínuo enquanto o ritmo de despesas permaneceu controlado.',
    documents: 'DOCUMENTOS', reportsSubtitle: 'Exporte informações da demonstração diretamente no navegador.', spreadsheet: 'Planilha de transações', spreadsheetText: 'Gera um arquivo .xlsx real com os lançamentos atuais da demonstração.', generateExcel: 'Gerar Excel', executive: 'Resumo executivo', executiveText: 'Gera um PDF real com os principais números financeiros do dashboard.', generatePdf: 'Gerar PDF',
    description: 'Descrição', category: 'Categoria', date: 'Data', status: 'Status', value: 'Valor', account: 'Conta', type: 'Tipo', income: 'Entrada', expense: 'Saída', newEntry: 'NOVO LANÇAMENTO', addTransaction: 'Adicionar transação', example: 'Ex.: Projeto dashboard', cancel: 'Cancelar', save: 'Salvar transação',
    projects: 'Projetos', services: 'Serviços', software: 'Software', marketing: 'Marketing', infrastructure: 'Infraestrutura', adminCat: 'Administrativo', equipment: 'Equipamentos', others: 'Outros', mainAccount: 'Conta principal', reserveAccount: 'Reserva empresarial', businessCard: 'Cartão empresarial', cash: 'Caixa',
    received: 'Recebido', paid: 'Pago', pending: 'Pendente', operational: 'Operacional', reserveType: 'Reserva', availableType: 'Disponível',
    marginMetric: 'Margem líquida', ticketMetric: 'Ticket médio', fixedCost: 'Custo fixo', runway: 'Runway', months: 'meses',
    reportTitle: 'GB Studios — Resumo Financeiro', reportLocal: 'Documento gerado localmente pela demonstração.', demoRate: 'Taxa demo', searchResults: 'resultados encontrados', noSearchResults: 'Nenhuma transação encontrada', clearSearch: 'Limpar busca'
  },
  es: {
    personalize: 'Personalizar', system: 'SISTEMA', customization: 'PERSONALIZACIÓN', customizationTitle: 'Colores de la interfaz', customizationSubtitle: 'Elige una identidad visual para la demostración. La preferencia queda guardada en este navegador.', colorPalette: 'Paleta de colores', livePreview: 'Vista previa', currentTheme: 'Tema actual', green: 'Verde', red: 'Rojo', blue: 'Azul', yellow: 'Amarillo', purple: 'Morado', pink: 'Rosa', defaultTheme: 'Predeterminado', applyTheme: 'Aplicar tema', themeApplied: 'Tema aplicado', brandIdentity: 'Identidad GB Studios',
    demo: 'ENTORNO DEMO', workspace: 'Espacio', overview: 'VISTA GENERAL', finance: 'FINANZAS', analyses: 'ANÁLISIS', settings: 'Configuración', admin: 'Administrador',
    dashboard: 'Panel', transactions: 'Transacciones', accounts: 'Cuentas', cards: 'Tarjetas', goals: 'Metas', analytics: 'Analítica', reports: 'Informes',
    search: 'Buscar transacciones...', newTransaction: 'Nueva transacción', portfolioDemo: 'Proyecto demostrativo para portafolio', reset: 'Restablecer demo',
    greeting: 'Buenas tardes, Gabriel.', intro: 'Sigue la salud financiera y los principales movimientos de la empresa.',
    dateHero: '18 SEP 2026 · JUEVES', balance: 'Saldo consolidado', monthIncome: 'Ingresos del mes', monthExpense: 'Gastos del mes', netResult: 'Resultado neto', previousMonth: 'vs. mes anterior',
    cashFlow: 'FLUJO DE CAJA', incomeVsExpense: 'Ingresos x gastos', last6: 'Últimos 6 meses', distribution: 'DISTRIBUCIÓN', expensesCategory: 'Gastos por categoría', expenses: 'gastos',
    movements: 'MOVIMIENTOS', recentTransactions: 'Transacciones recientes', seeAll: 'Ver todas', financialHealth: 'SALUD FINANCIERA', indicators: 'Indicadores', excellent: 'Excelente', cashCoverage: 'La caja cubre 4,2 meses de gastos.', netMargin: 'Margen neto', commitment: 'Compromiso', reserve: 'Reserva',
    financialManagement: 'GESTIÓN FINANCIERA', transactionsSubtitle: 'Consulta, filtra y organiza todos los movimientos.', exportExcel: 'Exportar Excel',
    assets: 'PATRIMONIO', accountsSubtitle: 'Vista consolidada de las cuentas y reservas de la empresa.', thisMonth: 'este mes',
    businessCredit: 'CRÉDITO EMPRESARIAL', cardsSubtitle: 'Límites, uso, cierre y vencimiento.', used: 'Utilizado', available: 'Disponible', closes: 'Cierra', due: 'Vence',
    planning: 'PLANIFICACIÓN', financialGoals: 'Metas financieras', goalsSubtitle: 'Sigue objetivos y reservas estratégicas.', of: 'de', complete: 'completado', remaining: 'Faltan',
    managementAnalysis: 'ANÁLISIS DE GESTIÓN', analyticsSubtitle: 'Indicadores rápidos para lectura ejecutiva.', updated: 'Actualizado ahora', automaticInsight: 'INSIGHT AUTOMÁTICO', insightTitle: 'El resultado neto creció por encima de los gastos.', insightText: 'En los últimos 6 meses, los ingresos demostrativos mostraron crecimiento continuo mientras el ritmo de gastos se mantuvo controlado.',
    documents: 'DOCUMENTOS', reportsSubtitle: 'Exporta la información de la demo directamente desde el navegador.', spreadsheet: 'Hoja de transacciones', spreadsheetText: 'Genera un archivo .xlsx real con los movimientos actuales de la demo.', generateExcel: 'Generar Excel', executive: 'Resumen ejecutivo', executiveText: 'Genera un PDF real con los principales números financieros del panel.', generatePdf: 'Generar PDF',
    description: 'Descripción', category: 'Categoría', date: 'Fecha', status: 'Estado', value: 'Valor', account: 'Cuenta', type: 'Tipo', income: 'Ingreso', expense: 'Gasto', newEntry: 'NUEVO MOVIMIENTO', addTransaction: 'Añadir transacción', example: 'Ej.: Proyecto dashboard', cancel: 'Cancelar', save: 'Guardar transacción',
    projects: 'Proyectos', services: 'Servicios', software: 'Software', marketing: 'Marketing', infrastructure: 'Infraestructura', adminCat: 'Administrativo', equipment: 'Equipos', others: 'Otros', mainAccount: 'Cuenta principal', reserveAccount: 'Reserva empresarial', businessCard: 'Tarjeta empresarial', cash: 'Caja',
    received: 'Recibido', paid: 'Pagado', pending: 'Pendiente', operational: 'Operativa', reserveType: 'Reserva', availableType: 'Disponible',
    marginMetric: 'Margen neto', ticketMetric: 'Ticket medio', fixedCost: 'Coste fijo', runway: 'Runway', months: 'meses',
    reportTitle: 'GB Studios — Resumen Financiero', reportLocal: 'Documento generado localmente por la demostración.', demoRate: 'Tasa demo', searchResults: 'resultados encontrados', noSearchResults: 'No se encontraron transacciones', clearSearch: 'Limpiar búsqueda'
  },
  en: {
    personalize: 'Customize', system: 'SYSTEM', customization: 'CUSTOMIZATION', customizationTitle: 'Interface colors', customizationSubtitle: 'Choose a visual identity for the demo. Your preference is saved in this browser.', colorPalette: 'Color palette', livePreview: 'Live preview', currentTheme: 'Current theme', green: 'Green', red: 'Red', blue: 'Blue', yellow: 'Yellow', purple: 'Purple', pink: 'Pink', defaultTheme: 'Default', applyTheme: 'Apply theme', themeApplied: 'Theme applied', brandIdentity: 'GB Studios identity',
    demo: 'DEMO ENVIRONMENT', workspace: 'Workspace', overview: 'OVERVIEW', finance: 'FINANCE', analyses: 'ANALYTICS', settings: 'Settings', admin: 'Administrator',
    dashboard: 'Dashboard', transactions: 'Transactions', accounts: 'Accounts', cards: 'Cards', goals: 'Goals', analytics: 'Analytics', reports: 'Reports',
    search: 'Search transactions...', newTransaction: 'New transaction', portfolioDemo: 'Portfolio demonstration project', reset: 'Reset demo',
    greeting: 'Good afternoon, Gabriel.', intro: 'Track the company’s financial health and key movements.',
    dateHero: 'SEP 18 2026 · THURSDAY', balance: 'Consolidated balance', monthIncome: 'Monthly income', monthExpense: 'Monthly expenses', netResult: 'Net result', previousMonth: 'vs. previous month',
    cashFlow: 'CASH FLOW', incomeVsExpense: 'Income vs expenses', last6: 'Last 6 months', distribution: 'DISTRIBUTION', expensesCategory: 'Expenses by category', expenses: 'expenses',
    movements: 'MOVEMENTS', recentTransactions: 'Recent transactions', seeAll: 'View all', financialHealth: 'FINANCIAL HEALTH', indicators: 'Indicators', excellent: 'Excellent', cashCoverage: 'Cash covers 4.2 months of expenses.', netMargin: 'Net margin', commitment: 'Commitment', reserve: 'Reserve',
    financialManagement: 'FINANCIAL MANAGEMENT', transactionsSubtitle: 'Review, filter and organize every movement.', exportExcel: 'Export Excel',
    assets: 'ASSETS', accountsSubtitle: 'Consolidated view of company accounts and reserves.', thisMonth: 'this month',
    businessCredit: 'BUSINESS CREDIT', cardsSubtitle: 'Limits, usage, closing and due dates.', used: 'Used', available: 'Available', closes: 'Closes', due: 'Due',
    planning: 'PLANNING', financialGoals: 'Financial goals', goalsSubtitle: 'Track strategic targets and reserves.', of: 'of', complete: 'complete', remaining: 'Remaining',
    managementAnalysis: 'MANAGEMENT ANALYTICS', analyticsSubtitle: 'Fast indicators for executive review.', updated: 'Updated now', automaticInsight: 'AUTOMATIC INSIGHT', insightTitle: 'Net result grew faster than expenses.', insightText: 'Over the last 6 months, demo revenue showed continuous growth while the expense pace remained controlled.',
    documents: 'DOCUMENTS', reportsSubtitle: 'Export demo information directly in the browser.', spreadsheet: 'Transaction spreadsheet', spreadsheetText: 'Generates a real .xlsx file with the current demo transactions.', generateExcel: 'Generate Excel', executive: 'Executive summary', executiveText: 'Generates a real PDF with the dashboard’s key financial figures.', generatePdf: 'Generate PDF',
    description: 'Description', category: 'Category', date: 'Date', status: 'Status', value: 'Value', account: 'Account', type: 'Type', income: 'Income', expense: 'Expense', newEntry: 'NEW ENTRY', addTransaction: 'Add transaction', example: 'Ex.: Dashboard project', cancel: 'Cancel', save: 'Save transaction',
    projects: 'Projects', services: 'Services', software: 'Software', marketing: 'Marketing', infrastructure: 'Infrastructure', adminCat: 'Administrative', equipment: 'Equipment', others: 'Other', mainAccount: 'Main account', reserveAccount: 'Business reserve', businessCard: 'Business card', cash: 'Cash',
    received: 'Received', paid: 'Paid', pending: 'Pending', operational: 'Operational', reserveType: 'Reserve', availableType: 'Available',
    marginMetric: 'Net margin', ticketMetric: 'Average ticket', fixedCost: 'Fixed cost', runway: 'Runway', months: 'months',
    reportTitle: 'GB Studios — Financial Summary', reportLocal: 'Document generated locally by the demonstration.', demoRate: 'Demo rate', searchResults: 'results found', noSearchResults: 'No transactions found', clearSearch: 'Clear search'
  }
}

const entityKeys = {
  'Projetos': 'projects', 'Serviços': 'services', 'Software': 'software', 'Marketing': 'marketing', 'Infraestrutura': 'infrastructure', 'Administrativo': 'adminCat', 'Equipamentos': 'equipment', 'Outros': 'others',
  'Conta principal': 'mainAccount', 'Reserva empresarial': 'reserveAccount', 'Cartão empresarial': 'businessCard', 'Caixa': 'cash',
  'Recebido': 'received', 'Pago': 'paid', 'Pendente': 'pending', 'Operacional': 'operational', 'Reserva': 'reserveType', 'Disponível': 'availableType'
}


const monthLabels = {
  pt: ['Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set'],
  es: ['Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'],
  en: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
}

const goalNames = {
  'Reserva operacional': { pt: 'Reserva operacional', es: 'Reserva operativa', en: 'Operating reserve' },
  'Upgrade de equipamentos': { pt: 'Upgrade de equipamentos', es: 'Mejora de equipos', en: 'Equipment upgrade' },
  'Expansão comercial': { pt: 'Expansão comercial', es: 'Expansión comercial', en: 'Business expansion' }
}

const deadlineLabels = {
  'Dez/2026': { pt: 'Dez/2026', es: 'Dic/2026', en: 'Dec/2026' },
  'Nov/2026': { pt: 'Nov/2026', es: 'Nov/2026', en: 'Nov/2026' },
  'Fev/2027': { pt: 'Fev/2027', es: 'Feb/2027', en: 'Feb/2027' }
}

const cardDateLabels = {
  '25 SET': { pt: '25 SET', es: '25 SEP', en: 'SEP 25' },
  '02 OUT': { pt: '02 OUT', es: '02 OCT', en: 'OCT 02' },
  '29 SET': { pt: '29 SET', es: '29 SEP', en: 'SEP 29' },
  '06 OUT': { pt: '06 OUT', es: '06 OCT', en: 'OCT 06' }
}

const descriptions = {
  'Projeto plataforma institucional': { es: 'Proyecto de plataforma institucional', en: 'Institutional platform project' },
  'Assinaturas de software': { es: 'Suscripciones de software', en: 'Software subscriptions' },
  'Projeto experiência interativa': { es: 'Proyecto de experiencia interactiva', en: 'Interactive experience project' },
  'Infraestrutura cloud': { es: 'Infraestructura cloud', en: 'Cloud infrastructure' },
  'Consultoria de integração': { es: 'Consultoría de integración', en: 'Integration consulting' },
  'Mídia paga': { es: 'Publicidad pagada', en: 'Paid media' },
  'Licenças e ferramentas': { es: 'Licencias y herramientas', en: 'Licenses and tools' },
  'Sistema administrativo': { es: 'Sistema administrativo', en: 'Administrative system' },
  'Contabilidade mensal': { es: 'Contabilidad mensual', en: 'Monthly accounting' },
  'Manutenção recorrente': { es: 'Mantenimiento recurrente', en: 'Recurring maintenance' },
  'Equipamentos de escritório': { es: 'Equipos de oficina', en: 'Office equipment' },
  'Automação para cliente': { es: 'Automatización para cliente', en: 'Client automation' }
}

function App() {
  const [active, setActive] = useState('dashboard')
  const [dark, setDark] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [colorTheme, setColorTheme] = useState(() => localStorage.getItem('gb-finance-color-theme') || 'green')
  const [language, setLanguage] = useState(() => localStorage.getItem('gb-finance-language') || 'pt')
  const [currency, setCurrency] = useState(() => localStorage.getItem('gb-finance-currency') || LANGS[localStorage.getItem('gb-finance-language') || 'pt'].currency)
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('gb-studios-finance-transactions')
    return saved ? JSON.parse(saved) : starterTransactions
  })
  const [query, setQuery] = useState('')
  const searchRef = useRef(null)
  const tr = I18N[language]
  const theme = COLOR_THEMES[colorTheme] || COLOR_THEMES.green
  const locale = LANGS[language].locale
  const rate = RATES[currency]
  const money = useMemo(() => new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 2 }), [locale, currency])
  const date = useMemo(() => new Intl.DateTimeFormat(locale), [locale])
  const formatMoney = value => money.format(value * rate)
  const translateEntity = value => entityKeys[value] ? tr[entityKeys[value]] : value
  const translateDescription = value => language === 'pt' ? value : descriptions[value]?.[language] || value

  const totals = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
    const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
    return { income, expense, profit: income - expense, balance: accounts.reduce((sum, a) => sum + a.balance, 0) }
  }, [transactions])

  const normalizeText = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
  const normalizedQuery = normalizeText(query)
  const filtered = transactions.filter(t => {
    if (!normalizedQuery) return true
    const searchable = [
      translateDescription(t.description), translateEntity(t.category), translateEntity(t.account), translateEntity(t.status),
      t.date, t.type === 'income' ? tr.income : tr.expense, formatMoney(t.amount), t.amount
    ].map(normalizeText).join(' ')
    return searchable.includes(normalizedQuery)
  })

  useEffect(() => {
    const handleSearchShortcut = event => {
      const target = event.target
      const typing = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement
      if (event.key === '/' && !typing && !modalOpen) {
        event.preventDefault()
        searchRef.current?.focus()
      }
      if (event.key === 'Escape' && query && !modalOpen) {
        setQuery('')
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleSearchShortcut)
    return () => window.removeEventListener('keydown', handleSearchShortcut)
  }, [modalOpen, query])

  const changeLanguage = value => {
    setLanguage(value)
    setCurrency(LANGS[value].currency)
    localStorage.setItem('gb-finance-language', value)
    localStorage.setItem('gb-finance-currency', LANGS[value].currency)
  }

  const changeCurrency = value => {
    setCurrency(value)
    localStorage.setItem('gb-finance-currency', value)
  }

  const changeColorTheme = value => {
    setColorTheme(value)
    localStorage.setItem('gb-finance-color-theme', value)
  }

  const addTransaction = event => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const amountInSelectedCurrency = Number(form.get('amount'))
    const next = {
      id: Date.now(), date: form.get('date'), description: form.get('description'), category: form.get('category'), account: form.get('account'), type: form.get('type'),
      amount: amountInSelectedCurrency / rate, status: form.get('type') === 'income' ? 'Recebido' : 'Pago'
    }
    const nextTransactions = [next, ...transactions]
    setTransactions(nextTransactions)
    localStorage.setItem('gb-studios-finance-transactions', JSON.stringify(nextTransactions))
    setModalOpen(false)
  }

  const resetDemo = () => {
    localStorage.removeItem('gb-studios-finance-transactions')
    setTransactions(starterTransactions)
  }

  const exportExcel = () => {
    const rows = transactions.map(t => ({
      [tr.date]: date.format(new Date(`${t.date}T12:00:00`)),
      [tr.description]: translateDescription(t.description),
      [tr.category]: translateEntity(t.category),
      [tr.account]: translateEntity(t.account),
      [tr.type]: t.type === 'income' ? tr.income : tr.expense,
      [`${tr.value} (${currency})`]: Number((t.amount * rate).toFixed(2)),
      [tr.status]: translateEntity(t.status)
    }))
    const sheet = utils.json_to_sheet(rows)
    sheet['!cols'] = [{wch:14},{wch:34},{wch:20},{wch:22},{wch:14},{wch:18},{wch:14}]
    const book = utils.book_new()
    utils.book_append_sheet(book, sheet, tr.transactions.slice(0, 31))
    writeFile(book, `gb-studios-finance-${language}-${currency}.xlsx`)
  }

  const exportPdf = () => {
    const pdf = new jsPDF()
    pdf.setFontSize(20)
    pdf.text(tr.reportTitle, 14, 20)
    pdf.setFontSize(11)
    pdf.text(`${tr.monthIncome}: ${formatMoney(totals.income)}`, 14, 38)
    pdf.text(`${tr.monthExpense}: ${formatMoney(totals.expense)}`, 14, 46)
    pdf.text(`${tr.netResult}: ${formatMoney(totals.profit)}`, 14, 54)
    pdf.text(`${tr.balance}: ${formatMoney(totals.balance)}`, 14, 62)
    pdf.text(`${tr.demoRate}: 1 BRL = ${RATES[currency]} ${currency}`, 14, 72)
    pdf.text(tr.reportLocal, 14, 84)
    pdf.save(`gb-studios-finance-${language}-${currency}.pdf`)
  }

  const nav = [
    ['dashboard', LayoutDashboard, tr.dashboard], ['transactions', ReceiptText, tr.transactions], ['accounts', WalletCards, tr.accounts],
    ['cards', CreditCard, tr.cards], ['goals', Goal, tr.goals], ['analytics', BarChart3, tr.analytics], ['reports', FileDown, tr.reports], ['customize', Palette, tr.personalize]
  ]
  const activeLabel = nav.find(([key]) => key === active)?.[2] || tr.dashboard
  const shared = { tr, language, currency, locale, rate, formatMoney, date, translateEntity, translateDescription, theme }

  return (
    <div className={dark ? 'app dark' : 'app'} style={{'--accent':theme.accent,'--accent2':theme.accent2,'--accent-rgb':theme.rgb,'--accent-contrast':theme.contrast}}>
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand"><div className="brand-mark"><img src="./gb-logo.png" alt="GB Studios" /></div><div><strong>GB STUDIOS</strong><span>FINANCE</span></div></div>
        <button className="sidebar-close" onClick={() => setSidebarOpen(false)}><X size={20} /></button>
        <div className="workspace"><div className="workspace-icon"><Building2 size={18}/></div><div><span>{tr.workspace}</span><strong>NovaTech Digital</strong></div><ChevronDown size={16}/></div>
        <nav>
          <p>{tr.overview}</p>
          {nav.slice(0, 1).map(([key, Icon, label]) => <button key={key} className={active === key ? 'active' : ''} onClick={() => {setActive(key); setSidebarOpen(false)}}><Icon size={19}/>{label}</button>)}
          <p>{tr.finance}</p>
          {nav.slice(1, 5).map(([key, Icon, label]) => <button key={key} className={active === key ? 'active' : ''} onClick={() => {setActive(key); setSidebarOpen(false)}}><Icon size={19}/>{label}</button>)}
          <p>{tr.analyses}</p>
          {nav.slice(5, 7).map(([key, Icon, label]) => <button key={key} className={active === key ? 'active' : ''} onClick={() => {setActive(key); setSidebarOpen(false)}}><Icon size={19}/>{label}</button>)}
          <p>{tr.system}</p>
          {nav.slice(7).map(([key, Icon, label]) => <button key={key} className={active === key ? 'active' : ''} onClick={() => {setActive(key); setSidebarOpen(false)}}><Icon size={19}/>{label}</button>)}
        </nav>
        <div className="sidebar-bottom"><div className="profile"><div className="avatar"><img src="./gb-logo.png" alt="GB" /></div><div><strong>Gabriel Busto</strong><span>{tr.admin}</span></div></div></div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="top-left"><button className="menu-btn" onClick={() => setSidebarOpen(true)}><Menu size={22}/></button><div><p>{tr.demo}</p><h1>{activeLabel}</h1></div></div>
          <div className="top-actions">
            <div className="search"><Search size={18}/><input ref={searchRef} value={query} onChange={e => { const value = e.target.value; setQuery(value); if (value.trim()) setActive('transactions') }} placeholder={tr.search}/>{query ? <button type="button" onClick={() => { setQuery(''); searchRef.current?.focus() }} aria-label={tr.clearSearch}><X size={15}/></button> : <kbd>/</kbd>}</div>
            <div className="locale-control"><Languages size={16}/><select value={language} onChange={e => changeLanguage(e.target.value)}>{Object.entries(LANGS).map(([key, item]) => <option key={key} value={key}>{item.short}</option>)}</select><select value={currency} onChange={e => changeCurrency(e.target.value)}><option value="BRL">BRL</option><option value="USD">USD</option><option value="EUR">EUR</option></select></div>
            <button className="icon-btn" onClick={() => setDark(v => !v)}>{dark ? <Sun size={19}/> : <Moon size={19}/>}</button>
            <button className="icon-btn notification"><Bell size={19}/><span></span></button>
            <button className="primary" onClick={() => setModalOpen(true)}><Plus size={18}/>{tr.newTransaction}</button>
          </div>
        </header>

        <div className="page-transition" key={`${active}-${language}-${currency}`}>
          {active === 'dashboard' && <Dashboard totals={totals} transactions={filtered} exportExcel={exportExcel} exportPdf={exportPdf} setActive={setActive} {...shared} />}
          {active === 'transactions' && <Transactions transactions={filtered} query={query} setQuery={setQuery} exportExcel={exportExcel} setModalOpen={setModalOpen} {...shared} />}
          {active === 'accounts' && <Accounts {...shared} />}
          {active === 'cards' && <Cards {...shared} />}
          {active === 'goals' && <Goals {...shared} />}
          {active === 'analytics' && <Analytics {...shared} />}
          {active === 'reports' && <Reports exportExcel={exportExcel} exportPdf={exportPdf} {...shared} />}
          {active === 'customize' && <Customize tr={tr} colorTheme={colorTheme} changeColorTheme={changeColorTheme} formatMoney={formatMoney} />}
        </div>

        <footer><span>GB Studios Finance</span><span>{tr.portfolioDemo}</span><span className="rate-note">{tr.demoRate}: 1 BRL = {RATES[currency]} {currency}</span><button onClick={resetDemo}><RefreshCw size={14}/>{tr.reset}</button></footer>
      </main>

      {modalOpen && <TransactionModal onClose={() => setModalOpen(false)} onSubmit={addTransaction} {...shared} />}
      {sidebarOpen && <div className="mobile-overlay" onClick={() => setSidebarOpen(false)}></div>}
    </div>
  )
}

function Dashboard({ totals, transactions, exportExcel, exportPdf, setActive, tr, language, currency, rate, formatMoney, date, translateEntity, translateDescription, theme }) {
  const cardsData = [[tr.balance, totals.balance, 12.4, 'balance'], [tr.monthIncome, totals.income, 8.7, 'income'], [tr.monthExpense, totals.expense, -3.2, 'expense'], [tr.netResult, totals.profit, 18.6, 'profit']]
  const convertedIncome = monthlyFlow.income.map(v => v * rate)
  const convertedExpense = monthlyFlow.expense.map(v => v * rate)
  const lineData = { labels: monthLabels[language], datasets: [
    { label: tr.income, data: convertedIncome, borderColor: theme.accent, backgroundColor: `rgba(${theme.rgb},.12)`, fill: true, tension: .42, pointRadius: 0, pointHoverRadius: 5 },
    { label: tr.expense, data: convertedExpense, borderColor: '#ff716f', backgroundColor: 'rgba(255,113,111,.06)', fill: true, tension: .42, pointRadius: 0, pointHoverRadius: 5 }
  ]}
  const symbol = currency === 'BRL' ? 'R$' : currency === 'USD' ? '$' : '€'
  const lineOptions = { responsive: true, maintainAspectRatio: false, interaction: { intersect: false, mode: 'index' }, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#7f938d' } }, y: { grid: { color: 'rgba(130,160,151,.10)' }, ticks: { color: '#7f938d', callback: v => `${symbol} ${Math.round(v/1000)}k` } } } }
  const doughnutData = { labels: [tr.projects, tr.software, tr.marketing, tr.infrastructure, tr.others], datasets: [{ data: [38, 18, 16, 14, 14], backgroundColor: [theme.accent,'#7e8cff','#ffb35f','#ff7074','#52645f'], borderWidth: 0, spacing: 4 }]}
  const doughnutOptions = { responsive: true, maintainAspectRatio: false, cutout: '72%', plugins: { legend: { display: false } } }

  return <div className="content">
    <section className="hero-row"><div><span className="eyebrow">{tr.dateHero}</span><h2>{tr.greeting}</h2><p>{tr.intro}</p></div><div className="hero-buttons"><button className="secondary" onClick={exportExcel}><FileSpreadsheet size={17}/>Excel</button><button className="secondary" onClick={exportPdf}><FileDown size={17}/>PDF</button></div></section>
    <section className="kpi-grid">{cardsData.map(([label, value, change, tone]) => <div className={`kpi-card ${tone}`} key={label}><div className="kpi-top"><span>{label}</span><div className="kpi-icon"><CircleDollarSign size={19}/></div></div><strong>{formatMoney(value)}</strong><div className={`change ${change >= 0 ? 'up' : 'down'}`}>{change >= 0 ? <ArrowUpRight size={15}/> : <ArrowDownRight size={15}/>}<b>{Math.abs(change)}%</b><span>{tr.previousMonth}</span></div></div>)}</section>
    <section className="grid-main">
      <article className="panel flow-panel"><div className="panel-head"><div><span>{tr.cashFlow}</span><h3>{tr.incomeVsExpense}</h3></div><button className="mini-select">{tr.last6} <ChevronDown size={15}/></button></div><div className="chart-wrap"><Line data={lineData} options={lineOptions}/></div></article>
      <article className="panel category-panel"><div className="panel-head"><div><span>{tr.distribution}</span><h3>{tr.expensesCategory}</h3></div><button className="ghost-dot">•••</button></div><div className="donut-wrap"><Doughnut data={doughnutData} options={doughnutOptions}/><div className="donut-center"><strong>{formatMoney(18083)}</strong><span>{tr.expenses}</span></div></div><div className="legend-list">{doughnutData.labels.map((l, i) => <div key={l}><span style={{background:doughnutData.datasets[0].backgroundColor[i]}}></span><b>{l}</b><em>{doughnutData.datasets[0].data[i]}%</em></div>)}</div></article>
    </section>
    <section className="grid-lower">
      <article className="panel transactions"><div className="panel-head"><div><span>{tr.movements}</span><h3>{tr.recentTransactions}</h3></div><button className="text-btn" onClick={() => setActive('transactions')}>{tr.seeAll}</button></div><TransactionTable transactions={transactions.slice(0, 6)} tr={tr} formatMoney={formatMoney} date={date} translateEntity={translateEntity} translateDescription={translateDescription}/></article>
      <article className="panel health"><div className="panel-head"><div><span>{tr.financialHealth}</span><h3>{tr.indicators}</h3></div><TrendingUp size={20}/></div><div className="score"><div><span>82</span><small>/100</small></div><strong>{tr.excellent}</strong><p>{tr.cashCoverage}</p></div><div className="health-bars"><div><span>{tr.netMargin} <b>53,8%</b></span><i><em style={{width:'78%'}}></em></i></div><div><span>{tr.commitment} <b>31,4%</b></span><i><em style={{width:'44%'}}></em></i></div><div><span>{tr.reserve} <b>57,5%</b></span><i><em style={{width:'62%'}}></em></i></div></div></article>
    </section>
  </div>
}

function Transactions({ transactions, query, setQuery, exportExcel, setModalOpen, tr, formatMoney, date, translateEntity, translateDescription }) {
  return <div className="content page-content"><section className="page-heading"><div><span className="eyebrow">{tr.financialManagement}</span><h2>{tr.transactions}</h2><p>{tr.transactionsSubtitle}</p></div><div className="hero-buttons"><button className="secondary" onClick={exportExcel}><FileSpreadsheet size={17}/>{tr.exportExcel}</button><button className="primary" onClick={() => setModalOpen(true)}><Plus size={17}/>{tr.newTransaction}</button></div></section>{query && <div className="search-feedback"><span><Search size={15}/><b>{transactions.length}</b> {tr.searchResults}: “{query}”</span><button type="button" onClick={() => setQuery('')}><X size={14}/>{tr.clearSearch}</button></div>}<article className="panel transactions full">{transactions.length ? <TransactionTable transactions={transactions} tr={tr} formatMoney={formatMoney} date={date} translateEntity={translateEntity} translateDescription={translateDescription}/> : <div className="empty-state"><Search size={28}/><strong>{tr.noSearchResults}</strong><span>“{query}”</span><button className="secondary" type="button" onClick={() => setQuery('')}>{tr.clearSearch}</button></div>}</article></div>
}

function Accounts({ tr, formatMoney, translateEntity }) {
  return <div className="content page-content"><section className="page-heading"><div><span className="eyebrow">{tr.assets}</span><h2>{tr.accounts}</h2><p>{tr.accountsSubtitle}</p></div></section><div className="account-grid">{accounts.map(a => <article className="account-card" key={a.name}><div className="account-orb"></div><span>{translateEntity(a.bank)}</span><h3>{translateEntity(a.name)}</h3><strong>{formatMoney(a.balance)}</strong><div className={a.change >= 0 ? 'change up' : 'change down'}>{a.change >= 0 ? <ArrowUpRight size={15}/> : <ArrowDownRight size={15}/>}<b>{Math.abs(a.change)}%</b><span>{tr.thisMonth}</span></div></article>)}</div></div>
}

function Cards({ tr, language, formatMoney }) {
  return <div className="content page-content"><section className="page-heading"><div><span className="eyebrow">{tr.businessCredit}</span><h2>{tr.cards}</h2><p>{tr.cardsSubtitle}</p></div></section><div className="credit-grid">{cards.map((c, i) => <article className={`credit-card c${i}`} key={c.ending}><div className="credit-glow"></div><div className="credit-top"><span>GB STUDIOS BUSINESS</span><CreditCard size={28}/></div><strong>•••• •••• •••• {c.ending}</strong><div className="credit-name">{c.name}</div><div className="credit-stats"><div><span>{tr.used}</span><b>{formatMoney(c.used)}</b></div><div><span>{tr.available}</span><b>{formatMoney(c.limit-c.used)}</b></div></div><div className="credit-progress"><i style={{width:`${(c.used/c.limit)*100}%`}}></i></div><div className="credit-bottom"><span>{tr.closes} {cardDateLabels[c.close]?.[language] || c.close}</span><span>{tr.due} {cardDateLabels[c.due]?.[language] || c.due}</span></div></article>)}</div></div>
}

function Goals({ tr, language, formatMoney }) {
  return <div className="content page-content"><section className="page-heading"><div><span className="eyebrow">{tr.planning}</span><h2>{tr.financialGoals}</h2><p>{tr.goalsSubtitle}</p></div></section><div className="goals-grid">{goals.map(g => { const pct=Math.min(100,(g.current/g.target)*100); return <article className="panel goal-card" key={g.id}><div className="goal-head"><div className="goal-icon"><Goal size={20}/></div><span>{deadlineLabels[g.deadline]?.[language] || g.deadline}</span></div><h3>{goalNames[g.name]?.[language] || g.name}</h3><strong>{formatMoney(g.current)}</strong><p>{tr.of} {formatMoney(g.target)}</p><div className="goal-progress"><i style={{width:`${pct}%`}}></i></div><div className="goal-foot"><span>{pct.toFixed(0)}% {tr.complete}</span><b>{tr.remaining} {formatMoney(g.target-g.current)}</b></div></article>})}</div></div>
}

function Analytics({ tr, formatMoney }) {
  const metrics = [[tr.marginMetric,'53,8%'],[tr.ticketMetric,formatMoney(4892)],[tr.fixedCost,formatMoney(6410)],[tr.runway,`4,2 ${tr.months}`]]
  return <div className="content page-content"><section className="page-heading"><div><span className="eyebrow">{tr.managementAnalysis}</span><h2>{tr.analytics}</h2><p>{tr.analyticsSubtitle}</p></div></section><div className="analytics-grid">{metrics.map(([a,b])=><article className="panel metric-card" key={a}><span>{a}</span><strong>{b}</strong><small>{tr.updated}</small></article>)}</div><article className="panel insight-panel"><span>{tr.automaticInsight}</span><h3>{tr.insightTitle}</h3><p>{tr.insightText}</p></article></div>
}

function Reports({ exportExcel, exportPdf, tr }) {
  return <div className="content page-content"><section className="page-heading"><div><span className="eyebrow">{tr.documents}</span><h2>{tr.reports}</h2><p>{tr.reportsSubtitle}</p></div></section><div className="report-grid"><article className="panel report-card"><FileSpreadsheet size={28}/><h3>{tr.spreadsheet}</h3><p>{tr.spreadsheetText}</p><button className="primary" onClick={exportExcel}>{tr.generateExcel}</button></article><article className="panel report-card"><FileDown size={28}/><h3>{tr.executive}</h3><p>{tr.executiveText}</p><button className="primary" onClick={exportPdf}>{tr.generatePdf}</button></article></div></div>
}

function Customize({ tr, colorTheme, changeColorTheme, formatMoney }) {
  const themes = Object.entries(COLOR_THEMES)
  return <div className="content page-content"><section className="page-heading"><div><span className="eyebrow">{tr.customization}</span><h2>{tr.customizationTitle}</h2><p>{tr.customizationSubtitle}</p></div></section><div className="customize-layout"><article className="panel palette-panel"><div className="panel-head"><div><span>{tr.brandIdentity}</span><h3>{tr.colorPalette}</h3></div><div className="theme-badge"><span style={{background:COLOR_THEMES[colorTheme].accent}}></span>{tr.currentTheme}</div></div><div className="palette-grid">{themes.map(([key, item]) => <button type="button" className={`palette-option ${colorTheme === key ? 'selected' : ''}`} key={key} onClick={() => changeColorTheme(key)} style={{'--swatch':item.accent,'--swatch2':item.accent2}}><div className="palette-swatch"><i></i><b></b>{colorTheme === key && <em><Check size={18}/></em>}</div><strong>{tr[key]}</strong><span>{key === 'green' ? tr.defaultTheme : tr.applyTheme}</span></button>)}</div></article><article className="panel live-preview"><div className="panel-head"><div><span>{tr.currentTheme}</span><h3>{tr.livePreview}</h3></div><img src="./gb-logo.png" alt="GB Studios" /></div><div className="preview-kpis"><div><span>{tr.balance}</span><strong>{formatMoney(84250)}</strong><i></i></div><div><span>{tr.netResult}</span><strong>{formatMoney(13260)}</strong><i></i></div></div><div className="preview-chart"><span></span><span></span><span></span><span></span><span></span><span></span></div><button className="primary"><Palette size={17}/>{tr.themeApplied}</button></article></div></div>
}

function TransactionTable({ transactions, tr, formatMoney, date, translateEntity, translateDescription }) {
  return <div className="table-wrap"><table><thead><tr><th>{tr.description}</th><th>{tr.category}</th><th>{tr.date}</th><th>{tr.status}</th><th>{tr.value}</th></tr></thead><tbody>{transactions.map(t => <tr key={t.id}><td><div className={`tx-icon ${t.type}`}>{t.type === 'income' ? <ArrowUpRight size={16}/> : <ArrowDownRight size={16}/>}</div><div><strong>{translateDescription(t.description)}</strong><span>{translateEntity(t.account)}</span></div></td><td><span className="tag">{translateEntity(t.category)}</span></td><td>{date.format(new Date(`${t.date}T12:00:00`))}</td><td><span className={`status ${t.status === 'Pendente' ? 'pending' : ''}`}>{translateEntity(t.status)}</span></td><td className={t.type}>{t.type === 'income' ? '+' : '-'} {formatMoney(t.amount)}</td></tr>)}</tbody></table></div>
}

function TransactionModal({ onClose, onSubmit, tr, currency }) {
  return <div className="modal-layer"><div className="modal-backdrop" onClick={onClose}></div><form className="modal" onSubmit={onSubmit}><div className="modal-head"><div><span>{tr.newEntry}</span><h3>{tr.addTransaction}</h3></div><button type="button" onClick={onClose}><X size={20}/></button></div><label>{tr.description}<input name="description" placeholder={tr.example} required/></label><div className="field-grid"><label>{tr.type}<select name="type"><option value="income">{tr.income}</option><option value="expense">{tr.expense}</option></select></label><label>{tr.value} ({currency})<input name="amount" type="number" step="0.01" min="0" placeholder="0.00" required/></label></div><div className="field-grid"><label>{tr.category}<select name="category"><option value="Projetos">{tr.projects}</option><option value="Serviços">{tr.services}</option><option value="Software">{tr.software}</option><option value="Marketing">{tr.marketing}</option><option value="Infraestrutura">{tr.infrastructure}</option><option value="Administrativo">{tr.adminCat}</option></select></label><label>{tr.account}<select name="account"><option value="Conta principal">{tr.mainAccount}</option><option value="Reserva empresarial">{tr.reserveAccount}</option><option value="Cartão empresarial">{tr.businessCard}</option><option value="Caixa">{tr.cash}</option></select></label></div><label>{tr.date}<input name="date" type="date" defaultValue="2026-09-18" required/></label><div className="modal-actions"><button type="button" className="secondary" onClick={onClose}>{tr.cancel}</button><button className="primary">{tr.save}</button></div></form></div>
}

export default App
