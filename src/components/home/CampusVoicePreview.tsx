"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CampusVoicePost } from "@/types/api";
import { api } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";
import { MessageSquare, ThumbsUp, MessageCircle, ArrowRight } from "lucide-react";

export function CampusVoicePreview() {
  const [posts, setPosts] = useState<CampusVoicePost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.campusVoice
      .search({ page: 0, size: 3 })
      .then((res) => {
        setPosts(res?.data?.content || []);
      })
      .catch(() => {
        setPosts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider">
              <MessageSquare className="w-4 h-4" />
              <span>Campus Forum</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Campus Voice Discussions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Moderated conversations, event debriefs, and campus questions from verified students.
            </p>
          </div>

          <Link
            href="/campus-voice"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors shrink-0"
          >
            <span>Open Forum</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400">Loading discussions...</div>
        ) : posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center max-w-lg mx-auto bg-slate-50/50">
            <MessageSquare className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-800">No Discussions Active Yet</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Be the first verified student to initiate a topic or query in Campus Voice.
            </p>
            <Link
              href="/campus-voice"
              className="inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm"
            >
              <span>Visit Campus Voice</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="glass-panel interactive-card rounded-2xl p-5 border border-slate-200/80 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold text-blue-600">{post.category || "General"}</span>
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                  <Link href={`/campus-voice#post-${post.id}`}>
                    <h3 className="font-bold text-slate-900 text-sm hover:text-blue-600 transition-colors line-clamp-1">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {post.content}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="truncate text-slate-700 font-medium">
                    {post.authorName || "Verified Student"}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[11px]">
                      <ThumbsUp className="w-3 h-3 text-slate-400" />
                      {post.reactionCount ?? 0}
                    </span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <MessageCircle className="w-3 h-3 text-slate-400" />
                      {post.commentCount ?? 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
