export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export type TicketCategory =
  | 'login'
  | 'billing'
  | 'feature'
  | 'payment'
  | 'account'
  | 'general';

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TicketMessage {
  id: string;
  sender: 'customer' | 'agent' | 'system';
  senderName: string;
  avatar?: string;
  text: string;
  timestamp: string;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  category: TicketCategory;
  status: TicketStatus;
  priority: TicketPriority;
  date: string;
  time: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  messages?: TicketMessage[];
}

export type TicketFilterTab = 'all' | 'open' | 'in_progress' | 'resolved' | 'closed';
