import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Ticket, TicketCategory, TicketPriority, TicketMessage, TicketStatus } from '../../types/ticket';
import type { UserProfile } from '../../types/user';
import { initialTickets, currentUser } from '../../data/mockTickets';

export interface TicketsState {
  user: UserProfile;
  items: Ticket[];
}

const initialState: TicketsState = {
  user: currentUser,
  items: initialTickets,
};

export const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    setTickets: (state, action: PayloadAction<Ticket[]>) => {
      state.items = action.payload;
    },
    addTicket: (state, action: PayloadAction<Ticket>) => {
      // Prepend newly created ticket
      state.items.unshift(action.payload);
    },
    updateTicketClassification: (
      state,
      action: PayloadAction<{
        ticketId: string;
        category?: TicketCategory;
        priority?: TicketPriority;
      }>
    ) => {
      const { ticketId, category, priority } = action.payload;
      const ticket = state.items.find((t) => t.id === ticketId);
      if (ticket) {
        if (category) ticket.category = category;
        if (priority) ticket.priority = priority;
      }
    },
    updateTicketStatus: (
      state,
      action: PayloadAction<{ ticketId: string; status: TicketStatus }>
    ) => {
      const ticket = state.items.find((t) => t.id === action.payload.ticketId);
      if (ticket) {
        ticket.status = action.payload.status;
      }
    },
    addMessageToTicket: (
      state,
      action: PayloadAction<{ ticketId: string; message: TicketMessage }>
    ) => {
      const ticket = state.items.find((t) => t.id === action.payload.ticketId);
      if (ticket) {
        if (!ticket.messages) {
          ticket.messages = [];
        }
        ticket.messages.push(action.payload.message);
      }
    },
  },
});

export const {
  setTickets,
  addTicket,
  updateTicketClassification,
  updateTicketStatus,
  addMessageToTicket,
} = ticketsSlice.actions;

export default ticketsSlice.reducer;
