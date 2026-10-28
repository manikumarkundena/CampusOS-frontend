"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PublicCertificateVerification } from "@/types/api";
import { api } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";
import {
  Award,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Building,
  User,
  Calendar,
  WifiOff,
} from "lucide-react";

function VerifyContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("code") || "";

  const [code, setCode] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PublicCertificateVerification | null>(null);
  const [searched, setSearched] = useState(false);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const runVerification = async (codeToVerify: string) => {
    if (!codeToVerify.trim()) return;

    setLoading(true);
    setErrorMessage(null);
    setErrorStatus(null);
    setSearched(true);

    try {
      const res = await api.certificates.verify(codeToVerify.trim());
      if (res?.data) {
        setResult(res.data);
      } else {
        setResult(null);
        setErrorStatus(404);
      }
    } catch (err: unknown) {
      setResult(null);
      if (err && typeof err === "object" && "status" in err) {
        const status = Number((err as { status: number }).status);
        setErrorStatus(status);
        setErrorMessage(err instanceof Error ? err.message : "Verification request failed");
      } else {
        setErrorStatus(0);
        setErrorMessage(err instanceof Error ? err.message : "Verification service unreachable");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialCode) {
      queueMicrotask(() => {
        runVerification(initialCode);
      });
    }
  }, [initialCode]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    await runVerification(code);
  };

  const isNetworkOrServerError = errorStatus === 0 || (errorStatus !== null && errorStatus >= 500);

  return (
    <div className="min-h-screen py-12 bg-campus-grid">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Public Cryptographic Verification</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Verify Digital Credential
          </h1>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Validate the institutional authenticity of digital certificates issued by CampusOS for
            university events and symposiums.
          </p>
        </div>

        {/* Verification Form Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-lg space-y-6">
          <form onSubmit={handleVerify} className="space-y-4">
            <label className="block text-xs font-semibold text-slate-700">
              Certificate Verification Code
            </label>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. VERIF-XXXXXXXXXXXX"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono tracking-wider"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !code.trim()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify Credential</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              The verification code is displayed on the bottom corner of all genuine CampusOS PDF
              certificates.
            </p>
          </form>

          {/* Verification Results */}
          {searched && !loading && (
            <div className="pt-6 border-t border-slate-100">
              {result && result.valid ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-emerald-900 text-base">
                        Cryptographically Verified Credential
                      </h3>
                      <p className="text-xs text-emerald-700">
                        This digital certificate is genuine and officially recorded in the campus
                        registry.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-emerald-200/60 text-xs">
                    <div className="space-y-1">
                      <p className="text-emerald-700 font-semibold flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        <span>Recipient</span>
                      </p>
                      <p className="text-slate-800 font-bold text-sm">{result.recipientName}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-emerald-700 font-semibold flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5" />
                        <span>Event / Workshop</span>
                      </p>
                      <p className="text-slate-800 font-bold text-sm">{result.eventTitle}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-emerald-700 font-semibold flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5" />
                        <span>Issuing Body</span>
                      </p>
                      <p className="text-slate-700 font-medium">{result.clubName || "University Body"}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-emerald-700 font-semibold flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Issued On</span>
                      </p>
                      <p className="text-slate-700 font-medium">{formatDate(result.issuedAt)}</p>
                    </div>
                  </div>
                </div>
              ) : result && !result.valid ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-6 space-y-3">
                  <div className="flex items-center gap-3 text-rose-800">
                    <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />
                    <div>
                      <h3 className="font-bold text-sm">Certificate Revoked</h3>
                      <p className="text-xs text-rose-700">
                        Reason: {result.revocationReason || "Revoked by institutional coordinator"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : isNetworkOrServerError ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6 text-center text-xs text-amber-800 space-y-2">
                  <WifiOff className="w-8 h-8 text-amber-600 mx-auto" />
                  <p className="font-bold text-sm text-amber-900">Verification Service Unavailable</p>
                  <p className="max-w-md mx-auto text-amber-700">
                    Unable to reach the CampusOS verification authority. {errorMessage || "Please check your network connection and try again."}
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-xs text-slate-500 space-y-1">
                  <FileCheck className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="font-bold text-slate-700">Invalid or Unrecognized Code</p>
                  <p>
                    The code &ldquo;{code}&rdquo; does not match any valid certificate in the CampusOS institutional registry.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CertificateVerificationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen py-12 flex justify-center items-center"><div className="w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" /></div>}>
      <VerifyContent />
    </Suspense>
  );
}
