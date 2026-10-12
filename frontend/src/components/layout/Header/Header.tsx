import React, { useState, useRef, useEffect } from 'react';
import { Menu, ChevronDown, User, Shield, LogOut } from 'lucide-react';
import { useSupport } from '../../../context/SupportContext';
import styles from './Header.module.scss';

export const Header: React.FC = () => {
  const { user, toggleMobileSidebar } = useSupport();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <button
          type="button"
          className={styles.mobileMenuBtn}
          onClick={toggleMobileSidebar}
          aria-label="Open navigation menu"
        >
          <Menu size={22} />
        </button>
      </div>

      <div className={styles.rightSection} ref={dropdownRef}>
        <button
          type="button"
          className={styles.userProfileBtn}
          onClick={() => setDropdownOpen((prev) => !prev)}
          aria-expanded={dropdownOpen}
        >
          <div className={styles.avatar}>
            <span>{user.initials}</span>
          </div>
          <span className={styles.userName}>{user.name}</span>
          <ChevronDown
            size={16}
            className={`${styles.chevron} ${dropdownOpen ? styles.rotate : ''}`}
          />
        </button>

        {dropdownOpen && (
          <div className={styles.dropdownMenu}>
            <div className={styles.dropdownHeader}>
              <div className={styles.menuAvatar}>{user.initials}</div>
              <div className={styles.menuUserDetails}>
                <p className={styles.menuName}>{user.name}</p>
                <p className={styles.menuEmail}>{user.email}</p>
                <span className={styles.roleBadge}>Customer Account</span>
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.dropdownItems}>
              <button
                type="button"
                className={styles.menuItem}
                onClick={() => setDropdownOpen(false)}
              >
                <User size={16} className={styles.itemIcon} />
                <span>Profile Settings</span>
              </button>
              <button
                type="button"
                className={styles.menuItem}
                onClick={() => setDropdownOpen(false)}
              >
                <Shield size={16} className={styles.itemIcon} />
                <span>Security & Privacy</span>
              </button>
            </div>

            <div className={styles.divider} />

            <button
              type="button"
              className={`${styles.menuItem} ${styles.logoutItem}`}
              onClick={() => setDropdownOpen(false)}
            >
              <LogOut size={16} className={styles.itemIcon} />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
export default Header;
