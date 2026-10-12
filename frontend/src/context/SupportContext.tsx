import React, { createContext, useContext, useMemo } from 'react';
import type { Ticket, TicketFilterTab, TicketMessage, TicketStatus } from '../types/ticket';
import type { UserProfile } from '../types/user';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  setFilter as setFilterAction,
  setActiveNav as setActiveNavAction,
  setSearchQuery as setSearchQueryAction,
  setSelectedTicketId,
  openCreateModal as openCreateModalAction,
  closeCreateModal as closeCreateModalAction,
  openKnowledgeBase as openKnowledgeBaseAction,
  closeKnowledgeBase as closeKnowledgeBaseAction,
  openContactModal as openContactModalAction,
  closeContactModal as closeContactModalAction,
  toggleMobileSidebar as toggleMobileSidebarAction,
  closeMobileSidebar as closeMobileSidebarAction,
} from '../store/slices/uiSlice';
import {
  addTicket,
  updateTicketClassification,
  addMessageToTicket as addMessageAction,
} from '../store/slices/ticketsSlice';
import {
  useCreateTicketMutation,
  useSendTicketReplyMutation,
} from '../store/api/supportApi';

interface SupportContextType {
  user: UserProfile;
  tickets: Ticket[];
  filteredTickets: Ticket[];
  filter: TicketFilterTab;
  setFilter: (filter: TicketFilterTab) => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTicket: Ticket | null;
  setSelectedTicket: (ticket: Ticket | null) => void;
  isCreateModalOpen: boolean;
  openCreateModal: () => void;
  closeCreateModal: () => void;
  isKnowledgeBaseOpen: boolean;
  openKnowledgeBase: () => void;
  closeKnowledgeBase: () => void;
  isContactModalOpen: boolean;
  openContactModal: () => void;
  closeContactModal: () => void;
  isMobileSidebarOpen: boolean;
  toggleMobileSidebar: () => void;
  closeMobileSidebar: () => void;
  createTicket: (ticketData: {
    title: string;
    description: string;
    category?: Ticket['category'];
    priority?: Ticket['priority'];
  }) => Ticket;
  addMessageToTicket: (ticketId: string, messageText: string) => void;
  isSubmittingTicket: boolean;
}

const SupportContext = createContext<SupportContextType | undefined>(undefined);

export const SupportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();

  // State from Redux
  const user = useAppSelector((state) => state.tickets.user);
  const tickets = useAppSelector((state) => state.tickets.items);
  const {
    filter,
    activeNav,
    searchQuery,
    selectedTicketId,
    isCreateModalOpen,
    isKnowledgeBaseOpen,
    isContactModalOpen,
    isMobileSidebarOpen,
  } = useAppSelector((state) => state.ui);

  // RTK Query Mutations
  const [createTicketTrigger, { isLoading: isSubmittingTicket }] = useCreateTicketMutation();
  const [sendReplyTrigger] = useSendTicketReplyMutation();

  // Selected ticket derived dynamically so message updates reflect immediately in UI
  const selectedTicket = useMemo(() => {
    if (!selectedTicketId) return null;
    return tickets.find((t) => t.id === selectedTicketId) || null;
  }, [tickets, selectedTicketId]);

  const setSelectedTicket = (ticket: Ticket | null) => {
    dispatch(setSelectedTicketId(ticket ? ticket.id : null));
  };

  const openCreateModal = () => dispatch(openCreateModalAction());
  const closeCreateModal = () => dispatch(closeCreateModalAction());

  const openKnowledgeBase = () => dispatch(openKnowledgeBaseAction());
  const closeKnowledgeBase = () => dispatch(closeKnowledgeBaseAction());

  const openContactModal = () => dispatch(openContactModalAction());
  const closeContactModal = () => dispatch(closeContactModalAction());

  const toggleMobileSidebar = () => dispatch(toggleMobileSidebarAction());
  const closeMobileSidebar = () => dispatch(closeMobileSidebarAction());

  const setFilter = (newFilter: TicketFilterTab) => dispatch(setFilterAction(newFilter));
  const setActiveNav = (nav: string) => dispatch(setActiveNavAction(nav));
  const setSearchQuery = (query: string) => dispatch(setSearchQueryAction(query));

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      // Status filtering
      const matchesFilter = filter === 'all' ? true : ticket.status === filter;

      // Search query filtering
      const matchesSearch =
        searchQuery.trim() === ''
          ? true
          : ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [tickets, filter, searchQuery]);

  const createTicket = (ticketData: {
    title: string;
    description: string;
    category?: Ticket['category'];
    priority?: Ticket['priority'];
  }): Ticket => {
    const nextNumber = tickets.length + 1;
    const ticketNumber = `#TKT-${String(nextNumber).padStart(3, '0')}`;
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const formattedTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const newTicket: Ticket = {
      id: `tkt-${Date.now()}`,
      ticketNumber,
      title: ticketData.title,
      description: ticketData.description,
      category: ticketData.category || 'general',
      status: 'open' as TicketStatus,
      priority: ticketData.priority || 'medium',
      date: formattedDate,
      time: formattedTime,
      createdAt: now.toISOString(),
      customerName: user.name,
      customerEmail: user.email,
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'customer',
          senderName: user.name,
          text: ticketData.description,
          timestamp: `${formattedDate} · ${formattedTime}`,
        },
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'system',
          senderName: 'AI Support Assistant',
          text: 'Ticket has been logged. Our AI agent is currently analyzing your request and initiating resolution...',
          timestamp: `${formattedDate} · ${formattedTime}`,
        },
      ],
    };

    // 1. Immediately store in Redux for optimistic UI update
    dispatch(addTicket(newTicket));

    // 2. Dispatch to n8n webhook via RTK Query mutation
    createTicketTrigger({
      ticketNumber: newTicket.ticketNumber,
      title: newTicket.title,
      description: newTicket.description,
      customerName: newTicket.customerName,
      customerEmail: newTicket.customerEmail,
      createdAt: newTicket.createdAt,
      source: 'customer_support_portal',
    })
      .unwrap()
      .then((aiResponse) => {
        if (!aiResponse) return;

        // A. Update Category & Priority if classified by AI
        if (aiResponse.classifiedCategory || aiResponse.classifiedPriority) {
          dispatch(
            updateTicketClassification({
              ticketId: newTicket.id,
              category: aiResponse.classifiedCategory,
              priority: aiResponse.classifiedPriority,
            })
          );
        }

        // B. CRITICAL: Append the AI Agent's response message/solution to the chat!
        const aiMessageText =
          aiResponse.message ||
          aiResponse.suggestedSolution ||
          aiResponse.reply;

        if (aiMessageText && typeof aiMessageText === 'string') {
          const aiResponseTime = new Date();
          const responseDate = aiResponseTime.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });
          const responseTime = aiResponseTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          });

          const aiMessage: TicketMessage = {
            id: `msg-ai-${Date.now()}`,
            sender: 'agent',
            senderName: 'AI Support Agent',
            text: aiMessageText,
            timestamp: `${responseDate} · ${responseTime}`,
          };

          dispatch(
            addMessageAction({
              ticketId: newTicket.id,
              message: aiMessage,
            })
          );
        }
      })
      .catch((err) => {
        console.warn('Webhook dispatch notice (using local offline state):', err);
      });

    return newTicket;
  };

  const addMessageToTicket = (ticketId: string, messageText: string) => {
    if (!messageText.trim()) return;

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const formattedTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const newMessage: TicketMessage = {
      id: `msg-${Date.now()}`,
      sender: 'customer',
      senderName: user.name,
      text: messageText,
      timestamp: `${formattedDate} · ${formattedTime}`,
    };

    // 1. Add user reply to Redux
    dispatch(
      addMessageAction({
        ticketId,
        message: newMessage,
      })
    );

    // 2. Forward reply to webhook / n8n workflow
    const currentTicket = tickets.find((t) => t.id === ticketId);
    sendReplyTrigger({
      ticketId,
      ticketNumber: currentTicket?.ticketNumber,
      message: messageText,
      customerName: user.name,
      timestamp: now.toISOString(),
    })
      .unwrap()
      .then((response) => {
        // If AI or agent responds back to the follow-up message
        const replyText = response?.message || response?.reply || response?.suggestedSolution;
        if (replyText && typeof replyText === 'string') {
          const replyTime = new Date();
          dispatch(
            addMessageAction({
              ticketId,
              message: {
                id: `msg-ai-${Date.now()}`,
                sender: 'agent',
                senderName: 'AI Support Agent',
                text: replyText,
                timestamp: `${replyTime.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })} · ${replyTime.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}`,
              },
            })
          );
        }
      })
      .catch((err) => {
        console.warn('Reply webhook notice:', err);
      });
  };

  return (
    <SupportContext.Provider
      value={{
        user,
        tickets,
        filteredTickets,
        filter,
        setFilter,
        activeNav,
        setActiveNav,
        searchQuery,
        setSearchQuery,
        selectedTicket,
        setSelectedTicket,
        isCreateModalOpen,
        openCreateModal,
        closeCreateModal,
        isKnowledgeBaseOpen,
        openKnowledgeBase,
        closeKnowledgeBase,
        isContactModalOpen,
        openContactModal,
        closeContactModal,
        isMobileSidebarOpen,
        toggleMobileSidebar,
        closeMobileSidebar,
        createTicket,
        addMessageToTicket,
        isSubmittingTicket,
      }}
    >
      {children}
    </SupportContext.Provider>
  );
};

export const useSupport = () => {
  const context = useContext(SupportContext);
  if (!context) {
    throw new Error('useSupport must be used within a SupportProvider');
  }
  return context;
};
