import React from 'react';
import {
  Monitor,
  CreditCard,
  Settings,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import type { Ticket, TicketCategory, TicketStatus } from '../../../types/ticket';
import { useSupport } from '../../../context/SupportContext';
import styles from './TicketItem.module.scss';

interface TicketItemProps {
  ticket: Ticket;
}

export const TicketItem: React.FC<TicketItemProps> = ({ ticket }) => {
  const { setSelectedTicket } = useSupport();

  const getCategoryConfig = (category: TicketCategory) => {
    switch (category) {
      case 'login':
        return {
          icon: Monitor,
          className: styles.catLogin,
        };
      case 'billing':
        return {
          icon: CreditCard,
          className: styles.catBilling,
        };
      case 'feature':
        return {
          icon: CreditCard,
          className: styles.catFeature,
        };
      case 'payment':
        return {
          icon: CreditCard,
          className: styles.catPayment,
        };
      case 'account':
        return {
          icon: Settings,
          className: styles.catAccount,
        };
      default:
        return {
          icon: HelpCircle,
          className: styles.catLogin,
        };
    }
  };

  const getStatusLabel = (status: TicketStatus) => {
    switch (status) {
      case 'open':
        return 'Open';
      case 'in_progress':
        return 'In Progress';
      case 'resolved':
        return 'Resolved';
      case 'closed':
        return 'Closed';
    }
  };

  const getStatusClass = (status: TicketStatus) => {
    switch (status) {
      case 'open':
        return styles.statusOpen;
      case 'in_progress':
        return styles.statusInProgress;
      case 'resolved':
        return styles.statusResolved;
      case 'closed':
        return styles.statusClosed;
    }
  };

  const { icon: CategoryIcon, className: catClass } = getCategoryConfig(ticket.category);

  return (
    <div
      className={styles.ticketRow}
      onClick={() => setSelectedTicket(ticket)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          setSelectedTicket(ticket);
        }
      }}
    >
      <div className={`${styles.iconBadge} ${catClass}`}>
        <CategoryIcon size={20} />
      </div>

      <div className={styles.detailsCol}>
        <div className={styles.titleRow}>
          <h3 className={styles.ticketTitle}>{ticket.title}</h3>
        </div>
        <p className={styles.ticketDescription}>{ticket.description}</p>
        <span className={styles.ticketNumber}>{ticket.ticketNumber}</span>
      </div>

      <div className={styles.metaCol}>
        <span className={`${styles.statusBadge} ${getStatusClass(ticket.status)}`}>
          {getStatusLabel(ticket.status)}
        </span>
        <span className={styles.timestamp}>
          {ticket.date} · {ticket.time}
        </span>
      </div>

      <div className={styles.arrowCol}>
        <ChevronRight size={18} className={styles.chevron} />
      </div>
    </div>
  );
};
export default TicketItem;
