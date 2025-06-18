const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, 'frontend');
const commentsDir = path.join(frontendDir, 'components', 'comments');
const libDir = path.join(frontendDir, 'lib');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Created/Updated: ${filePath}`);
}

function deleteFile(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`Deleted: ${filePath}`);
  } else {
    console.log(`File not found (not deleted): ${filePath}`);
  }
}

// Firebase yapılandırma dosyası
const firebaseAuthConfig = `
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

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
export const auth = getAuth(app);
`;

// Gelişmiş yorum bileşeni dosyası
const advancedCommentSection = `
"use client";

import React, { useEffect, useState } from "react";
import { db, auth } from "../../lib/firebaseAuthConfig";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  increment,
} from "firebase/firestore";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

export default function AdvancedCommentSection({ pageId }: { pageId: string }) {
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth user state:", currentUser);
      setUser(currentUser);
    });

    const q = query(
      collection(db, "comments"),
      where("pageId", "==", pageId),
      orderBy("createdAt", "desc")
    );

    const unsubscribeComments = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setComments(data);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeComments();
    };
  }, [pageId]);

  const signIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("Sign-in result:", result);
    } catch (error) {
      console.error("Sign-in error:", error);
    }
  };

  const signOutUser = async () => {
    await signOut(auth);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    await addDoc(collection(db, "comments"), {
      pageId,
      text: newComment.trim(),
      createdAt: new Date(),
      userId: user.uid,
      userName: user.displayName,
      likes: 0,
    });
    setNewComment("");
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const saveEdit = async (id) => {
    if (!editText.trim()) return;
    const commentRef = doc(db, "comments", id);
    await updateDoc(commentRef, { text: editText });
    cancelEdit();
  };

  const deleteComment = async (id) => {
    const commentRef = doc(db, "comments", id);
    await deleteDoc(commentRef);
  };

  const likeComment = async (id) => {
    const commentRef = doc(db, "comments", id);
    await updateDoc(commentRef, { likes: increment(1) });
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Yorumlar</h3>
      {!user ? (
        <button
          onClick={signIn}
          className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Giriş Yap
        </button>
      ) : (
        <div className="mb-4">
          Hoş geldin, {user.displayName}{" "}
          <button onClick={signOutUser} className="text-red-500 underline ml-2">
            Çıkış Yap
          </button>
        </div>
      )}
      <form onSubmit={handleAddComment} className="mb-4">
        <input
          type="text"
          className="border p-2 rounded w-full"
          placeholder="Yorumunu yaz..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={!user}
        />
        <button
          type="submit"
          disabled={!user || !newComment.trim()}
          className="mt-2 bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Gönder
        </button>
      </form>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id} className="mb-2 border-b pb-2">
            {editingId === comment.id ? (
              <>
                <input
                  type="text"
                  className="border p-2 rounded w-full mb-2"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button
                  onClick={() => saveEdit(comment.id)}
                  className="mr-2 bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Kaydet
                </button>
                <button
                  onClick={cancelEdit}
                  className="bg-gray-400 text-white px-3 py-1 rounded"
                >
                  İptal
                </button>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <p>{comment.text}</p>
                  <div>
                    <button
                      onClick={() => likeComment(comment.id)}
                      className="mr-2 bg-yellow-400 px-2 rounded"
                    >
                      ❤️ {comment.likes || 0}
                    </button>
                    {comment.userId === user?.uid && (
                      <>
                        <button
                          onClick={() => startEdit(comment.id, comment.text)}
                          className="mr-2 bg-blue-600 text-white px-2 rounded"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => deleteComment(comment.id)}
                          className="bg-red-600 text-white px-2 rounded"
                        >
                          Sil
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <small className="text-gray-500">Yorum sahibi: {comment.userName}</small>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
`;

ensureDir(commentsDir);

deleteFile(path.join(commentsDir, 'CommentSection.tsx'));
writeFile(path.join(commentsDir, 'AdvancedCommentSection.tsx'), advancedCommentSection.trim());
writeFile(path.join(libDir, 'firebaseAuthConfig.ts'), firebaseAuthConfig.trim());

console.log('Eski CommentSection.tsx dosyası silindi.');
console.log('firebaseAuthConfig.ts ve AdvancedCommentSection.tsx dosyaları oluşturuldu ve güncellendi.');
console.log('Projeyi yeniden başlatmayı unutma (npm run dev).');
