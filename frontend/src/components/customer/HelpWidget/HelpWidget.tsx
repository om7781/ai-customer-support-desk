import React from 'react';
import { Lightbulb, ArrowRight } from 'lucide-react';
import { useSupport } from '../../../context/SupportContext';
import styles from './HelpWidget.module.scss';

export const HelpWidget: React.FC = () => {
  const { openKnowledgeBase } = useSupport();

  return (
    <div className={styles.widgetCard}>
      <div className={styles.header}>
        <div className={styles.iconCircle}>
          <Lightbulb size={20} className={styles.bulbIcon} />
        </div>
        <h3 className={styles.title}>Need Help?</h3>
      </div>

      <p className={styles.description}>
        Check out our knowledge base for quick answers to common questions.
      </p>

      <button
        type="button"
        className={styles.linkButton}
        onClick={openKnowledgeBase}
      >
        <span>Visit Knowledge Base</span>
        <ArrowRight size={15} className={styles.arrow} />
      </button>
    </div>
  );
};
export default HelpWidget;
