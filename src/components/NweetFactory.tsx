import { v4 as uuid } from 'uuid';
import { storageService, dbService } from '@/fbase';
import React, { FormEvent, useState } from 'react';

interface NweetFactoryProps {
  userObj: UserObj;
}

const NweetFactory: React.FC<NweetFactoryProps> = ({ userObj }) => {
  const [nweet, setNweet] = useState<string>('');
  const [imgFileData, setImgFileData] = useState<string>('');

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let uploadedFileURL = '';
    if (imgFileData) {
      const uploadRef = storageService.ref().child(`${userObj.uid}/${uuid()}`);
      const uploadRes = await uploadRef.putString(imgFileData, 'data_url');

      uploadedFileURL = (await uploadRes.ref.getDownloadURL()) as string;
    }

    const newNweet: NweetPostObj = {
      text: nweet,
      createdAt: Date.now(),
      userID: userObj?.uid || '',
      attachmentURL: uploadedFileURL,
    };

    await dbService.collection('nweets').add(newNweet);

    setImgFileData('');
    setNweet('');
  };

  const onChange = (e: FormEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = e;

    setNweet(value);
  };

  const onChangeFile = (e: FormEvent<HTMLInputElement>) => {
    const {
      currentTarget: { files },
    } = e;
    const file2upload = files?.[0] || null;

    if (!file2upload) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const { result } = reader;
      setImgFileData(result?.toString() || '');
    };

    reader.readAsDataURL(file2upload);
  };

  const onClickClearPhoto = () => {
    setImgFileData('');
  };

  return (
    <form onSubmit={onSubmit}>
      <input type="text" placeholder="What's in your mind?" maxLength={320} value={nweet} onChange={onChange} />
      <input type="file" accept="image/*" onChange={onChangeFile} />
      <input type="submit" value="Nweet" />
      {imgFileData && (
        <div>
          <img alt="user uploading file" src={imgFileData} width="50px" height="50px" />
          <button onClick={onClickClearPhoto}>clear</button>
        </div>
      )}
    </form>
  );
};

export default NweetFactory;
