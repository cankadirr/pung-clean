const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, 'frontend');
const componentsDir = path.join(frontendDir, 'components');
const commentsDir = path.join(componentsDir, 'comments');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Created: ${filePath}`);
}

// firebaseConfig.ts (BURAYA kendi firebase config bilgilerini koyacaksın)
const firebaseConfigContent = `
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
`;

// CommentSection.tsx
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

ensureDir(path.join(frontendDir, 'lib'));
ensureDir(commentsDir);

writeFile(path.join(frontendDir, 'lib', 'firebaseConfig.ts'), firebaseConfigContent.trim());
writeFile(path.join(commentsDir, 'CommentSection.tsx'), commentSectionContent.trim());

console.log('Firebase yapılandırma ve yorum bileşeni oluşturuldu.');
console.log('Firebase SDK\'yı yüklemek için frontend dizininde aşağıyı çalıştır:');
console.log('npm install firebase');
console.log('firebaseConfig.ts dosyasını kendi Firebase projenin bilgileriyle doldurmayı unutma.');
console.log('CommentSection bileşenini ilgili sayfanda kullanabilirsin. Örneğin:');
console.log('<CommentSection pageId={sayfaId} />');
