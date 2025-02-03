import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NotFound.module.scss';

interface NotFoundProps {
  message?: string;
  showHomeButton?: boolean;
}

const NotFound: React.FC<NotFoundProps> = ({ message , showHomeButton }) => {
  const navigate = useNavigate();
  
  return (
    <div className={styles.notFound}>
      <h1>{message}</h1>
      {showHomeButton && <button onClick={() => navigate('/')}>Go Home</button>}
    </div>
  );
};

export default NotFound; 