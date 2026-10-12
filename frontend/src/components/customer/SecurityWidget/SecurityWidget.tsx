import React from 'react';
import { ShieldCheck } from 'lucide-react';
import styles from './SecurityWidget.module.scss';

export const SecurityWidget: React.FC = () => {
  return (
    <div className={styles.securityCard}>
      <div className={styles.iconWrapper}>
        <ShieldCheck size={22} className={styles.shieldIcon} />
      </div>
      <div className={styles.textContainer}>
        <h4 className={styles.title}>Your data is safe with us</h4>
        <p className={styles.description}>
          We use industry-standard security to keep your information protected.
        </p>
      </div>
    </div>
  );
};
export default SecurityWidget;
