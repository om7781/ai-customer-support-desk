import React, { useState } from 'react';
import { X, Send, Clock, User, Tag } from 'lucide-react';
import { useSupport } from '../../../context/SupportContext';
import type { TicketStatus } from '../../../types/ticket';
import styles from './TicketDetailModal.module.scss';

export const TicketDetailModal: React.FC = () => {
  const { selectedTicket, setSelectedTicket, addMessageToTicket } = useSupport();
  const [replyText, setReplyText] = useState('');

  if (!selectedTicket) return null;

  const handleClose = () => setSelectedTicket(null);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    addMessageToTicket(selectedTicket.id, replyText.trim());
    setReplyText('');
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

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="ticket-detail-title"
      >
        <div className={styles.modalHeader}>
          <div className={styles.titleInfo}>
            <div className={styles.badgeRow}>
              <span className={styles.ticketNumber}>{selectedTicket.ticketNumber}</span>
              <span className={`${styles.statusBadge} ${getStatusClass(selectedTicket.status)}`}>
                {getStatusLabel(selectedTicket.status)}
              </span>
              <span className={styles.priorityBadge}>
                {selectedTicket.priority.toUpperCase()} PRIORITY
              </span>
            </div>
            <h2 id="ticket-detail-title" className={styles.modalTitle}>
              {selectedTicket.title}
            </h2>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={handleClose}
            aria-label="Close details"
          >
            <X size={20} />
          </button>
        </div>

        <div className={styles.metaBar}>
          <div className={styles.metaItem}>
            <Clock size={15} />
            <span>Opened {selectedTicket.date} at {selectedTicket.time}</span>
          </div>
          <div className={styles.metaItem}>
            <User size={15} />
            <span>Customer: {selectedTicket.customerName}</span>
          </div>
          <div className={styles.metaItem}>
            <Tag size={15} />
            <span>Category: {selectedTicket.category}</span>
          </div>
        </div>

        <div className={styles.conversationBody}>
          <div className={styles.messageList}>
            {selectedTicket.messages && selectedTicket.messages.length > 0 ? (
              selectedTicket.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`${styles.messageBubble} ${
                    msg.sender === 'customer'
                      ? styles.customerMsg
                      : msg.sender === 'system'
                      ? styles.systemMsg
                      : styles.agentMsg
                  }`}
                >
                  <div className={styles.msgHeader}>
                    <span className={styles.senderName}>{msg.senderName}</span>
                    <span className={styles.msgTime}>{msg.timestamp}</span>
                  </div>
                  <p className={styles.msgText}>{msg.text}</p>
                </div>
              ))
            ) : (
              <div className={styles.initialDescBox}>
                <p className={styles.msgText}>{selectedTicket.description}</p>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSendReply} className={styles.replyFooter}>
          <input
            type="text"
            className={styles.replyInput}
            placeholder="Write a reply or follow-up note..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <button
            type="submit"
            className={styles.replyBtn}
            disabled={!replyText.trim()}
          >
            <Send size={16} />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
export default TicketDetailModal;
