import React from "react";
import Link from "next/link";
import { Award, QrCode, Briefcase, MessageSquare, ArrowRight, ShieldCheck } from "lucide-react";

export function PlatformFeatures() {
  const features = [
    {
      title: "Verifiable Digital Certificates",
      description:
        "Earn official digital certificates upon verified event attendance. Anyone can verify authenticity using our public cryptographic lookup.",
      icon: Award,
      color: "from-blue-600 to-indigo-600",
      accent: "bg-blue-50 text-blue-700 border-blue-200",
      link: "/verify",
      actionText: "Verify a Certificate",
    },
    {
      title: "Secure QR Attendance",
      description:
        "Real-time, time-bound dynamic QR session codes prevent proxy check-ins. Faculty coordinators retain manual correction logs for compliance.",
      icon: QrCode,
      color: "from-indigo-600 to-violet-600",
      accent: "bg-indigo-50 text-indigo-700 border-indigo-200",
      link: "/events",
      actionText: "Explore Events",
    },
    {
      title: "Recruitment Pipeline",
      description:
        "Club executive teams post structured positions with SOP requirements. Review candidate stages from applied to interview-scheduled and accepted.",
      icon: Briefcase,
      color: "from-violet-600 to-purple-600",
      accent: "bg-violet-50 text-violet-700 border-violet-200",
      link: "/recruitment",
      actionText: "Open Positions",
    },
    {
      title: "Moderated Campus Voice",
      description:
        "A healthy campus discourse layer with transparent moderation queues, post reporting, insightful reactions, and department announcements.",
      icon: MessageSquare,
      color: "from-sky-600 to-blue-600",
      accent: "bg-sky-50 text-sky-700 border-sky-200",
      link: "/campus-voice",
      actionText: "Join Discussion",
    },
  ];

  return (
    <section className="py-20 bg-white border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Built For Institutional Scale</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Engineered for Modern University Life
          </h2>
          <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
            Every feature is backed by a secure Spring Boot 3 enterprise core, providing verifiable
            records, audit compliance, and seamless cross-campus collaboration.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="glass-panel interactive-card rounded-2xl p-6 flex flex-col justify-between border border-slate-200/80 space-y-6"
              >
                <div className="space-y-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feature.color} flex items-center justify-center text-white shadow-sm`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-bold text-base text-slate-900">{feature.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <Link
                    href={feature.link}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 group"
                  >
                    <span>{feature.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
