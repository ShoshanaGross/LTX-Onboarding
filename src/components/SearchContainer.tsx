import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from './SearchBar';
import UserList from './UserList';
import { useUserStore } from '../stores/userStore';

interface SearchContainerProps {
  loading: boolean;
  error: string | null;
}

const SearchContainer: React.FC<SearchContainerProps> = ({ loading, error }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const users = useUserStore(state => state.users);
  const [filteredUsers, setFilteredUsers] = useState(users);

  // Get searchTerm from URL or empty string
  const searchTerm = searchParams.get('search') || '';

  // Filter users whenever searchTerm or users change
  useEffect(() => {
    const filtered = users.filter(
      user =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  const handleSearch = useCallback(
    (query: string) => {
      // Update URL with search parameter
      if (query) {
        setSearchParams({ search: query });
      } else {
        setSearchParams({});
      }
    },
    [setSearchParams]
  );

  return (
    <>
      <SearchBar onSearch={handleSearch} searchTerm={searchTerm} />
      <UserList
        users={filteredUsers}
        searchTerm={searchTerm}
        setSearchTerm={query => handleSearch(query)}
        loading={loading}
        error={error}
      />
    </>
  );
};

export default SearchContainer;