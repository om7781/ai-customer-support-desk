/**
 * API Configuration & Webhook Endpoints
 * 
 * Centralised location for all backend/n8n webhook URLs.
 * URLs can be overridden via environment variables in `.env` (e.g. VITE_N8N_WEBHOOK_CREATE_TICKET).
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5678',

  ENDPOINTS: {
    /**
     * POST Endpoints (Outgoing triggers / forward query to n8n)
     */
    POST: {
      // Main webhook for customer ticket queries (for AI classification and routing)
      CREATE_TICKET:
        import.meta.env.VITE_N8N_WEBHOOK_CREATE_TICKET ||
        'http://localhost:5678/webhook-test/1734f03e-98da-4a66-ae50-40ff329619a0',

      // Webhook for customer sending a message or reply on an existing ticket
      SEND_TICKET_REPLY:
        import.meta.env.VITE_N8N_WEBHOOK_SEND_REPLY || '',
    },

    /**
     * GET Endpoints (Fetching data from n8n workflows or database)
     */
    GET: {
      // Retrieve list of tickets
      GET_TICKETS:
        import.meta.env.VITE_N8N_WEBHOOK_GET_TICKETS || '',

      // Retrieve specific ticket status by ID or ticket number
      GET_TICKET_BY_ID: (ticketId: string) =>
        `${import.meta.env.VITE_N8N_WEBHOOK_GET_TICKETS || ''}/${ticketId}`,
    },
  },
} as const;

export default API_CONFIG;
