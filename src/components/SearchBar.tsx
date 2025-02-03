import React from 'react';
import styles from './SearchBar.module.scss';
import SearchIcon from '../assets/search.svg';
import CloseIcon from '../assets/close.svg';

interface SearchBarProps {
  onSearch: (query: string) => void;
  searchTerm: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, searchTerm }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const handleClear = () => {
    onSearch('');
  };

  return (
    <div className={styles.searchContainer}>
      <span className={styles.searchLabel}>Search users</span>
      <div className={styles.searchInputContainer}>
        <img src={SearchIcon} alt="search" className={styles.searchIcon} />
        <input
          type="text"
          value={searchTerm}
          placeholder="Search..."
          onChange={handleChange}
          className={styles.searchInput}
        />
        {searchTerm && (
          <button onClick={handleClear} className={styles.clearButton}>
            <img src={CloseIcon} alt="Clear" className={styles.clearIcon} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;