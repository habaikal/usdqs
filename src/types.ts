
export interface User {
  username: string;
  password?: string; // Not stored in context after login for security
}

export interface Transaction {
  id: string;
  type: 'purchase' | 'sell' | 'transfer_sent' | 'transfer_received';
  amount: number;
  from: string; // 'system' for purchases/sells
  to: string;
  timestamp: string;
}

export interface Account {
  username: string;
  balance: number;
  transactions: Transaction[];
}