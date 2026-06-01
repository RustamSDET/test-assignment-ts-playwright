export interface PaymentMethod {
  name: string;
  type: 'fiat' | 'crypto';
  id?: string;
  expectSuccess?: boolean;
}

export const paymentMethodsRU: PaymentMethod[] = [
  { name: 'Карты Банков РФ', type: 'fiat' },
  { name: 'Система быстрых платежей', type: 'fiat' }, 
  { name: 'Bitcoin', type: 'crypto', id: 'BTC' },
  { name: 'USDT (TRC20)', type: 'crypto', id: 'USDT.TRC20' }
];

export const paymentMethodsEN: PaymentMethod[] = [
  { name: 'Credit Card', type: 'fiat', id: 'stripe', expectSuccess: true },
  { name: 'Bitcoin', type: 'crypto', id: 'BTC', expectSuccess: true }
];
