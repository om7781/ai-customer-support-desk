import React from 'react';
import {
  Plus,
  BookOpen,
  Ticket as TicketIcon,
  Headphones,
  ChevronRight,
} from 'lucide-react';
import { useSupport } from '../../../context/SupportContext';
import styles from './QuickActions.module.scss';

export const QuickActions: React.FC = () => {
  const { openCreateModal, openKnowledgeBase, openContactModal, setFilter } = useSupport();

  const actions = [
    {
      id: 'create-ticket',
      title: 'Create a New Ticket',
      subtitle: 'Get help with your issue',
      icon: Plus,
      onClick: openCreateModal,
    },
    {
      id: 'view-kb',
      title: 'View Knowledge Base',
      subtitle: 'Find answers to common questions',
      icon: BookOpen,
      onClick: openKnowledgeBase,
    },
    {
      id: 'track-tickets',
      title: 'Track Your Tickets',
      subtitle: 'Check the status of your requests',
      icon: TicketIcon,
      onClick: () => {
        setFilter('all');
        const element = document.getElementById('your-tickets-anchor');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      },
    },
    {
      id: 'contact-support',
      title: 'Contact Support',
      subtitle: 'Talk to our team directly',
      icon: Headphones,
      onClick: openContactModal,
    },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>Quick Actions</h2>
      <div className={styles.actionList}>
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              type="button"
              className={styles.actionCard}
              onClick={action.onClick}
            >
              <div className={styles.iconCircle}>
                <Icon size={18} className={styles.actionIcon} />
              </div>
              <div className={styles.textWrapper}>
                <span className={styles.actionTitle}>{action.title}</span>
                <span className={styles.actionSubtitle}>{action.subtitle}</span>
              </div>
              <ChevronRight size={17} className={styles.chevron} />
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default QuickActions;
