import React, { createContext, useContext, useState, useMemo } from 'react';
import type { Ticket, TicketFilterTab, TicketStatus } from '../types/ticket';
import type { UserProfile } from '../types/user';
import { initialTickets, currentUser } from '../data/mockTickets';
import webhookService from '../services/webhookService';

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
}

const SupportContext = createContext<SupportContextType | undefined>(undefined);

export const SupportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user] = useState<UserProfile>(currentUser);
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [filter, setFilter] = useState<TicketFilterTab>('all');
  const [activeNav, setActiveNav] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isKnowledgeBaseOpen, setIsKnowledgeBaseOpen] = useState<boolean>(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const openKnowledgeBase = () => setIsKnowledgeBaseOpen(true);
  const closeKnowledgeBase = () => setIsKnowledgeBaseOpen(false);

  const openContactModal = () => setIsContactModalOpen(true);
  const closeContactModal = () => setIsContactModalOpen(false);

  const toggleMobileSidebar = () => setIsMobileSidebarOpen((prev) => !prev);
  const closeMobileSidebar = () => setIsMobileSidebarOpen(false);

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      // Status filtering
      const matchesFilter = filter === 'all' ? true : ticket.status === filter;

      // Search query filtering
      const matchesSearch = searchQuery.trim() === ''
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
          text: 'Ticket has been raised successfully. Our support squad and automated workflows have been notified.',
          timestamp: `${formattedDate} · ${formattedTime}`,
        },
      ],
    };

    setTickets((prev) => [newTicket, ...prev]);

    // Asynchronously dispatch to n8n webhook for AI triage and processing
    webhookService.forwardTicketQuery(newTicket).then((aiResponse) => {
      if (aiResponse && (aiResponse.classifiedCategory || aiResponse.classifiedPriority)) {
        setTickets((prev) =>
          prev.map((t) =>
            t.id === newTicket.id
              ? {
                  ...t,
                  category: aiResponse.classifiedCategory || t.category,
                  priority: aiResponse.classifiedPriority || t.priority,
                }
              : t
          )
        );
      }
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

    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: 'customer' as const,
      senderName: user.name,
      text: messageText,
      timestamp: `${formattedDate} · ${formattedTime}`,
    };

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            messages: [...(t.messages || []), newMessage],
          };
        }
        return t;
      })
    );

    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket((prev) =>
        prev
          ? {
              ...prev,
              messages: [...(prev.messages || []), newMessage],
            }
          : null
      );
    }
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
