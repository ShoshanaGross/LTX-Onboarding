import { useState, useRef, useEffect } from 'react';
import { User } from '../types/User';
import styles from './UserList.module.scss';
import { useNavigate, useLocation } from 'react-router-dom';
import spinnerIcon from '../assets/spinner.svg';
import ToggleButton from './ToggleButton';
import CardsGridView from './CardsGridView';
import UsersTableView from './UsersTableView';

type ViewMode = 'grid' | 'table';

type UserListProps = {
  users: User[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
};

const UserList = ({ users, loading, error, searchTerm, setSearchTerm }: UserListProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [viewMode, setViewMode] = useState<ViewMode>(location.state?.previousViewMode || 'grid');
  const userRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const scrollToId = location.state?.scrollToId;
    if (scrollToId && userRefs.current[scrollToId]) {
      userRefs.current[scrollToId]?.scrollIntoView({ behavior: 'smooth' });
    }
    if (location.state?.searchTerm) {
      setSearchTerm(location.state.searchTerm);
    }
  }, [location, setSearchTerm]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <img src={spinnerIcon} className={styles.spinner} alt="Loading..." />
        Loading users...
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        {error}
      </div>
    );
  }

  const handleUserClick = (userId: string) => {
    navigate(`/user/${userId}`, {
      state: { previousViewMode: viewMode, searchTerm: searchTerm },
    });
  };

  const assignRef = (userId: string, element: HTMLDivElement | null) => {
    userRefs.current[userId] = element;
  }

  const handleAddUser = () => {
    navigate('/user/create');
  };

  const renderGridView = () => (
    <CardsGridView 
      users={users}
      onUserClick={handleUserClick}
      assignRef={assignRef}
    />
  );

  const renderTableView = () => (
    <UsersTableView 
      users={users}
      onUserClick={handleUserClick}
      assignRef={assignRef}
    />
  );

  const toggleButton = () => {
    return (
      <ToggleButton 
        viewMode={viewMode} 
        onToggle={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')} 
      />
    );
  };

  return (
    <div className={styles.userList}>
      <div className={styles.header}>
        <button className={styles.addButton} onClick={handleAddUser}>
          Add User
        </button>
        <div className={styles.viewToggle}>
          <div className={styles.toggleContainer}>
            <span className={styles.resultsLabel}>{users.length} results</span>
            {toggleButton()}
          </div>
        </div>
      </div>
      {viewMode === 'grid' ? renderGridView() : renderTableView()}
    </div>
  );
};

export default UserList;
