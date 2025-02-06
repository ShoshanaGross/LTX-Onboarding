import React from 'react';
import styles from './ToggleButton.module.scss';
import GridIcon from '../assets/grid.svg';
import ListIcon from '../assets/list.svg';

interface ViewToggleButtonProps {
  viewMode: 'grid' | 'table';
  onToggle: () => void;
}

const ToggleButton: React.FC<ViewToggleButtonProps> = ({ viewMode, onToggle }) => {
  return (
    <button className={styles.toggleButton} onClick={onToggle}>
      <div className={styles.iconContainer}>
        <img src={GridIcon} alt="GridIcon" className={styles.icon} />
        {viewMode === 'grid' && (<div className={styles.activeIndicator} />)}
      </div>
      <div className={styles.iconContainer}>
        {viewMode === 'table' && (<div className={styles.activeIndicator} />)}
        <img src={ListIcon} alt="ListIcon" className={styles.icon} />
      </div>
    </button>
  );
};

export default ToggleButton; 