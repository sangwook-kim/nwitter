import { v4 as uuid } from 'uuid';
import { storageService, dbService } from '@/fbase';
import React, { FormEvent, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

interface NweetFactoryProps {
  userObj: UserObj;
}

const NweetFactory: React.FC<NweetFactoryProps> = ({ userObj }) => {
  const [nweet, setNweet] = useState<string>('');
  const [imgFileData, setImgFileData] = useState<string>('');

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (nweet === '') {
      return;
    }

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
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          type="text"
          placeholder="What's on your mind?"
          maxLength={320}
          value={nweet}
          onChange={onChange}
        />
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>
      <label htmlFor="attach-file" className="factoryInput__label">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input id="attach-file" type="file" accept="image/*" onChange={onChangeFile} style={{ opacity: 0 }} />
      {imgFileData && (
        <div className="factoryForm__attachment">
          <img
            alt="user uploading file"
            src={imgFileData}
            style={{
              backgroundImage: imgFileData,
            }}
          />
          <div className="factoryForm__clear" onClick={onClickClearPhoto}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};

export default NweetFactory;
