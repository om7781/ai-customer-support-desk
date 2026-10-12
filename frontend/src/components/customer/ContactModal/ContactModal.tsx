import React from 'react';
import { X, Headphones, Phone, Mail, MessageSquare, Clock } from 'lucide-react';
import { useSupport } from '../../../context/SupportContext';
import styles from './ContactModal.module.scss';

export const ContactModal: React.FC = () => {
  const { isContactModalOpen, closeContactModal, openCreateModal } = useSupport();

  if (!isContactModalOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={closeContactModal}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        <div className={styles.modalHeader}>
          <div className={styles.headerInfo}>
            <div className={styles.iconCircle}>
              <Headphones size={20} />
            </div>
            <div>
              <h2 className={styles.modalTitle}>Contact Support</h2>
              <p className={styles.modalSubtitle}>We are here 24/7 to resolve your complaints.</p>
            </div>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={closeContactModal}
          >
            <X size={20} />
          </button>
        </div>

        <div className={styles.contactBody}>
          <div className={styles.availabilityBanner}>
            <div className={styles.statusDot} />
            <span>Support Team is currently online · Average response time: &lt; 5 mins</span>
          </div>

          <div className={styles.channelGrid}>
            <div className={styles.channelCard}>
              <div className={styles.channelIcon}>
                <MessageSquare size={20} />
              </div>
              <h3 className={styles.channelTitle}>Create Ticket</h3>
              <p className={styles.channelDesc}>
                Best for detailed bug reports, billing issues, or feature requests.
              </p>
              <button
                type="button"
                className={styles.channelBtn}
                onClick={() => {
                  closeContactModal();
                  openCreateModal();
                }}
              >
                Open Ticket Form
              </button>
            </div>

            <div className={styles.channelCard}>
              <div className={styles.channelIcon}>
                <Mail size={20} />
              </div>
              <h3 className={styles.channelTitle}>Direct Email</h3>
              <p className={styles.channelDesc}>
                Reach our enterprise desk at support@desk.ai for priority routing.
              </p>
              <a href="mailto:support@desk.ai" className={styles.channelLink}>
                support@desk.ai
              </a>
            </div>

            <div className={styles.channelCard}>
              <div className={styles.channelIcon}>
                <Phone size={20} />
              </div>
              <h3 className={styles.channelTitle}>Phone Hotline</h3>
              <p className={styles.channelDesc}>
                Toll-free 24/7 hotline for critical production outages.
              </p>
              <a href="tel:+18005550199" className={styles.channelLink}>
                +1 (800) 555-0199
              </a>
            </div>

            <div className={styles.channelCard}>
              <div className={styles.channelIcon}>
                <Clock size={20} />
              </div>
              <h3 className={styles.channelTitle}>Hours of Operation</h3>
              <p className={styles.channelDesc}>
                24 hours a day, 7 days a week, 365 days a year with worldwide squads.
              </p>
              <span className={styles.hoursBadge}>Active 24/7/365</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ContactModal;
