declare global {
  interface NweetPostObj {
    userID: string;
    text: string;
    createdAt: number;
    attachmentURL?: string;
  }

  interface NweetObj {
    id: string;
    userID: string;
    text: string;
    createdAt: number;
    attachmentURL?: string;
  }

  interface UserObj {
    displayName: string | null;
    uid: string;
    updateDisplayName: (name: string) => Promise<void>;
  }
}

export {};
