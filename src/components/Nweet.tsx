import { dbService, storageService } from '@/fbase';
import React, { FormEvent, useState } from 'react';

interface INweetProps {
  nweet: NweetObj;
  isOwner: boolean;
}

const Nweet: React.FC<INweetProps> = ({ nweet, isOwner }) => {
  const { text, attachmentURL } = nweet;
  const [isEditing, setIsEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(text);

  const onClickDelete = async () => {
    const ok = window.confirm('Are you sure to delete this nweet?');
    if (ok) {
      await dbService.doc(`nweets/${nweet.id}`).delete();
      if (nweet.attachmentURL) {
        await storageService.refFromURL(nweet.attachmentURL).delete();
      }
    }
  };

  const toggleEditing = () => setIsEditing((prev) => !prev);

  const onClickEdit = () => {
    toggleEditing();
  };

  const onChangeNweetText = (e: FormEvent<HTMLInputElement>) => {
    setNewNweet(e.currentTarget.value);
  };

  const onSubmitNewNweet = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await dbService.doc(`nweets/${nweet.id}`).update({
      text: newNweet,
    });

    toggleEditing();
  };

  return (
    <div>
      {isEditing && isOwner ? (
        <form onSubmit={onSubmitNewNweet}>
          <input name="newNweet" value={newNweet} required onChange={onChangeNweetText} maxLength={320} />
          <input type="submit" value="change nweet" />
          <button onClick={toggleEditing}>cancel</button>
        </form>
      ) : (
        <>
          <h4>{text}</h4>
          {attachmentURL && <img src={attachmentURL} alt="nweet attachment" width="50%" height="50%" />}
          {isOwner && (
            <>
              <button onClick={onClickDelete}>Delete Nweet</button>
              <button onClick={onClickEdit}>Edit Nweet</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Nweet;
