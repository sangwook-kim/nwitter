import React from 'react';
import { Link } from 'react-router-dom';

interface INavigationProps {
  userObj: UserObj;
}

const Navigation: React.FC<INavigationProps> = ({ userObj }) => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/profile">{userObj.displayName || 'My'} Profile</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
