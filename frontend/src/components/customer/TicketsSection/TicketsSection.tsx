import React from 'react';
import type { TicketFilterTab } from '../../../types/ticket';
import { useSupport } from '../../../context/SupportContext';
import TicketItem from '../TicketItem/TicketItem';
import { Inbox, Plus } from 'lucide-react';
import styles from './TicketsSection.module.scss';

export const TicketsSection: React.FC = () => {
  const { filteredTickets, filter, setFilter, openCreateModal } = useSupport();

  const filterTabs: { id: TicketFilterTab; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'open', label: 'Open' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'resolved', label: 'Resolved' },
    { id: 'closed', label: 'Closed' },
  ];

  return (
    <section className={styles.sectionContainer}>
      <div className={styles.headerRow}>
        <div className={styles.titleInfo}>
          <h2 className={styles.sectionTitle}>Your Tickets</h2>
          <p className={styles.sectionSubtitle}>
            View and track the status of your support requests.
          </p>
        </div>

        <div className={styles.filterPills} role="tablist">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={filter === tab.id}
              className={`${styles.pillBtn} ${filter === tab.id ? styles.active : ''}`}
              onClick={() => setFilter(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.ticketsCard}>
        {filteredTickets.length > 0 ? (
          <div className={styles.ticketList}>
            {filteredTickets.map((ticket) => (
              <TicketItem key={ticket.id} ticket={ticket} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIconCircle}>
              <Inbox size={28} className={styles.emptyIcon} />
            </div>
            <h3 className={styles.emptyTitle}>No tickets found</h3>
            <p className={styles.emptySubtitle}>
              {filter === 'all'
                ? "You haven't submitted any tickets yet."
                : `No tickets currently in "${filter.replace('_', ' ')}" status.`}
            </p>
            <button
              type="button"
              className={styles.emptyActionBtn}
              onClick={openCreateModal}
            >
              <Plus size={16} />
              <span>Create New Ticket</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
export default TicketsSection;
