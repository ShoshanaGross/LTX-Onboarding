import React from 'react';
import LightricksLogo from '../assets/lightricksLogo.svg';
import styles from './Layout.module.scss';

export const Layout = ({ children, userImage }: { children: React.ReactNode, userImage?: string }) => (
  <div className={styles.layout}>
    <header className={styles.mainHeader}>
      <img src={LightricksLogo} alt="Lightricks" className={styles.lightricksIcon} />
      <img src={userImage} alt="current user" className={styles.currentUserImage} />
    </header>
    <div className={styles.app}>{children}</div>
  </div>
); 