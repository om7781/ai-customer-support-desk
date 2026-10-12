import { API_CONFIG } from '../config/api';
import type { Ticket, TicketCategory, TicketPriority } from '../types/ticket';

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
  classifiedCategory?: TicketCategory;
  classifiedPriority?: TicketPriority;
  suggestedSolution?: string;
  [key: string]: unknown;
}

/**
 * Service to dispatch customer queries to the n8n webhook workflow
 */
export const webhookService = {
  /**
   * Forwards the customer complaint / query to the n8n webhook
   */
  async forwardTicketQuery(ticket: Ticket): Promise<WebhookAIResponse | null> {
    const url = API_CONFIG.ENDPOINTS.POST.CREATE_TICKET;

    if (!url) {
      console.warn('No CREATE_TICKET webhook URL configured.');
      return null;
    }

    const payload: WebhookTicketPayload = {
      ticketNumber: ticket.ticketNumber,
      title: ticket.title,
      description: ticket.description,
      customerName: ticket.customerName,
      customerEmail: ticket.customerEmail,
      createdAt: ticket.createdAt,
      source: 'customer_support_portal',
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.warn(
          `n8n webhook responded with status ${response.status}: ${response.statusText}`
        );
        return null;
      }

      // Try to parse json response if n8n responds with data
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return (await response.json()) as WebhookAIResponse;
      }

      return { success: true };
    } catch (error) {
      console.error('Error forwarding ticket query to n8n webhook:', error);
      // We don't block the UI if the webhook is temporarily offline or unreached
      return null;
    }
  },

  /**
   * Forwards customer message / reply to n8n
   */
  async forwardTicketReply(ticketId: string, messageText: string, customerName: string) {
    const url = API_CONFIG.ENDPOINTS.POST.SEND_TICKET_REPLY;
    if (!url) return null;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId,
          message: messageText,
          customerName,
          timestamp: new Date().toISOString(),
        }),
      });
      return response.ok;
    } catch (error) {
      console.error('Error forwarding reply to n8n:', error);
      return false;
    }
  },
};

export default webhookService;
