export const starterTransactions = [
  { id: 1, date: '2026-09-02', description: 'Projeto plataforma institucional', category: 'Projetos', account: 'Conta principal', type: 'income', amount: 6800, status: 'Recebido' },
  { id: 2, date: '2026-09-03', description: 'Assinaturas de software', category: 'Software', account: 'Cartão empresarial', type: 'expense', amount: 638.9, status: 'Pago' },
  { id: 3, date: '2026-09-05', description: 'Projeto experiência interativa', category: 'Projetos', account: 'Conta principal', type: 'income', amount: 4500, status: 'Recebido' },
  { id: 4, date: '2026-09-06', description: 'Infraestrutura cloud', category: 'Infraestrutura', account: 'Cartão empresarial', type: 'expense', amount: 890, status: 'Pago' },
  { id: 5, date: '2026-09-08', description: 'Consultoria de integração', category: 'Serviços', account: 'Conta principal', type: 'income', amount: 3200, status: 'Recebido' },
  { id: 6, date: '2026-09-09', description: 'Mídia paga', category: 'Marketing', account: 'Cartão empresarial', type: 'expense', amount: 1200, status: 'Pago' },
  { id: 7, date: '2026-09-11', description: 'Licenças e ferramentas', category: 'Software', account: 'Cartão empresarial', type: 'expense', amount: 424.5, status: 'Pago' },
  { id: 8, date: '2026-09-12', description: 'Sistema administrativo', category: 'Projetos', account: 'Conta principal', type: 'income', amount: 7900, status: 'Recebido' },
  { id: 9, date: '2026-09-14', description: 'Contabilidade mensal', category: 'Administrativo', account: 'Conta principal', type: 'expense', amount: 740, status: 'Pago' },
  { id: 10, date: '2026-09-15', description: 'Manutenção recorrente', category: 'Serviços', account: 'Conta principal', type: 'income', amount: 1850, status: 'Recebido' },
  { id: 11, date: '2026-09-17', description: 'Equipamentos de escritório', category: 'Equipamentos', account: 'Cartão empresarial', type: 'expense', amount: 2190, status: 'Pendente' },
  { id: 12, date: '2026-09-18', description: 'Automação para cliente', category: 'Projetos', account: 'Conta principal', type: 'income', amount: 5200, status: 'Recebido' }
]

export const monthlyFlow = {
  labels: ['Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set'],
  income: [21800, 26300, 28900, 31500, 34600, 39150],
  expense: [14400, 16100, 17600, 19300, 20450, 18083]
}

export const accounts = [
  { name: 'Conta principal', bank: 'Operacional', balance: 48250.7, change: 12.4 },
  { name: 'Reserva empresarial', bank: 'Reserva', balance: 28740, change: 5.8 },
  { name: 'Caixa', bank: 'Disponível', balance: 6840, change: -2.1 }
]

export const cards = [
  { name: 'Corporate Black', ending: '4821', limit: 15000, used: 4983.4, close: '25 SET', due: '02 OUT' },
  { name: 'Business One', ending: '7310', limit: 9000, used: 2110.8, close: '29 SET', due: '06 OUT' }
]

export const goals = [
  { id: 1, name: 'Reserva operacional', current: 28740, target: 50000, deadline: 'Dez/2026' },
  { id: 2, name: 'Upgrade de equipamentos', current: 10600, target: 18000, deadline: 'Nov/2026' },
  { id: 3, name: 'Expansão comercial', current: 17200, target: 30000, deadline: 'Fev/2027' }
]
