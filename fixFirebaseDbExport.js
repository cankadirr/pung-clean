const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, 'frontend');

// firebaseConfig.ts dosya yolu
const firebaseConfigPath = path.join(frontendDir, 'lib', 'firebaseConfig.ts');
// CommentSection.tsx dosya yolu
const commentSectionPath = path.join(frontendDir, 'components', 'comments', 'CommentSection.tsx');

const firebaseConfigContent = `
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBXb3xXCgtz2piREH-arulG5DA_-D0Fvv4",
  authDomain: "pung-clean.firebaseapp.com",
  projectId: "pung-clean",
  storageBucket: "pung-clean.firebasestorage.app",
  messagingSenderId: "737092024953",
  appId: "1:737092024953:web:7ddb2dff7a516a81b0f2a8",
  measurementId: "G-DE4N14FXJH",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
`;

const commentSectionContent = `
"use client";

import React, { useEffect, useState } from "react";
import { db } from "../../lib/firebaseConfig";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

export default function CommentSection({ pageId }: { pageId: string }) {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (!pageId) return;
    const q = query(
      collection(db, "comments"),
      where("pageId", "==", pageId),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const commentsData: any[] = [];
      querySnapshot.forEach((doc) => {
        commentsData.push({ id: doc.id, ...doc.data() });
      });
      setComments(commentsData);
    });
    return () => unsubscribe();
  }, [pageId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    await addDoc(collection(db, "comments"), {
      pageId,
      text: newComment.trim(),
      createdAt: new Date(),
    });
    setNewComment("");
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Yorumlar</h3>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          className="border p-2 rounded w-full"
          placeholder="Yorumunu yaz..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
      </form>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id} className="mb-2 border-b pb-2">
            {comment.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
`;

fs.writeFileSync(firebaseConfigPath, firebaseConfigContent.trim(), 'utf8');
console.log(`firebaseConfig.ts dosyası güncellendi: ${firebaseConfigPath}`);

fs.writeFileSync(commentSectionPath, commentSectionContent.trim(), 'utf8');
console.log(`CommentSection.tsx dosyası güncellendi: ${commentSectionPath}`);

console.log('Lütfen frontend dizininde "npm run dev" ile projeyi yeniden başlat.');
