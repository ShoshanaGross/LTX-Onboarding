import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import UserProfile from './UserProfile';
import { fetchUsers } from '../services/userService';
import { User } from '../types/User';
import SearchContainer from './SearchContainer';
import { Layout } from './Layout';
import NotFound from './NotFound';

type FailedRequest = {
  state: 'failed',
  error: string;
}

type PendingRequest = {
  state: 'pending',
}

type SuccessfulRequest = {
  state: 'done',
  result: User[]
}

type IdleRequest = {
  state: 'not_started'
}

type Request = FailedRequest | PendingRequest | SuccessfulRequest | IdleRequest;

const UserProfileWrapper = ({ users, signedInUser }: { users: User[], signedInUser: User | null }) => {
  const { id } = useParams();
  const userExists = users.find(u => u.id === `${id}`);

  return (
    <Layout userImage={signedInUser?.image}>
      {!userExists ? (
        <NotFound message="User not found" />
      ) : (
        <UserProfile users={users} />
      )}
    </Layout>
  );
};

const App = () => {
  const [request, setRequest] = useState<Request>({ state: 'not_started' });
  const [signedInUser, setSignedInUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        const usersWithPosts = data.map(user => ({
          ...user,
          posts: Array.from({ length: 3 }, () => ({
            id: Math.floor(Math.random() * 1000),
            image: `https://picsum.photos/200/200?random=${Math.floor(Math.random() * 1000)}`,
            comments: Array(3)
              .fill(null)
              .map(() => ({
                body: 'This is a comment',
                userId: Math.floor(Math.random() * data.length) + 1,
              })),
          })),
        }));
        setRequest({ state: 'done', result: usersWithPosts });
        setSignedInUser(usersWithPosts[Math.floor(Math.random() * usersWithPosts.length)]);
      } catch (err) {
        setRequest({ state: 'failed', error: err instanceof Error ? err.message : 'An error occurred' });
      }
    };

    if (request.state === 'not_started') {
      setRequest({ state: 'pending' });
      loadUsers();
    }
  }, [request]);


  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout userImage={signedInUser?.image}>
              {request.state === 'failed' ? (
                <NotFound message={request.error} showHomeButton={false} />
              ) : (
                <SearchContainer 
                  users={request.state === 'done' ? request.result : []} 
                  loading={request.state === 'pending'} 
                  error={null} 
                />
              )}
            </Layout>
          }
        />
        <Route
          path="/user/:id"
          element={
            request.state === 'done' ? (
              <UserProfileWrapper users={request.result} signedInUser={signedInUser} />
            ) : null
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
