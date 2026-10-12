import React from 'react';
import { SupportProvider } from './context/SupportContext';
import Layout from './components/layout/Layout/Layout';
import CustomerDashboard from './components/customer/CustomerDashboard/CustomerDashboard';
import CreateTicketModal from './components/customer/CreateTicketModal/CreateTicketModal';
import TicketDetailModal from './components/customer/TicketDetailModal/TicketDetailModal';
import KnowledgeBaseModal from './components/customer/KnowledgeBaseModal/KnowledgeBaseModal';
import ContactModal from './components/customer/ContactModal/ContactModal';
import styles from './App.module.scss';

export const App: React.FC = () => {
  return (
    <SupportProvider>
      <div className={styles.appContainer}>
        <Layout>
          <CustomerDashboard />
        </Layout>

        {/* Global Modals */}
        <CreateTicketModal />
        <TicketDetailModal />
        <KnowledgeBaseModal />
        <ContactModal />
      </div>
    </SupportProvider>
  );
};

export default App;