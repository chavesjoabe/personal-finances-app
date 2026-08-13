import { MemberResponse, CategoryResponse, TransactionResponse } from "../types";

const STORAGE_KEY_MEMBERS = "pf_app_members";
const STORAGE_KEY_CATEGORIES = "pf_app_categories";
const STORAGE_KEY_TRANSACTIONS = "pf_app_transactions";

const initialMembers: MemberResponse[] = [
  { _id: "member-1", name: "Marta", color: "#E91E63", active: true },
  { _id: "member-2", name: "Joabe", color: "#1976D2", active: true },
];

const initialCategories: CategoryResponse[] = [
  // Receitas
  { _id: "cat-1", name: "Salário", type: "INCOME", color: "#4CAF50", isSystem: true, active: true },
  { _id: "cat-2", name: "Vale Alimentação / Refeição", type: "INCOME", color: "#8BC34A", isSystem: true, active: true },
  { _id: "cat-3", name: "Reembolso", type: "INCOME", color: "#009688", isSystem: true, active: true },
  { _id: "cat-4", name: "Bônus / PLR", type: "INCOME", color: "#00BCD4", isSystem: true, active: true },
  { _id: "cat-5", name: "Outras Receitas", type: "INCOME", color: "#03A9F4", isSystem: true, active: true },

  // Despesas
  { _id: "cat-6", name: "Dízimo", type: "EXPENSE", color: "#9C27B0", isSystem: true, active: true },
  { _id: "cat-7", name: "Oferta / Compromisso", type: "EXPENSE", color: "#673AB7", isSystem: true, active: true },
  { _id: "cat-8", name: "Cartão de Crédito", type: "EXPENSE", color: "#ED7D31", isSystem: true, active: true },
  { _id: "cat-9", name: "Cartão Loja", type: "EXPENSE", color: "#FF9800", isSystem: true, active: true },
  { _id: "cat-10", name: "Taxa de Condomínio", type: "EXPENSE", color: "#795548", isSystem: true, active: true },
  { _id: "cat-11", name: "Aluguel / Financiamento", type: "EXPENSE", color: "#607D8B", isSystem: true, active: true },
  { _id: "cat-12", name: "Internet", type: "EXPENSE", color: "#2196F3", isSystem: true, active: true },
  { _id: "cat-13", name: "Despesas com Carro", type: "EXPENSE", color: "#F44336", isSystem: true, active: true },
  { _id: "cat-14", name: "Energia Elétrica", type: "EXPENSE", color: "#FFC107", isSystem: true, active: true },
  { _id: "cat-15", name: "Outras Despesas", type: "EXPENSE", color: "#9E9E9E", isSystem: true, active: true },

  // Reservas
  { _id: "cat-16", name: "Reserva de Emergência", type: "SAVINGS", color: "#3F51B5", isSystem: true, active: true },
  { _id: "cat-17", name: "Fundo de Investimento", type: "SAVINGS", color: "#1A237E", isSystem: true, active: true },
];

const initialTransactions: TransactionResponse[] = [
  // Agosto 2026 - 1ª Quinzena (1º Período)
  {
    _id: "tx-1",
    memberId: "member-1",
    categoryId: "cat-1",
    type: "INCOME",
    description: "Salário 1ª quinzena",
    amount: 3500.0,
    year: 2026,
    month: 8,
    period: "FIRST_HALF",
    status: "PAID",
    paidAt: "2026-08-05T10:00:00Z",
    copiedFrom: null,
  },
  {
    _id: "tx-2",
    memberId: "member-2",
    categoryId: "cat-1",
    type: "INCOME",
    description: "Salário 1ª quinzena",
    amount: 3800.0,
    year: 2026,
    month: 8,
    period: "FIRST_HALF",
    status: "PAID",
    paidAt: "2026-08-05T10:00:00Z",
    copiedFrom: null,
  },
  {
    _id: "tx-3",
    memberId: "member-1",
    categoryId: "cat-6",
    type: "EXPENSE",
    description: "Dízimo mensal",
    amount: 350.0,
    year: 2026,
    month: 8,
    period: "FIRST_HALF",
    status: "PAID",
    paidAt: "2026-08-06T12:00:00Z",
    copiedFrom: null,
  },
  {
    _id: "tx-4",
    memberId: "member-2",
    categoryId: "cat-11",
    type: "EXPENSE",
    description: "Aluguel do apartamento",
    amount: 2200.0,
    year: 2026,
    month: 8,
    period: "FIRST_HALF",
    status: "PAID",
    paidAt: "2026-08-08T09:00:00Z",
    copiedFrom: null,
  },
  {
    _id: "tx-5",
    memberId: "member-1",
    categoryId: "cat-12",
    type: "EXPENSE",
    description: "Internet Fibra 500MB",
    amount: 149.9,
    year: 2026,
    month: 8,
    period: "FIRST_HALF",
    status: "PENDING",
    paidAt: null,
    copiedFrom: null,
  },
  {
    _id: "tx-6",
    memberId: "member-2",
    categoryId: "cat-16",
    type: "SAVINGS",
    description: "Depósito reserva mensal",
    amount: 800.0,
    year: 2026,
    month: 8,
    period: "FIRST_HALF",
    status: "PAID",
    paidAt: "2026-08-05T14:00:00Z",
    copiedFrom: null,
  },

  // Agosto 2026 - 2ª Quinzena (2º Período)
  {
    _id: "tx-7",
    memberId: "member-1",
    categoryId: "cat-1",
    type: "INCOME",
    description: "Salário 2ª quinzena",
    amount: 3500.0,
    year: 2026,
    month: 8,
    period: "SECOND_HALF",
    status: "PENDING",
    paidAt: null,
    copiedFrom: null,
  },
  {
    _id: "tx-8",
    memberId: "member-2",
    categoryId: "cat-1",
    type: "INCOME",
    description: "Salário 2ª quinzena",
    amount: 3800.0,
    year: 2026,
    month: 8,
    period: "SECOND_HALF",
    status: "PENDING",
    paidAt: null,
    copiedFrom: null,
  },
  {
    _id: "tx-9",
    memberId: "member-1",
    categoryId: "cat-8",
    type: "EXPENSE",
    description: "Fatura Cartão Nubank",
    amount: 1770.0,
    year: 2026,
    month: 8,
    period: "SECOND_HALF",
    status: "PENDING",
    paidAt: null,
    copiedFrom: null,
  },
  {
    _id: "tx-10",
    memberId: "member-2",
    categoryId: "cat-10",
    type: "EXPENSE",
    description: "Taxa de Condomínio",
    amount: 650.0,
    year: 2026,
    month: 8,
    period: "SECOND_HALF",
    status: "PENDING",
    paidAt: null,
    copiedFrom: null,
  },
  {
    _id: "tx-11",
    memberId: "member-1",
    categoryId: "cat-14",
    type: "EXPENSE",
    description: "Conta de luz",
    amount: 230.5,
    year: 2026,
    month: 8,
    period: "SECOND_HALF",
    status: "PENDING",
    paidAt: null,
    copiedFrom: null,
  },
  {
    _id: "tx-12",
    memberId: "member-1",
    categoryId: "cat-17",
    type: "SAVINGS",
    description: "Aporte fundo de investimento",
    amount: 1000.0,
    year: 2026,
    month: 8,
    period: "SECOND_HALF",
    status: "PENDING",
    paidAt: null,
    copiedFrom: null,
  },
];

function getStored<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error);
  }
}

// Initialize localStorage if empty
if (!localStorage.getItem(STORAGE_KEY_MEMBERS)) {
  setStored(STORAGE_KEY_MEMBERS, initialMembers);
}
if (!localStorage.getItem(STORAGE_KEY_CATEGORIES)) {
  setStored(STORAGE_KEY_CATEGORIES, initialCategories);
}
if (!localStorage.getItem(STORAGE_KEY_TRANSACTIONS)) {
  setStored(STORAGE_KEY_TRANSACTIONS, initialTransactions);
}

export const mockDatabase = {
  getMembers: (): MemberResponse[] => getStored(STORAGE_KEY_MEMBERS, initialMembers),
  saveMembers: (members: MemberResponse[]): void => setStored(STORAGE_KEY_MEMBERS, members),

  getCategories: (): CategoryResponse[] => getStored(STORAGE_KEY_CATEGORIES, initialCategories),
  saveCategories: (categories: CategoryResponse[]): void => setStored(STORAGE_KEY_CATEGORIES, categories),

  getTransactions: (): TransactionResponse[] => getStored(STORAGE_KEY_TRANSACTIONS, initialTransactions),
  saveTransactions: (transactions: TransactionResponse[]): void => setStored(STORAGE_KEY_TRANSACTIONS, transactions),
};

export default mockDatabase;
