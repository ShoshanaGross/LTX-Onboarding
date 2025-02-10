import { useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { User } from '../types/User';
import styles from './UserProfile.module.scss';
import BackIcon from '../assets/back.svg';
import UserPost from './UserPost';
import { useUserStore } from '../stores/userStore';

type Tab = 'Overview' | 'Post';

const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const users = useUserStore(state => state.users);
  const user = useMemo(() => users.find(u => u.id === id), [users, id]);
  const tabs: Tab[] = ['Overview', 'Post'];
  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab);
  };

  if (!user) {
    return <div>User not found</div>;
  }

  const handleBack = () => {
    navigate('/', {
      state: {
        scrollToId: id,
        previousViewMode: location.state?.previousViewMode,
        searchTerm: location.state?.searchTerm,
      },
    });
  };

  const handleEditClick = () => {
    navigate(`/editUser/${id}`, {
      state: {
        previousPath: location.pathname,
      }
    });
  };

  const backButton = () => (
    <button className={styles.backButton} onClick={handleBack}>
      <img src={BackIcon} alt="Back" className={styles.backIcon} />
      <div className={styles.backButtonText}>Back to search</div>
    </button>
  );

  const tabsView = () => (
    <div className={styles.userProfileTabs}>
      <div className={styles.userProfileTabsContainer}>
        {tabs.map(tab => (
          <button
            key={tab}
            className={`${styles.userProfileTabsItemTitle} ${activeTab === tab ? styles.active : ''}`}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );

  const aboutMeText = (user: User) => {
    const companyText = user.company ? ` and currntly work as a ${user.company?.title} at the 
      ${user.company?.department} department at ${user.company?.name}.` : '.';

    const universityText = user.university ? ` I graduated from ${user.university}.` : '';

    return `Hi, I'm ${user.firstName} ${user.lastName}. I'm ${user.age} years old${companyText}
    ${universityText} I live in ${user.address.city}, ${user.address.state}, and you can reach me at
    ${user.email} or ${user.phone}.`;
  }


  const getUserById = (userId: number) => {
    const foundUser = users.find(user => user.id === `${userId}`);
    return foundUser || users[0]; // Fallback to first user if not found
  };

  const posts = () => (
    <div className={styles.userProfileTabsPostItems}>
      {user.posts.map((post) => (
        <UserPost
          key={post.id}
          post={post}
          getUserById={getUserById}
        />
      ))}
    </div>
  );

  const tabsContent = () => (
    <div className={styles.userProfileTabsContent}>
      {activeTab === 'Overview' && (
        <div className={styles.userProfileTabsContentItem}>
          <div className={styles.userProfileTabsContentItemTitle}>About me</div>
          <div className={styles.userProfileTabsContentItemText}>{aboutMeText(user)}</div>
        </div>
      )}
      {activeTab === 'Post' && posts()}
    </div>
  );

  return (
    <div className={styles.userProfile}>
      {backButton()}
      <div className={styles.userProfileMainContainer}>
        <div className={styles.userProfileCard}>
          <div className={styles.userImageContainer}>
            <img
              src={user.image}
              alt={`${user.firstName} ${user.lastName}`}
              className={styles.userImage}
            />
          </div>
          <div className={styles.userInfoContainer}>
            <div className={styles.infoGroup}>
              <div className={styles.userName}>
                {user.firstName} {user.lastName}
              </div>
              <div className={styles.userAgeLocation}>
                {user.age}. {user.gender}. {user.company?.name}. {user.address.city}, {user.address.state}
              </div>
            </div>
            <div className={styles.userEmail}>{user.email}</div>
            <div className={styles.editButtonContainer}>
            <button 
                className={styles.editButton}
                onClick={handleEditClick} >
                Edit
              </button>
            </div>
          </div>
        </div>
        {tabsView()}
        {tabsContent()}
      </div>
    </div>
  );
};

export default UserProfile;
