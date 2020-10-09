import Nweet from '@/components/Nweet';
import NweetFactory from '@/components/NweetFactory';
import { dbService } from '@/fbase';
import React, { useEffect, useState } from 'react';

interface HomeProps {
  userObj: UserObj;
}

const Home: React.FC<HomeProps> = ({ userObj }) => {
  const [nweets, setNweets] = useState<NweetObj[]>([]);

  useEffect(() => {
    dbService.collection('nweets').onSnapshot((sanpshot) => {
      const newNweets: NweetObj[] = [];

      sanpshot.docs.forEach((doc) => {
        const nweetData = {
          ...doc.data(),
          id: doc.id,
        } as NweetObj;

        newNweets.push(nweetData);
      });
      setNweets(newNweets.sort((a, b) => b.createdAt - a.createdAt));
    });
  }, []);

  return (
    <div className="container">
      <NweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
        {nweets.map((nweet: NweetObj) => (
          <Nweet key={nweet.id} nweet={nweet} isOwner={nweet.userID === userObj.uid} />
        ))}
      </div>
    </div>
  );
};

export default Home;
