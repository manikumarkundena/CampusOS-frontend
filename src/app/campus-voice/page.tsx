"use client";

import React, { useEffect, useState, useCallback } from "react";
import { CampusVoicePost, CampusVoiceComment } from "@/types/api";
import { api } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { formatDate } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  MessageSquare,
  ThumbsUp,
  MessageCircle,
  PlusCircle,
  Search,
  Filter,
  AlertCircle,
  CheckCircle2,
  Send,
  Flag,
  X,
  Sparkles,
} from "lucide-react";

export default function CampusVoicePage() {
  const { user, isAuthenticated } = useAuth();

  const [posts, setPosts] = useState<CampusVoicePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Post Creation Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("Discussion");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Active Comments Drawer
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, CampusVoiceComment[]>>({});
  const [commentInput, setCommentInput] = useState("");
  const [commenting, setCommenting] = useState(false);

  // Report Modal
  const [reportPostId, setReportPostId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [reporting, setReporting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  const categories = ["All", "Discussion", "Academics", "Campus Life", "Events", "Feedback"];

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cat = selectedCategory === "All" ? undefined : selectedCategory;
      const q = activeSearch.trim() || undefined;
      const res = await api.campusVoice.search({ category: cat, search: q, page: 0, size: 20 });
      setPosts(res?.data?.content || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load discussions";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, activeSearch]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccessMsg(null);

    try {
      const res = await api.campusVoice.createPost({
        title: newTitle,
        content: newContent,
        category: newCategory,
      });

      if (res?.data) {
        setSubmitSuccessMsg(
          "Your post has been submitted. As per university safety standards, it is in moderation review."
        );
        setNewTitle("");
        setNewContent("");
        setTimeout(() => {
          setIsModalOpen(false);
          setSubmitSuccessMsg(null);
          loadPosts();
        }, 2000);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to submit post";
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleReaction = async (postId: string, reactionType = "LIKE") => {
    if (!isAuthenticated) return;
    try {
      await api.campusVoice.toggleReaction(postId, reactionType);
      // Optimistic update
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, reactionCount: (p.reactionCount || 0) + 1 } : p
        )
      );
    } catch {
      // silent
    }
  };

  const handleToggleComments = async (postId: string) => {
    if (activePostId === postId) {
      setActivePostId(null);
      return;
    }

    setActivePostId(postId);
    if (!comments[postId]) {
      try {
        const res = await api.campusVoice.getComments(postId);
        setComments((prev) => ({ ...prev, [postId]: res?.data?.content || [] }));
      } catch {
        // silent
      }
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!isAuthenticated || !commentInput.trim()) return;

    setCommenting(true);
    try {
      const res = await api.campusVoice.addComment(postId, { content: commentInput.trim() });
      if (res?.data) {
        setComments((prev) => ({
          ...prev,
          [postId]: [...(prev[postId] || []), res.data],
        }));
        setCommentInput("");
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId ? { ...p, commentCount: (p.commentCount || 0) + 1 } : p
          )
        );
      }
    } catch {
      // silent
    } finally {
      setCommenting(false);
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportPostId || !reportReason) return;

    setReporting(true);
    try {
      await api.campusVoice.report(reportPostId, {
        reason: reportReason,
        details: reportDetails,
      });
      setReportSuccess(true);
      setTimeout(() => {
        setReportPostId(null);
        setReportReason("");
        setReportDetails("");
        setReportSuccess(false);
      }, 1500);
    } catch {
      // silent
    } finally {
      setReporting(false);
    }
  };

  return (
    <div className="min-h-screen py-10 bg-slate-50/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider">
              <MessageSquare className="w-4 h-4" />
              <span>Campus Voice Community</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Campus Voice
            </h1>
            <p className="text-sm text-slate-500">
              A moderated student forum for campus debriefs, collaborative queries, and announcements.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all shadow-blue-500/20 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Discussion</span>
          </button>
        </div>

        {/* Search & Categories */}
        <div className="space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setActiveSearch(searchQuery);
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics by keyword..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-xs"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
            >
              Filter
            </button>
          </form>

          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-xs font-semibold"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Posts List */}
        {loading ? (
          <div className="py-20">
            <LoadingSpinner label="Loading discussions..." />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-6 text-center max-w-lg mx-auto">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-rose-900">Connection Notice</h3>
            <p className="text-xs text-rose-700 mt-1 mb-4">{error}</p>
            <button
              onClick={loadPosts}
              className="px-4 py-1.5 rounded-lg bg-white border border-rose-300 text-xs font-medium text-rose-800"
            >
              Retry
            </button>
          </div>
        ) : posts.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No Published Discussions Found"
            description="Be the first verified campus member to initiate a conversation or ask a question."
            actionLabel={isAuthenticated ? "Create Discussion Post" : "Sign In to Post"}
            onActionClick={
              isAuthenticated ? () => setIsModalOpen(true) : () => (window.location.href = "/auth/login")
            }
          />
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                id={`post-${post.id}`}
                className="glass-panel rounded-2xl border border-slate-200/80 p-6 space-y-4 transition-all shadow-xs"
              >
                {/* Meta Header */}
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-[10px] uppercase">
                      {post.category || "General"}
                    </span>
                    <span className="font-semibold text-slate-800">
                      {post.authorName || "Campus Student"}
                    </span>
                  </div>
                  <span>{formatDate(post.createdAt)}</span>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900">{post.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleReaction(post.id)}
                      disabled={!isAuthenticated}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-blue-50 hover:text-blue-600 text-slate-700 transition-colors disabled:opacity-50"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-blue-600" />
                      <span className="font-semibold">{post.reactionCount ?? 0}</span>
                    </button>

                    <button
                      onClick={() => handleToggleComments(post.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-slate-400" />
                      <span>{post.commentCount ?? 0} Comments</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setReportPostId(post.id)}
                    className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Report Post"
                  >
                    <Flag className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Comments Section */}
                {activePostId === post.id && (
                  <div className="pt-4 border-t border-slate-100 space-y-3 bg-slate-50/60 -mx-6 -mb-6 p-6 rounded-b-2xl">
                    <h4 className="text-xs font-bold text-slate-700">Comments</h4>

                    {/* Comment List */}
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {(comments[post.id] || []).length === 0 ? (
                        <p className="text-xs text-slate-400">No comments yet.</p>
                      ) : (
                        comments[post.id].map((c) => (
                          <div
                            key={c.id}
                            className="p-3 bg-white rounded-xl border border-slate-200/80 text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between text-[11px] text-slate-400">
                              <span className="font-semibold text-slate-700">{c.authorName}</span>
                              <span>{formatDate(c.createdAt)}</span>
                            </div>
                            <p className="text-slate-600">{c.content}</p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Add Comment Input */}
                    {isAuthenticated ? (
                      <div className="flex gap-2 pt-2">
                        <input
                          type="text"
                          value={commentInput}
                          onChange={(e) => setCommentInput(e.target.value)}
                          placeholder="Write a constructive response..."
                          className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          disabled={commenting || !commentInput.trim()}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1 disabled:opacity-50"
                        >
                          <Send className="w-3 h-3" />
                          <span>Post</span>
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">
                        Please <a href="/auth/login" className="text-blue-600 underline">sign in</a> to participate in discussions.
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Modal: Create Post */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-slate-200 shadow-2xl relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">Initiate Campus Discussion</h3>
                <p className="text-xs text-slate-500">
                  Posts are public to the university once verified by moderators.
                </p>
              </div>

              {submitSuccessMsg ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{submitSuccessMsg}</span>
                </div>
              ) : (
                <form onSubmit={handleCreatePost} className="space-y-4">
                  {submitError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                      {submitError}
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Discussion">Discussion</option>
                      <option value="Academics">Academics</option>
                      <option value="Campus Life">Campus Life</option>
                      <option value="Events">Events</option>
                      <option value="Feedback">Feedback</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">Topic Title</label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Robotics Club Hackathon Workshop Recap"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">Details</label>
                    <textarea
                      required
                      rows={4}
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      placeholder="Share constructive insights, questions, or ideas..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all disabled:opacity-50"
                  >
                    {submitting ? "Submitting to Queue..." : "Submit for Moderation"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Modal: Report Post */}
        {reportPostId && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl relative">
              <button
                onClick={() => setReportPostId(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-base font-bold text-slate-900">Report Inappropriate Content</h3>

              {reportSuccess ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Report submitted to faculty moderators.</span>
                </div>
              ) : (
                <form onSubmit={handleReportSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">Reason</label>
                    <input
                      type="text"
                      required
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      placeholder="e.g. Harassment, Spam, Academic Dishonesty"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">Details (Optional)</label>
                    <textarea
                      rows={3}
                      value={reportDetails}
                      onChange={(e) => setReportDetails(e.target.value)}
                      placeholder="Additional context for moderation team..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={reporting}
                    className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-all disabled:opacity-50"
                  >
                    {reporting ? "Submitting Report..." : "Submit Report"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
