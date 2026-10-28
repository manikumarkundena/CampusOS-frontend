"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Award,
  Upload,
  Eye,
  Users,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  RefreshCw,
  Send,
  Sliders,
  FileText,
  Clock,
  ShieldAlert,
  X,
  Check,
  RotateCcw,
} from "lucide-react";
import { api } from "@/lib/api-client";
import {
  CertificateTemplateResponse,
  CertificateFieldConfig,
  BulkIssuePreviewResponse,
  BatchDeliveryStatusResponse,
  ClubItem,
  EventItem,
} from "@/types/api";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const DEFAULT_FIELDS: CertificateFieldConfig[] = [
  {
    fieldType: "RECIPIENT_NAME",
    label: "Recipient Full Name",
    defaultValue: "Alex Mercer",
    xPercent: 50.0,
    yPercent: 48.0,
    fontFamily: "HELVETICA",
    fontSize: 26,
    fontStyle: "BOLD",
    colorHex: "#1E293B",
    alignment: "CENTER",
  },
  {
    fieldType: "EVENT_TITLE",
    label: "Event Activity Title",
    defaultValue: "Annual Campus Autonomous AI Hackathon 2026",
    xPercent: 50.0,
    yPercent: 58.0,
    fontFamily: "HELVETICA",
    fontSize: 16,
    fontStyle: "BOLD",
    colorHex: "#0F172A",
    alignment: "CENTER",
  },
  {
    fieldType: "ISSUE_DATE",
    label: "Issue Date",
    defaultValue: "28 October 2026",
    xPercent: 25.0,
    yPercent: 78.0,
    fontFamily: "HELVETICA",
    fontSize: 11,
    fontStyle: "REGULAR",
    colorHex: "#475569",
    alignment: "CENTER",
  },
  {
    fieldType: "CERTIFICATE_NUMBER",
    label: "Certificate Number",
    defaultValue: "CERT-2026-CAMPUS-0100",
    xPercent: 75.0,
    yPercent: 78.0,
    fontFamily: "COURIER",
    fontSize: 10,
    fontStyle: "BOLD",
    colorHex: "#475569",
    alignment: "CENTER",
  },
  {
    fieldType: "QR_CODE",
    label: "Verification QR Code",
    xPercent: 88.0,
    yPercent: 85.0,
    qrSizePt: 65.0,
    alignment: "CENTER",
  },
];

function extractFieldConfigs(jsonStr?: string): CertificateFieldConfig[] {
  if (!jsonStr) {
    return DEFAULT_FIELDS;
  }
  try {
    const parsed = JSON.parse(jsonStr);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    // fallback
  }
  return DEFAULT_FIELDS;
}

export function ClubAdminCertificateManager() {
  const [activeTab, setActiveTab] = useState<"templates" | "issue" | "batches">("templates");

  // Club Context State
  const [clubs, setClubs] = useState<ClubItem[]>([]);
  const [selectedClubId, setSelectedClubId] = useState<string>("");
  const [isLoadingClubs, setIsLoadingClubs] = useState(false);
  const [clubAuthError, setClubAuthError] = useState<string | null>(null);

  // Tab 1: Template Management & Visual Editor
  const [templates, setTemplates] = useState<CertificateTemplateResponse[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<CertificateTemplateResponse | null>(null);
  const [fieldConfigs, setFieldConfigs] = useState<CertificateFieldConfig[]>(DEFAULT_FIELDS);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSavingLayout, setIsSavingLayout] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Upload Form Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateDesc, setNewTemplateDesc] = useState("");
  const [newTemplateOrientation, setNewTemplateOrientation] = useState<"LANDSCAPE" | "PORTRAIT">("LANDSCAPE");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Live PDF Preview State
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  // Tab 2: Event Attendee Preview & Bulk Issuance
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [selectedIssueTemplateId, setSelectedIssueTemplateId] = useState<string>("");
  const [sendEmailToggle, setSendEmailToggle] = useState(true);
  const [eligibilityPreview, setEligibilityPreview] = useState<BulkIssuePreviewResponse | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [previewFetchError, setPreviewFetchError] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isIssuing, setIsIssuing] = useState(false);
  const [issueResultMsg, setIssueResultMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Tab 3: Batch Delivery Tracking
  const [activeBatchId, setActiveBatchId] = useState<string>("");
  const [batchStatus, setBatchStatus] = useState<BatchDeliveryStatusResponse | null>(null);
  const [batchFetchError, setBatchFetchError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [autoPoll, setAutoPoll] = useState(true);

  // 1. Load clubs available to the user
  useEffect(() => {
    let mounted = true;
    queueMicrotask(() => {
      if (mounted) {
        setIsLoadingClubs(true);
        setClubAuthError(null);
      }
    });

    api.clubs
      .search({ size: 50 })
      .then((res) => {
        if (!mounted) return;
        const allClubs = res?.data?.content || [];
        setClubs(allClubs);
        if (allClubs.length > 0) {
          setSelectedClubId((prev) => prev || allClubs[0].id);
        }
      })
      .catch((err) => {
        if (!mounted) return;
        setClubAuthError(err instanceof Error ? err.message : "Failed to load clubs");
      })
      .finally(() => {
        if (mounted) setIsLoadingClubs(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // 2. Fetch templates for selected club
  useEffect(() => {
    if (!selectedClubId) return;
    let mounted = true;
    queueMicrotask(() => {
      if (mounted) {
        setIsLoadingTemplates(true);
        setClubAuthError(null);
        setUploadError(null);
      }
    });

    api.certificates
      .getTemplatesForClub(selectedClubId)
      .then((res) => {
        if (!mounted) return;
        const list = res?.data || [];
        setTemplates(list);
        if (list.length > 0) {
          setSelectedTemplate(list[0]);
          setFieldConfigs(extractFieldConfigs(list[0].fieldsConfigJson));
        } else {
          setSelectedTemplate(null);
          setFieldConfigs(DEFAULT_FIELDS);
        }
      })
      .catch((err: unknown) => {
        if (!mounted) return;
        if (err && typeof err === "object" && "status" in err && (err as { status: number }).status === 403) {
          setClubAuthError("You are not authorized to manage certificate templates for this club. Please select a club you administrate.");
        } else {
          setClubAuthError(err instanceof Error ? err.message : "Failed to load templates");
        }
        setTemplates([]);
      })
      .finally(() => {
        if (mounted) setIsLoadingTemplates(false);
      });

    return () => {
      mounted = false;
    };
  }, [selectedClubId]);

  // 3. Fetch completed events for the selected club
  useEffect(() => {
    if (!selectedClubId) return;
    api.events
      .search({ clubId: selectedClubId, size: 50 })
      .then((res) => {
        const allEvents = res?.data?.content || [];
        const completed = allEvents.filter((e) => e.status === "COMPLETED");
        setEvents(completed.length > 0 ? completed : allEvents);
        if (completed.length > 0) {
          setSelectedEventId(completed[0].id);
        } else if (allEvents.length > 0) {
          setSelectedEventId(allEvents[0].id);
        } else {
          setSelectedEventId("");
        }
      })
      .catch(() => {
        setEvents([]);
      });
  }, [selectedClubId]);

  // 4. Fetch attendee eligibility preview when event selection changes
  useEffect(() => {
    if (!selectedEventId || activeTab !== "issue") return;
    let mounted = true;
    queueMicrotask(() => {
      if (mounted) {
        setIsLoadingPreview(true);
        setPreviewFetchError(null);
      }
    });

    api.certificates
      .getBulkIssuePreview(selectedEventId)
      .then((res) => {
        if (!mounted) return;
        if (res?.data) {
          setEligibilityPreview(res.data);
          if (res.data.availableTemplates && res.data.availableTemplates.length > 0) {
            setSelectedIssueTemplateId((prev) => prev || res.data.availableTemplates[0].id);
          }
        }
      })
      .catch((err: unknown) => {
        if (!mounted) return;
        setPreviewFetchError(err instanceof Error ? err.message : "Failed to load attendee eligibility preview");
        setEligibilityPreview(null);
      })
      .finally(() => {
        if (mounted) setIsLoadingPreview(false);
      });

    return () => {
      mounted = false;
    };
  }, [selectedEventId, activeTab]);

  // 5. Batch status polling
  useEffect(() => {
    if (!activeBatchId || !autoPoll || activeTab !== "batches") return;

    const pollBatch = async () => {
      try {
        const res = await api.certificates.getBatchStatus(activeBatchId);
        if (res?.data) {
          setBatchStatus(res.data);
          if (res.data.status === "COMPLETED" || res.data.status === "FAILED" || res.data.status === "PARTIALLY_FAILED") {
            setAutoPoll(false);
          }
        }
      } catch (err: unknown) {
        setBatchFetchError(err instanceof Error ? err.message : "Failed to retrieve batch status");
      }
    };

    pollBatch();
    const intervalId = setInterval(pollBatch, 3000);
    return () => clearInterval(intervalId);
  }, [activeBatchId, autoPoll, activeTab]);

  const handleUpdateFieldCoord = <K extends keyof CertificateFieldConfig>(
    index: number,
    key: K,
    value: CertificateFieldConfig[K]
  ) => {
    setFieldConfigs((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  };

  const handleGeneratePreview = async () => {
    setIsPreviewLoading(true);
    setPreviewError(null);
    try {
      const blob = await api.certificates.previewTransient({
        templateId: selectedTemplate?.id,
        fieldsConfigJson: JSON.stringify(fieldConfigs),
        orientation: selectedTemplate?.orientation || newTemplateOrientation,
        sampleRecipientName: "Alex Mercer",
        sampleEventTitle: "Annual Campus Autonomous AI Hackathon 2026",
        sampleIssueDate: "28 October 2026",
      });

      const url = window.URL.createObjectURL(blob);
      if (previewBlobUrl) {
        window.URL.revokeObjectURL(previewBlobUrl);
      }
      setPreviewBlobUrl(url);
    } catch (err: unknown) {
      setPreviewError(err instanceof Error ? err.message : "Failed to render transient preview");
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const handleSaveLayout = async () => {
    if (!selectedTemplate) return;
    setIsSavingLayout(true);
    setSaveSuccess(false);
    try {
      const res = await api.certificates.updateTemplate(selectedTemplate.id, {
        fieldsConfigJson: JSON.stringify(fieldConfigs),
      });
      if (res?.data) {
        setSelectedTemplate(res.data);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err: unknown) {
      setPreviewError(err instanceof Error ? err.message : "Failed to update layout");
    } finally {
      setIsSavingLayout(false);
    }
  };

  const handleUploadTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !selectedClubId || !newTemplateName.trim()) {
      setUploadError("Please provide template name, club, and background file");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("clubId", selectedClubId);
    formData.append("name", newTemplateName.trim());
    if (newTemplateDesc.trim()) formData.append("description", newTemplateDesc.trim());
    formData.append("orientation", newTemplateOrientation);
    formData.append("fieldsConfigJson", JSON.stringify(fieldConfigs));

    try {
      const res = await api.certificates.createTemplate(formData);
      if (res?.data) {
        setShowUploadModal(false);
        setNewTemplateName("");
        setNewTemplateDesc("");
        setSelectedFile(null);
        // Refresh templates list
        const refreshed = await api.certificates.getTemplatesForClub(selectedClubId);
        if (refreshed?.data) {
          setTemplates(refreshed.data);
          setSelectedTemplate(res.data);
          setFieldConfigs(extractFieldConfigs(res.data.fieldsConfigJson));
        }
      }
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Failed to upload certificate template");
    } finally {
      setIsUploading(false);
    }
  };

  const handleExecuteBulkIssuance = async () => {
    if (!selectedEventId) return;
    setIsIssuing(true);
    setIssueResultMsg(null);

    try {
      const res = await api.certificates.bulkIssue(selectedEventId, {
        templateId: selectedIssueTemplateId || undefined,
        sendEmail: sendEmailToggle,
      });

      if (res?.data) {
        const { newlyIssuedCount, batchId, alreadyIssuedCount } = res.data;
        setIssueResultMsg({
          type: "success",
          text: `Successfully issued ${newlyIssuedCount} new certificates (${alreadyIssuedCount} attendees already had certificates).`,
        });
        setIsConfirmModalOpen(false);

        if (batchId) {
          setActiveBatchId(batchId);
          setActiveTab("batches");
          setAutoPoll(true);
        }

        // Refresh eligibility breakdown
        const updated = await api.certificates.getBulkIssuePreview(selectedEventId);
        if (updated?.data) setEligibilityPreview(updated.data);
      }
    } catch (err: unknown) {
      setIssueResultMsg({
        type: "error",
        text: err instanceof Error ? err.message : "Bulk certificate issuance failed",
      });
    } finally {
      setIsIssuing(false);
    }
  };

  const handleRetryFailedDeliveries = async () => {
    if (!activeBatchId) return;
    setIsRetrying(true);
    try {
      const res = await api.certificates.retryFailed(activeBatchId);
      if (res?.data) {
        setBatchStatus(res.data);
        setAutoPoll(true);
      }
    } catch (err: unknown) {
      setBatchFetchError(err instanceof Error ? err.message : "Retry request failed");
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Club Context Bar */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-600" />
            <span>Club Credential Authority</span>
          </h3>
          <p className="text-xs text-slate-500">
            Design templates, preview PDF layouts, inspect verified attendance, and manage asynchronous delivery.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-600 shrink-0">Managing Club:</label>
          <select
            value={selectedClubId}
            onChange={(e) => setSelectedClubId(e.target.value)}
            disabled={isLoadingClubs || clubs.length === 0}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-[220px]"
          >
            {clubs.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {clubAuthError && (
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 flex items-center gap-3 text-xs text-rose-800">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{clubAuthError}</span>
        </div>
      )}

      {/* Studio Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab("templates")}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === "templates"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Templates & Visual Layout</span>
        </button>

        <button
          onClick={() => setActiveTab("issue")}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === "issue"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Attendee Inspector & Bulk Issue</span>
        </button>

        <button
          onClick={() => setActiveTab("batches")}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === "batches"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Delivery Concurrency Monitor</span>
        </button>
      </div>

      {/* Tab 1: Templates & Visual Layout Editor */}
      {activeTab === "templates" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Template List & Configuration Controls */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-panel p-5 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-800">Saved Club Templates</h4>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Template</span>
                </button>
              </div>

              {isLoadingTemplates ? (
                <div className="py-8">
                  <LoadingSpinner label="Loading templates..." />
                </div>
              ) : templates.length === 0 ? (
                <div className="p-6 text-center rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
                  <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700">No Templates Found</p>
                  <p className="mt-1">Upload a background image (PNG/JPG) or single-page PDF to get started.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {templates.map((tpl) => (
                    <button
                      key={tpl.id}
                      onClick={() => {
                        setSelectedTemplate(tpl);
                        setFieldConfigs(extractFieldConfigs(tpl.fieldsConfigJson));
                      }}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between text-xs ${
                        selectedTemplate?.id === tpl.id
                          ? "border-blue-600 bg-blue-50/50 text-blue-900 font-semibold"
                          : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <div>
                        <p className="font-bold">{tpl.name}</p>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {tpl.orientation} • {tpl.active ? "Active" : "Archived"}
                        </p>
                      </div>
                      {selectedTemplate?.id === tpl.id && <Check className="w-4 h-4 text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Field Coordinates & Alignment Controls */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-800">Dynamic Text Coordinates</h4>
                  <p className="text-[11px] text-slate-500">Adjust percentages (0–100%) to position dynamic fields.</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleGeneratePreview}
                    disabled={isPreviewLoading}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isPreviewLoading ? "animate-spin" : ""}`} />
                    <span>Preview</span>
                  </button>
                  <button
                    onClick={handleSaveLayout}
                    disabled={isSavingLayout || !selectedTemplate}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
                  >
                    <span>{isSavingLayout ? "Saving..." : "Save Layout"}</span>
                  </button>
                </div>
              </div>

              {saveSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Layout updated successfully!</span>
                </div>
              )}

              <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                {fieldConfigs.map((field, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between font-semibold text-slate-800">
                      <span>{field.label}</span>
                      <span className="font-mono text-[10px] text-slate-400">{field.fieldType}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                          <span>Horizontal (X%)</span>
                          <span className="font-mono">{field.xPercent.toFixed(1)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="0.5"
                          value={field.xPercent}
                          onChange={(e) => handleUpdateFieldCoord(idx, "xPercent", parseFloat(e.target.value))}
                          className="w-full accent-blue-600"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                          <span>Vertical (Y%)</span>
                          <span className="font-mono">{field.yPercent.toFixed(1)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="0.5"
                          value={field.yPercent}
                          onChange={(e) => handleUpdateFieldCoord(idx, "yPercent", parseFloat(e.target.value))}
                          className="w-full accent-blue-600"
                        />
                      </div>
                    </div>

                    {field.fieldType !== "QR_CODE" && (
                      <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
                        <div>
                          <label className="text-slate-500 block mb-0.5">Font</label>
                          <select
                            value={field.fontFamily || "HELVETICA"}
                            onChange={(e) =>
                              handleUpdateFieldCoord(
                                idx,
                                "fontFamily",
                                e.target.value as "HELVETICA" | "TIMES_ROMAN" | "COURIER"
                              )
                            }
                            className="w-full p-1 rounded border border-slate-200 bg-white"
                          >
                            <option value="HELVETICA">Helvetica</option>
                            <option value="TIMES_ROMAN">Times</option>
                            <option value="COURIER">Courier</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-slate-500 block mb-0.5">Size (pt)</label>
                          <input
                            type="number"
                            min="8"
                            max="48"
                            value={field.fontSize || 14}
                            onChange={(e) => handleUpdateFieldCoord(idx, "fontSize", parseInt(e.target.value) || 12)}
                            className="w-full p-1 rounded border border-slate-200 bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-slate-500 block mb-0.5">Align</label>
                          <select
                            value={field.alignment || "CENTER"}
                            onChange={(e) =>
                              handleUpdateFieldCoord(
                                idx,
                                "alignment",
                                e.target.value as "LEFT" | "CENTER" | "RIGHT"
                              )
                            }
                            className="w-full p-1 rounded border border-slate-200 bg-white"
                          >
                            <option value="LEFT">Left</option>
                            <option value="CENTER">Center</option>
                            <option value="RIGHT">Right</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Live Transient PDF Preview Frame */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-5 rounded-2xl border border-slate-200 flex flex-col h-full min-h-[580px]">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-600" />
                  <h4 className="font-bold text-sm text-slate-800">Live Transient PDF Preview</h4>
                </div>
                <span className="text-[11px] font-mono text-slate-400">Streamed from backend PDF engine</span>
              </div>

              {previewError && (
                <div className="p-3 mb-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>{previewError}</span>
                </div>
              )}

              <div className="flex-1 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center border border-slate-200/80 min-h-[480px]">
                {isPreviewLoading ? (
                  <div className="py-20 text-center">
                    <LoadingSpinner label="Compiling transient PDF preview..." />
                  </div>
                ) : previewBlobUrl ? (
                  <iframe
                    src={previewBlobUrl}
                    title="Transient PDF Preview"
                    className="w-full h-[520px] rounded-xl border-none"
                  />
                ) : (
                  <div className="text-center p-8 text-xs text-slate-500 space-y-3">
                    <Award className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="font-semibold text-slate-700">No Preview Rendered</p>
                    <p className="max-w-xs mx-auto">
                      Click the &ldquo;Preview&rdquo; button to compile coordinates and render transient sample PDF stream.
                    </p>
                    <button
                      onClick={handleGeneratePreview}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Render Sample Preview</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Attendee Inspector & Bulk Issuance Workflow */}
      {activeTab === "issue" && (
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 space-y-4">
            <h4 className="font-bold text-sm text-slate-800">Event Issuance Configuration</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Select Event:</label>
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  {events.length === 0 ? (
                    <option value="">No events found</option>
                  ) : (
                    events.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.title} ({ev.status})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Certificate Template:</label>
                <select
                  value={selectedIssueTemplateId}
                  onChange={(e) => setSelectedIssueTemplateId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="">Default Canvas Layout</option>
                  {templates.map((tpl) => (
                    <option key={tpl.id} value={tpl.id}>
                      {tpl.name} ({tpl.orientation})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="sendEmail"
                  checked={sendEmailToggle}
                  onChange={(e) => setSendEmailToggle(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 accent-blue-600"
                />
                <label htmlFor="sendEmail" className="font-medium text-slate-700 cursor-pointer">
                  Dispatch email notifications with attached PDF
                </label>
              </div>
            </div>
          </div>

          {previewFetchError && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{previewFetchError}</span>
            </div>
          )}

          {issueResultMsg && (
            <div
              className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
                issueResultMsg.type === "success"
                  ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                  : "bg-rose-50 border border-rose-200 text-rose-800"
              }`}
            >
              {issueResultMsg.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600" />
              )}
              <span>{issueResultMsg.text}</span>
            </div>
          )}

          {/* Attendee Eligibility Breakdown Cards */}
          {isLoadingPreview ? (
            <div className="py-12">
              <LoadingSpinner label="Inspecting verified attendance records..." />
            </div>
          ) : eligibilityPreview ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="glass-panel p-4 rounded-2xl border border-slate-200 text-center">
                  <p className="text-xs text-slate-500 font-medium">Total Event Attendees</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{eligibilityPreview.totalAttendees}</p>
                </div>
                <div className="glass-panel p-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 text-center">
                  <p className="text-xs text-emerald-700 font-medium">Eligible to Issue</p>
                  <p className="text-2xl font-bold text-emerald-900 mt-1">{eligibilityPreview.eligibleCount}</p>
                </div>
                <div className="glass-panel p-4 rounded-2xl border border-blue-200 bg-blue-50/40 text-center">
                  <p className="text-xs text-blue-700 font-medium">Already Issued</p>
                  <p className="text-2xl font-bold text-blue-900 mt-1">{eligibilityPreview.alreadyIssuedCount}</p>
                </div>
                <div className="glass-panel p-4 rounded-2xl border border-slate-200 text-center flex items-center justify-center">
                  <button
                    onClick={() => setIsConfirmModalOpen(true)}
                    disabled={eligibilityPreview.eligibleCount === 0 || isIssuing}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Issue {eligibilityPreview.eligibleCount} Certificates</span>
                  </button>
                </div>
              </div>

              {/* Recipient Tables */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-5 rounded-2xl border border-slate-200 space-y-3">
                  <h5 className="font-bold text-xs text-slate-800">
                    Eligible Attendees ({eligibilityPreview.eligibleRecipients?.length || 0})
                  </h5>
                  <div className="max-h-64 overflow-y-auto space-y-2 text-xs">
                    {eligibilityPreview.eligibleRecipients?.map((r) => (
                      <div key={r.userId} className="p-2.5 rounded-lg border border-slate-200 bg-white flex justify-between">
                        <div>
                          <p className="font-semibold text-slate-800">{r.fullName}</p>
                          <p className="text-[11px] text-slate-500">{r.email}</p>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 self-center">
                          VERIFIED
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-panel p-5 rounded-2xl border border-slate-200 space-y-3">
                  <h5 className="font-bold text-xs text-slate-800">
                    Skipped / Prior Issued ({eligibilityPreview.skippedRecipients?.length || 0})
                  </h5>
                  <div className="max-h-64 overflow-y-auto space-y-2 text-xs">
                    {eligibilityPreview.skippedRecipients?.map((r) => (
                      <div key={r.userId} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex justify-between">
                        <div>
                          <p className="font-semibold text-slate-800">{r.fullName}</p>
                          <p className="text-[11px] text-slate-500">{r.email}</p>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-700 self-center">
                          {r.reason}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">
              Select an event to inspect attendee attendance records.
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Asynchronous Batch Delivery Concurrency Tracker */}
      {activeTab === "batches" && (
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1 max-w-md">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Tracking Batch ID:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={activeBatchId}
                  onChange={(e) => setActiveBatchId(e.target.value.trim())}
                  placeholder="Enter Batch UUID..."
                  className="flex-1 p-2 rounded-xl border border-slate-200 bg-white text-xs font-mono"
                />
                <button
                  onClick={() => setAutoPoll(true)}
                  className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs"
                >
                  Track
                </button>
              </div>
            </div>

            {batchStatus && (
              <button
                onClick={handleRetryFailedDeliveries}
                disabled={isRetrying || batchStatus.failedCount === 0}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isRetrying ? "animate-spin" : ""}`} />
                <span>Retry {batchStatus.failedCount} Failed Deliveries</span>
              </button>
            )}
          </div>

          {batchFetchError && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{batchFetchError}</span>
            </div>
          )}

          {batchStatus && (
            <div className="space-y-6">
              {/* Progress & KPI Cards */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <h5 className="font-bold text-sm text-slate-900">{batchStatus.eventTitle}</h5>
                    <p className="text-[11px] font-mono text-slate-400">Batch: {batchStatus.batchId}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full font-bold text-[10px] bg-blue-50 text-blue-700 border border-blue-200">
                    STATUS: {batchStatus.status}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                    <span>Delivery Progress</span>
                    <span>{batchStatus.progressPercentage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-500"
                      style={{ width: `${batchStatus.progressPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-center text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-slate-500">Total Count</p>
                    <p className="text-lg font-bold text-slate-800">{batchStatus.totalCount}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                    <p className="text-amber-700">Queued</p>
                    <p className="text-lg font-bold text-amber-900">{batchStatus.queuedCount}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                    <p className="text-emerald-700">Delivered</p>
                    <p className="text-lg font-bold text-emerald-900">{batchStatus.sentCount}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                    <p className="text-rose-700">Failed</p>
                    <p className="text-lg font-bold text-rose-900">{batchStatus.failedCount}</p>
                  </div>
                </div>
              </div>

              {/* Recipient Status Table */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-200 space-y-3">
                <h5 className="font-bold text-xs text-slate-800">
                  Recipient Outcomes ({batchStatus.recipients?.length || 0})
                </h5>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                        <th className="pb-2">Recipient</th>
                        <th className="pb-2">Email</th>
                        <th className="pb-2">Status</th>
                        <th className="pb-2">Attempts</th>
                        <th className="pb-2">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {batchStatus.recipients?.map((rec) => (
                        <tr key={rec.id} className="hover:bg-slate-50">
                          <td className="py-2.5 font-medium text-slate-800">{rec.recipientName}</td>
                          <td className="py-2.5 text-slate-500 font-mono text-[11px]">{rec.recipientEmail}</td>
                          <td className="py-2.5">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                rec.status === "SENT"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : rec.status === "FAILED"
                                  ? "bg-rose-50 text-rose-700"
                                  : "bg-amber-50 text-amber-700"
                              }`}
                            >
                              {rec.status}
                            </span>
                          </td>
                          <td className="py-2.5 font-mono text-slate-600">{rec.attempts}</td>
                          <td className="py-2.5 text-slate-400 text-[11px]">
                            {rec.errorMessage || (rec.sentAt ? "Delivered" : "Pending worker")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upload Template Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-bold text-base text-slate-900">Upload Certificate Template</h4>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                {uploadError}
              </div>
            )}

            <form onSubmit={handleUploadTemplate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Template Name *</label>
                <input
                  type="text"
                  required
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="e.g. Official Hackathon 2026 Certificate"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  value={newTemplateDesc}
                  onChange={(e) => setNewTemplateDesc(e.target.value)}
                  placeholder="e.g. Designed by club media team"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Orientation</label>
                <select
                  value={newTemplateOrientation}
                  onChange={(e) => setNewTemplateOrientation(e.target.value as "LANDSCAPE" | "PORTRAIT")}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="LANDSCAPE">Landscape (A4)</option>
                  <option value="PORTRAIT">Portrait (A4)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Background File (PNG, JPG, or PDF) *</label>
                <input
                  type="file"
                  required
                  ref={fileInputRef}
                  accept=".png,.jpg,.jpeg,.pdf"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !selectedFile}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs disabled:opacity-50"
                >
                  {isUploading ? "Uploading..." : "Save Template"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal Before Bulk Issuance */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <AlertTriangle className="w-6 h-6" />
              <h4 className="font-bold text-base text-slate-900">Confirm Certificate Issuance</h4>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              You are about to issue official digital certificates to{" "}
              <strong>{eligibilityPreview?.eligibleCount} attendees</strong> of &ldquo;{eligibilityPreview?.eventTitle}&rdquo;.
              {sendEmailToggle && " Each recipient will receive an email with their PDF attachment."}
            </p>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 space-y-1">
              <p className="font-bold">Important Notes:</p>
              <p>• Only attendees with HMAC-verified attendance are included.</p>
              <p>• Already issued certificates are skipped automatically (idempotent).</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteBulkIssuance}
                disabled={isIssuing}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs"
              >
                {isIssuing ? "Issuing..." : "Confirm & Issue"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
