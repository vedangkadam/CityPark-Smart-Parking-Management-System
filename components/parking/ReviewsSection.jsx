const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from "react";

import { useAuth } from "@/lib/AuthContext";
import moment from "moment";
import StarRating from "@/components/parking/StarRating";
import { Loader2, MessageSquare } from "lucide-react";

export default function ReviewsSection({ lot }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const load = () => {
    db.entities.Review.filter({ lot_id: lot.id }, "-created_date", 50)
      .then(setReviews)
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    load();
  }, [lot.id]);

  const avg = reviews.length
    ? reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length
    : 0;

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!comment.trim()) {
      setError("Please write a few words about your experience.");
      return;
    }
    setSubmitting(true);
    try {
      await db.entities.Review.create({
        lot_id: lot.id,
        rating,
        comment: comment.trim(),
        author_name: user?.full_name || user?.email || "Anonymous",
      });
      setComment("");
      setRating(5);
      load();
    } catch (err) {
      setError(err.message || "Failed to post review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border-t border-border pt-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-heading font-bold text-foreground text-sm flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4" /> Reviews
        </h3>
        {reviews.length > 0 && (
          <div className="flex items-center gap-1.5">
            <StarRating value={avg} readOnly size={14} />
            <span className="text-xs font-semibold text-foreground">{avg.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({reviews.length})</span>
          </div>
        )}
      </div>

      {/* Leave a review */}
      <form onSubmit={submit} className="bg-muted rounded-xl p-3 space-y-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground">Your rating</span>
          <StarRating value={rating} onChange={setRating} size={18} />
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={2}
          placeholder="Share your parking experience…"
          className="w-full px-3 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
        />
        {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
          >
            {submitting ? "Posting…" : "Post review"}
          </button>
        </div>
      </form>

      {/* List */}
      <div className="mt-3 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">
            No reviews yet — be the first to rate this lot.
          </p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="border border-border rounded-xl p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground truncate">
                  {r.author_name || "Anonymous"}
                </span>
                <StarRating value={r.rating} readOnly size={12} />
              </div>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{r.comment}</p>
              <p className="text-[10px] text-muted-foreground/70 mt-1.5">
                {moment(r.created_date).fromNow()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}