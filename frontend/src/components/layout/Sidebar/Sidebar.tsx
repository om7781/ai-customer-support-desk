import React from 'react';
import {
  Home,
  Ticket as TicketIcon,
  PlusCircle,
  BookOpen,
  Headphones,
  ChevronRight,
  X,
} from 'lucide-react';
import { useSupport } from '../../../context/SupportContext';
import styles from './Sidebar.module.scss';

export const Sidebar: React.FC = () => {
  const {
    activeNav,
    setActiveNav,
    openCreateModal,
    openKnowledgeBase,
    openContactModal,
    isMobileSidebarOpen,
    closeMobileSidebar,
  } = useSupport();

  const handleNavClick = (id: string) => {
    setActiveNav(id);
    closeMobileSidebar();

    if (id === 'new-ticket') {
      openCreateModal();
    } else if (id === 'knowledge-base') {
      openKnowledgeBase();
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'tickets', label: 'My Tickets', icon: TicketIcon },
    { id: 'new-ticket', label: 'New Ticket', icon: PlusCircle },
    { id: 'knowledge-base', label: 'Knowledge Base', icon: BookOpen },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileSidebarOpen && (
        <div className={styles.backdrop} onClick={closeMobileSidebar} />
      )}

      <aside className={`${styles.sidebar} ${isMobileSidebarOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <div className={styles.brandWrapper}>
            <div className={styles.logoBadge}>
              {/* Wing/AI Icon */}
              <svg
                className={styles.wingIcon}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 2.98.97 4.29L1 21l4.71-1.97C7.02 19.64 8.46 20 12 20c5.52 0 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5zm4 4h-2v-2h2v2zm0-4h-2V7h2v5z" style={{display: 'none'}} />
                {/* Sleek superhero / bat wing custom SVG icon */}
                <path d="M12 3.5c-1.5 2-4 3.5-7 3.5 0 7 4 12 7 13.5 3-1.5 7-6.5 7-13.5-3 0-5.5-1.5-7-3.5zm-3.5 8c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm7 0c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5z" />
              </svg>
            </div>
            <div className={styles.brandInfo}>
              <h2 className={styles.brandTitle}>AI Support Desk</h2>
              <p className={styles.brandSubtitle}>We're here to help</p>
            </div>
          </div>
          <button
            className={styles.closeBtn}
            onClick={closeMobileSidebar}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className={styles.navMenu}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <div className={styles.navIconWrapper}>
                  <Icon size={19} className={styles.navIcon} />
                </div>
                <span className={styles.navLabel}>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.urgentHelpCard}
            onClick={() => {
              openContactModal();
              closeMobileSidebar();
            }}
          >
            <div className={styles.urgentLeft}>
              <div className={styles.urgentIconCircle}>
                <Headphones size={17} className={styles.headphoneIcon} />
              </div>
              <div className={styles.urgentText}>
                <span className={styles.urgentTitle}>Need urgent help?</span>
                <span className={styles.urgentSubtitle}>We're here 24/7</span>
              </div>
            </div>
            <ChevronRight size={16} className={styles.urgentArrow} />
          </button>
        </div>
      </aside>
    </>
  );
};
export default Sidebar;
