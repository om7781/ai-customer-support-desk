import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '../../config/api';
import type { Ticket, TicketCategory, TicketPriority } from '../../types/ticket';

export interface WebhookTicketPayload {
  ticketNumber: string;
  title: string;
  description: string;
  customerName: string;
  customerEmail: string;
  createdAt: string;
  source: string;
}

export interface WebhookAIResponse {
  success?: boolean;
  message?: string;
  reply?: string;
  classifiedCategory?: TicketCategory;
  classifiedPriority?: TicketPriority;
  suggestedSolution?: string;
  [key: string]: unknown;
}

export interface SendReplyPayload {
  ticketId: string;
  ticketNumber?: string;
  message: string;
  customerName: string;
  timestamp: string;
}

export const supportApi = createApi({
  reducerPath: 'supportApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.BASE_URL,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      headers.set('Accept', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Tickets', 'Ticket'],
  endpoints: (builder) => ({
    // 1. Fetch tickets (from n8n workflow or backend connected to MongoDB)
    getTickets: builder.query<Ticket[], void>({
      query: () => {
        const endpoint = API_CONFIG.ENDPOINTS.GET.GET_TICKETS;
        return endpoint || '/api/tickets';
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Ticket' as const, id })),
              { type: 'Tickets', id: 'LIST' },
            ]
          : [{ type: 'Tickets', id: 'LIST' }],
    }),

    // 2. Submit ticket to n8n webhook (Trigger AI Agent triage & MongoDB save)
    createTicket: builder.mutation<WebhookAIResponse, WebhookTicketPayload>({
      query: (payload) => ({
        url: API_CONFIG.ENDPOINTS.POST.CREATE_TICKET,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'Tickets', id: 'LIST' }],
    }),

    // 3. Send message/reply to ongoing ticket
    sendTicketReply: builder.mutation<WebhookAIResponse, SendReplyPayload>({
      query: (payload) => ({
        url: API_CONFIG.ENDPOINTS.POST.SEND_TICKET_REPLY || '/api/tickets/reply',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: (_result, _error, { ticketId }) => [
        { type: 'Ticket', id: ticketId },
      ],
    }),
  }),
});

export const {
  useGetTicketsQuery,
  useLazyGetTicketsQuery,
  useCreateTicketMutation,
  useSendTicketReplyMutation,
} = supportApi;
