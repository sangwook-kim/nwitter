import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Profile from '@/routes/Profile';
import Auth from '../routes/Auth';
import Home from '../routes/Home';
import Navigation from './Navigation';

interface IAppRouterProps {
  userObj: UserObj | null;
  refreshUser: () => void;
}

const AppRouter: React.FC<IAppRouterProps> = ({ refreshUser, userObj }) => {
  return (
    <Router>
      {!!userObj && <Navigation userObj={userObj} />}
      <Switch>
        {userObj ? (
          <>
            <Route exact path="/">
              <Home userObj={userObj} />
            </Route>
            <Route exact path="/profile">
              <Profile refreshUser={refreshUser} userObj={userObj} />
            </Route>
          </>
        ) : (
          <Route exact path="/">
            <Auth />
          </Route>
        )}
      </Switch>
    </Router>
  );
};

export default AppRouter;
