import Nweet from '@/components/Nweet';
import { authService, dbService } from '@/fbase';
import React, { FormEvent, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

interface IProfileProps {
  userObj: UserObj;
  refreshUser: () => void;
}

const Profile: React.FC<IProfileProps> = ({ refreshUser, userObj }) => {
  const [nweets, setNweets] = useState<NweetObj[]>([]);
  const [newDisplayName, setNewDisplayName] = useState<string>(userObj.displayName || '');

  const history = useHistory();
  const onClickLogOut = async () => {
    await authService.signOut();
    history.push('/');
  };

  useEffect(() => {
    const getMyNweets = async () => {
      const myNweetSnapShot = await dbService
        .collection('nweets')
        .where('userID', '==', userObj.uid)
        .orderBy('createdAt', 'desc')
        .limit(10)
        .get();
      const myNweets: NweetObj[] = [];

      myNweetSnapShot.docs.forEach((doc) => {
        const nweetData = {
          ...doc.data(),
          id: doc.id,
        } as NweetObj;

        myNweets.push(nweetData);
      });
      // setNweets(myNweets.sort((a, b) => b.createdAt - a.createdAt));
      setNweets(myNweets);
    };

    void getMyNweets();
  }, [userObj.uid]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (userObj.displayName === newDisplayName) return;
    await userObj.updateDisplayName(newDisplayName);
    refreshUser();
  };

  const onChangeDisplayName = (e: FormEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = e;

    setNewDisplayName(value);
  };

  return (
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
        <input
          type="text"
          autoFocus
          placeholder="Display Name"
          value={newDisplayName}
          onChange={onChangeDisplayName}
          className="formInput"
        />
        <input
          type="submit"
          value="Update Profile"
          className="formBtn"
          style={{
            marginTop: 10,
          }}
        />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onClickLogOut}>
        Log Out
      </span>
      <div style={{ marginTop: '20px' }}>
        {nweets.map((nweet: NweetObj) => (
          <Nweet key={nweet.id} nweet={nweet} isOwner={nweet.userID === userObj.uid} />
        ))}
      </div>
    </div>
  );
};

export default Profile;
