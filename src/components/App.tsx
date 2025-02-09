import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import UserProfile from './UserProfile';
import { User } from '../types/User';
import SearchContainer from './SearchContainer';
import { Layout } from './Layout';
import NotFound from './NotFound';
import { EditUser } from './EditUser';
import CreateUser from './CreateUser';
import { useUserStore } from '../stores/userStore';

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

const UserProfileWrapper = ({ signedInUser }: { signedInUser: User | null }) => {
  const { id } = useParams();
  const users = useUserStore(state => state.users);
  const [userExists, setUserExists] = useState<boolean>(false);

  useEffect(() => {
    if (users.length > 0 && id) {
      const found = users.find(u => u.id === id);
      setUserExists(!!found);
    }
  }, [users, id]);

  return (
    <Layout userImage={signedInUser?.image}>
      {!userExists ? (
        <NotFound message="User not found" showHomeButton={true}/>
      ) : (
        <UserProfile />
      )}
    </Layout>
  );
};

const App = () => {
  const [request, setRequest] = useState<Request>({ state: 'not_started' });
  const [signedInUser, setSignedInUser] = useState<User | null>(null);
  const users = useUserStore(state => state.users);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        if (users.length === 0) {
          setRequest({ state: 'pending' });
          await useUserStore.getState().initializeUsers();
        }
        setRequest({ state: 'done', result: users });
        setSignedInUser(users[Math.floor(Math.random() * users.length)]);
      } catch (err) {
        setRequest({ state: 'failed', error: err instanceof Error ? err.message : 'An error occurred' });
      }
    };

    if (request.state === 'not_started') {
      loadUsers();
    }
  }, [request, users]);

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
              <UserProfileWrapper signedInUser={signedInUser} />
            ) : null
          }
        />
        <Route 
          path="/editUser/:id" 
          element={
            <EditUser />
          }
        />
        <Route
          path="/user/create"
          element={
            <Layout userImage={signedInUser?.image}>
              <CreateUser />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
