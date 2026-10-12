import React from 'react';
import HeroBanner from '../HeroBanner/HeroBanner';
import CreateTicketCard from '../CreateTicketCard/CreateTicketCard';
import TicketsSection from '../TicketsSection/TicketsSection';
import QuickActions from '../QuickActions/QuickActions';
import HelpWidget from '../HelpWidget/HelpWidget';
import SecurityWidget from '../SecurityWidget/SecurityWidget';
import styles from './CustomerDashboard.module.scss';

export const CustomerDashboard: React.FC = () => {
  return (
    <div className={styles.dashboardGrid}>
      {/* Primary Left / Center Section */}
      <div className={styles.primaryColumn}>
        <HeroBanner />
        <CreateTicketCard />
        <div id="your-tickets-anchor">
          <TicketsSection />
        </div>
      </div>

      {/* Secondary Right Aside Panel */}
      <aside className={styles.secondaryColumn} aria-label="Customer quick actions and support resources">
        <QuickActions />
        <HelpWidget />
        <SecurityWidget />
      </aside>
    </div>
  );
};
export default CustomerDashboard;
