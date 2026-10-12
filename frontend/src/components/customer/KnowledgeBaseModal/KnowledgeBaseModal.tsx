import React, { useState } from 'react';
import { X, Search, BookOpen, ChevronRight } from 'lucide-react';
import { useSupport } from '../../../context/SupportContext';
import styles from './KnowledgeBaseModal.module.scss';

export const KnowledgeBaseModal: React.FC = () => {
  const { isKnowledgeBaseOpen, closeKnowledgeBase, openCreateModal } = useSupport();
  const [searchTerm, setSearchTerm] = useState('');

  if (!isKnowledgeBaseOpen) return null;

  const articles = [
    {
      id: 'art-1',
      title: 'How do I reset my account password or MFA tokens?',
      category: 'Authentication',
      readTime: '3 min read',
      snippet: 'Navigate to Security settings and click "Reset Password". If MFA token is lost, contact support directly.',
    },
    {
      id: 'art-2',
      title: 'Understanding duplicate charges & billing cycles',
      category: 'Billing',
      readTime: '2 min read',
      snippet: 'Bank authorizations may temporarily display as duplicate charges before clearing within 48 business hours.',
    },
    {
      id: 'art-3',
      title: 'How to export your customer support tickets and logs',
      category: 'Data & Privacy',
      readTime: '4 min read',
      snippet: 'Download comprehensive CSV or JSON dumps of all communication history under Profile Settings > Privacy.',
    },
    {
      id: 'art-4',
      title: 'API Rate limits & webhook troubleshooting',
      category: 'Integrations',
      readTime: '5 min read',
      snippet: 'All outbound webhook dispatches to n8n include automatic retry triggers and cryptographic signature verification.',
    },
  ];

  const filtered = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.snippet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.modalOverlay} onClick={closeKnowledgeBase}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        <div className={styles.modalHeader}>
          <div className={styles.headerInfo}>
            <div className={styles.kbIconCircle}>
              <BookOpen size={20} />
            </div>
            <div>
              <h2 className={styles.modalTitle}>Knowledge Base</h2>
              <p className={styles.modalSubtitle}>
                Find quick answers, guides, and documentation.
              </p>
            </div>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={closeKnowledgeBase}
          >
            <X size={20} />
          </button>
        </div>

        <div className={styles.searchSection}>
          <div className={styles.searchBar}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search help articles, topics, or error messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        <div className={styles.articleList}>
          {filtered.map((item) => (
            <div key={item.id} className={styles.articleCard}>
              <div className={styles.articleHeader}>
                <span className={styles.categoryBadge}>{item.category}</span>
                <span className={styles.readTime}>{item.readTime}</span>
              </div>
              <h3 className={styles.articleTitle}>{item.title}</h3>
              <p className={styles.articleSnippet}>{item.snippet}</p>
            </div>
          ))}
        </div>

        <div className={styles.modalFooter}>
          <span>Still couldn't find what you need?</span>
          <button
            type="button"
            className={styles.raiseTicketBtn}
            onClick={() => {
              closeKnowledgeBase();
              openCreateModal();
            }}
          >
            <span>Raise a Ticket</span>
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
export default KnowledgeBaseModal;
