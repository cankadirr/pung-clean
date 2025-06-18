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