import React from 'react';
import { Plus, ArrowRight } from 'lucide-react';
import { useSupport } from '../../../context/SupportContext';
import styles from './CreateTicketCard.module.scss';

export const CreateTicketCard: React.FC = () => {
  const { openCreateModal } = useSupport();

  return (
    <div className={styles.cardContainer}>
      <div className={styles.leftContent}>
        <div className={styles.iconCircle}>
          <Plus size={24} className={styles.plusIcon} />
        </div>
        <div className={styles.textWrapper}>
          <h2 className={styles.title}>Create a New Ticket</h2>
          <p className={styles.subtitle}>
            Facing an issue? Let us know and we'll help you out.
          </p>
        </div>
      </div>

      <button
        type="button"
        className={styles.createButton}
        onClick={openCreateModal}
        id="btn-create-ticket-banner"
      >
        <span>Create Ticket</span>
        <ArrowRight size={17} className={styles.arrowIcon} />
      </button>
    </div>
  );
};
export default CreateTicketCard;
