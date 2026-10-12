import React, { useState } from 'react';
import { X, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { useSupport } from '../../../context/SupportContext';
import styles from './CreateTicketModal.module.scss';

export const CreateTicketModal: React.FC = () => {
  const { isCreateModalOpen, closeCreateModal, createTicket } = useSupport();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successTicketId, setSuccessTicketId] = useState<string | null>(null);

  if (!isCreateModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);

    // Simulate async submission (will integrate with n8n webhook seamlessly)
    setTimeout(() => {
      const ticket = createTicket({
        title: title.trim(),
        description: description.trim(),
      });

      setIsSubmitting(false);
      setSuccessTicketId(ticket.ticketNumber);

      // Auto close after brief success message
      setTimeout(() => {
        setSuccessTicketId(null);
        setTitle('');
        setDescription('');
        closeCreateModal();
      }, 1500);
    }, 600);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setSuccessTicketId(null);
      closeCreateModal();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="modal-title"
      >
        <div className={styles.modalHeader}>
          <div>
            <h2 id="modal-title" className={styles.modalTitle}>
              Create a Support Ticket
            </h2>
            <p className={styles.modalSubtitle}>
              Fill in the details below and our team will get right on it.
            </p>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={handleClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {successTicketId ? (
          <div className={styles.successState}>
            <CheckCircle2 size={54} className={styles.successIcon} />
            <h3 className={styles.successTitle}>Ticket Raised Successfully!</h3>
            <p className={styles.successMessage}>
              Your ticket reference is <strong>{successTicketId}</strong>. We've routed it to our support queue.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.ticketForm}>
            <div className={styles.formGroup}>
              <label htmlFor="ticket-title" className={styles.label}>
                Issue Subject / Title <span className={styles.required}>*</span>
              </label>
              <input
                id="ticket-title"
                type="text"
                className={styles.input}
                placeholder="e.g. Cannot access invoice download page"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="ticket-desc" className={styles.label}>
                Detailed Description <span className={styles.required}>*</span>
              </label>
              <textarea
                id="ticket-desc"
                rows={5}
                className={styles.textarea}
                placeholder="Please describe what happened, steps to reproduce, or any error messages..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className={styles.aiTagNotice}>
              <Sparkles size={16} className={styles.sparkleIcon} />
              <span>
                <strong>AI Auto-Triage & Classification:</strong> Our n8n AI agent will automatically assess priority urgency and classify the ticket category based on your description.
              </span>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isSubmitting || !title.trim() || !description.trim()}
              >
                <Send size={16} />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Ticket'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
export default CreateTicketModal;
