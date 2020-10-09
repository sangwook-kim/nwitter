import { dbService, storageService } from '@/fbase';
import React, { FormEvent, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

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
    <div className="nweet">
      {isEditing && isOwner ? (
        <form onSubmit={onSubmitNewNweet} className="container nweetEdit">
          <input
            name="newNweet"
            placeholder="Edit your nweet"
            value={newNweet}
            required
            onChange={onChangeNweetText}
            autoFocus
            maxLength={320}
            className="formInput"
          />
          <input type="submit" value="Update Nweet" className="formBtn" />
          <span onClick={toggleEditing} className="formBtn cancelBtn">
            Cancel
          </span>
        </form>
      ) : (
        <>
          <h4>{text}</h4>
          {attachmentURL && <img src={attachmentURL} alt="nweet attachment" />}
          {isOwner && (
            <div className="nweet__actions">
              <span onClick={onClickDelete}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={onClickEdit}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Nweet;
