import { useState, useRef } from "react";
import { useApp } from "../context/AppContext";
import {
  FileText,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Pin,
  Trash2,
  Plus,
  Sparkles,
  Send,
  MessageSquare,
  Coins,
  Building
} from "lucide-react";
export const AdvisorNotesSection = ({ lead }) => {
  const { addLeadNote, togglePinLeadNote, deleteLeadNote, currentUser } = useApp();
  const [activeFilter, setActiveFilter] = useState("all");
  const [isComposing, setIsComposing] = useState(false);
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("meeting_summary");
  const [selectedTags, setSelectedTags] = useState([]);
  const [isPinned, setIsPinned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef(null);
  const notes = lead.advisorNotes || [];
  const availableTags = [
    "Probezeit Concluded",
    "RSUs / Bonus Income",
    "Foreign Equity (Non-EU)",
    "English Notary Needed",
    "SCHUFA Discrepancy",
    "Blue Card Renewal Pending",
    "KfW Subsidy Eligible",
    "Dual-Income Couple"
  ];
  const templateMeeting = `**Initial Mortgage Consultation (30 mins)**:
\u2022 **Borrower Background**: Lived in Germany for 3 years; permanent contract past probation (*Probezeit*).
\u2022 **Purchase Intent**: 2-room apartment in ${lead.propertyCity} (~\u20AC${lead.propertyPrice.toLocaleString()}).
\u2022 **Equity & Ancil. Costs**: Liquid equity ready for down payment + 8-10% German purchase costs (Notar, Grundbuch, Grunderwerbsteuer).
\u2022 **Action Items**: Request last 3 months payslips & SCHUFA certificate.`;
  const templateFinancial = `**Financial Nuances & Non-Standard Assets**:
\u2022 **Base Net Salary**: \u20AC${lead.monthlyNetIncome.toLocaleString()}/mo.
\u2022 **Variable Compensation**: Receives quarterly vesting RSUs / annual bonus (~\u20AC18,000/yr). German lenders (ING / DSL) can consider 50-70% towards borrowing capacity.
\u2022 **Equity Breakdown**: Split between German checking account and international brokerage depot. Funds must be centralized 2 weeks before notary.
\u2022 **Special Factors**: No consumer debt; clean SCHUFA score expected.`;
  const templateBank = `**German Bank Underwriting Quirks**:
\u2022 **Lender Preference**: ING or Commerzbank for favorable 10-year fixed rate.
\u2022 **Underwriting Constraint**: Blue card validity requires minimum 12 months remaining or letter of permanent residency intent from Ausl\xE4nderbeh\xF6rde.
\u2022 **Collateral Nuance**: Building maintenance reserves (*Instandhaltungsr\xFCcklage*) are solid.`;
  const insertFormatting = (prefix, suffix = "") => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = content.substring(0, start) + prefix + (selectedText || "text") + suffix + content.substring(end);
    setContent(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selectedText.length || 4)
      );
    }, 10);
  };
  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  const handleSave = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setIsSubmitting(true);
    await addLeadNote(lead.id, {
      content,
      category,
      tags: selectedTags,
      pinned: isPinned
    });
    setContent("");
    setSelectedTags([]);
    setIsPinned(false);
    setIsComposing(false);
    setIsSubmitting(false);
  };
  const filteredNotes = notes.filter((n) => {
    if (activeFilter === "pinned") return n.pinned;
    if (activeFilter !== "all" && n.category !== activeFilter) return false;
    return true;
  });
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  const renderFormattedContent = (rawText) => {
    const lines = rawText.split("\n");
    return <div className="space-y-1.5 text-xs text-slate-200 leading-relaxed">
        {lines.map((line, idx) => {
      if (!line.trim()) {
        return <div key={idx} className="h-1" />;
      }
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedLine = parts.map((part, pIdx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={pIdx} className="font-bold text-white">
                  {part.slice(2, -2)}
                </strong>;
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return <em key={pIdx} className="italic text-slate-300">
                  {part.slice(1, -1)}
                </em>;
        }
        return part;
      });
      if (line.trim().startsWith("\u2022") || line.trim().startsWith("-")) {
        return <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="text-blue-400 font-bold">•</span>
                <span className="flex-1">{formattedLine}</span>
              </div>;
      }
      if (/^\d+\./.test(line.trim())) {
        return <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="text-amber-400 font-semibold">{line.trim().split(" ")[0]}</span>
                <span className="flex-1">{line.trim().replace(/^\d+\.\s*/, "")}</span>
              </div>;
      }
      if (line.trim().startsWith(">")) {
        return <div
          key={idx}
          className="pl-3 py-1 my-1 border-l-2 border-blue-500 bg-blue-950/20 rounded-r text-blue-200 italic"
        >
                {line.trim().substring(1).trim()}
              </div>;
      }
      return <p key={idx}>{formattedLine}</p>;
    })}
      </div>;
  };
  const getCategoryBadge = (cat) => {
    switch (cat) {
      case "meeting_summary":
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <MessageSquare className="w-2.5 h-2.5" />
            <span>Meeting Summary</span>
          </span>;
      case "financial_nuance":
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
            <Coins className="w-2.5 h-2.5" />
            <span>Financial Nuance</span>
          </span>;
      case "bank_criteria":
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
            <Building className="w-2.5 h-2.5" />
            <span>Bank Criteria</span>
          </span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
            Note
          </span>;
    }
  };
  return <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-sm">
      {
    /* Section Header */
  }
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            <h3 className="font-extrabold text-sm text-white">
              Advisor Notes & Expat Financial Nuances
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-300 border border-slate-700">
              {notes.length}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Log meeting summaries, RSUs/equity splits, probation (*Probezeit*) status, and German bank quirks.
          </p>
        </div>

        {!isComposing && <button
    onClick={() => setIsComposing(true)}
    className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition"
  >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Rich Note</span>
          </button>}
      </div>

      {
    /* Filter Tabs */
  }
      <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
        <button
    onClick={() => setActiveFilter("all")}
    className={`px-2.5 py-1 rounded-lg font-medium transition ${activeFilter === "all" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"}`}
  >
          All Notes ({notes.length})
        </button>
        <button
    onClick={() => setActiveFilter("meeting_summary")}
    className={`px-2.5 py-1 rounded-lg font-medium transition ${activeFilter === "meeting_summary" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"}`}
  >
          Meeting Summaries ({notes.filter((n) => n.category === "meeting_summary").length})
        </button>
        <button
    onClick={() => setActiveFilter("financial_nuance")}
    className={`px-2.5 py-1 rounded-lg font-medium transition ${activeFilter === "financial_nuance" ? "bg-amber-600 text-white" : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"}`}
  >
          Financial Nuances ({notes.filter((n) => n.category === "financial_nuance").length})
        </button>
        <button
    onClick={() => setActiveFilter("bank_criteria")}
    className={`px-2.5 py-1 rounded-lg font-medium transition ${activeFilter === "bank_criteria" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"}`}
  >
          Bank Criteria ({notes.filter((n) => n.category === "bank_criteria").length})
        </button>
        <button
    onClick={() => setActiveFilter("pinned")}
    className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1 ${activeFilter === "pinned" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"}`}
  >
          <Pin className="w-3 h-3" />
          <span>Pinned ({notes.filter((n) => n.pinned).length})</span>
        </button>
      </div>

      {
    /* COMPOSER / RICH NOTE EDITOR */
  }
      {isComposing && <form
    onSubmit={handleSave}
    className="bg-slate-900 rounded-xl p-4 border border-blue-500/40 space-y-3.5 shadow-lg"
  >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Compose Advisor Note</span>
            </span>

            {
    /* Category Select Buttons */
  }
            <div className="flex items-center gap-1 text-[11px]">
              <button
    type="button"
    onClick={() => setCategory("meeting_summary")}
    className={`px-2 py-0.5 rounded font-semibold transition ${category === "meeting_summary" ? "bg-emerald-600 text-white" : "text-slate-400 hover:bg-slate-800"}`}
  >
                Meeting Summary
              </button>
              <button
    type="button"
    onClick={() => setCategory("financial_nuance")}
    className={`px-2 py-0.5 rounded font-semibold transition ${category === "financial_nuance" ? "bg-amber-600 text-white" : "text-slate-400 hover:bg-slate-800"}`}
  >
                Financial Nuance
              </button>
              <button
    type="button"
    onClick={() => setCategory("bank_criteria")}
    className={`px-2 py-0.5 rounded font-semibold transition ${category === "bank_criteria" ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800"}`}
  >
                Bank Criteria
              </button>
            </div>
          </div>

          {
    /* Quick Starter Templates Pill Bar */
  }
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] bg-slate-950/60 p-2 rounded-lg border border-slate-800">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <span>Insert Template:</span>
            </span>
            <button
    type="button"
    onClick={() => {
      setCategory("meeting_summary");
      setContent(templateMeeting);
    }}
    className="px-2 py-0.5 rounded bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/40 font-medium transition"
  >
              + Meeting Summary
            </button>
            <button
    type="button"
    onClick={() => {
      setCategory("financial_nuance");
      setContent(templateFinancial);
    }}
    className="px-2 py-0.5 rounded bg-amber-950/50 hover:bg-amber-900/60 text-amber-300 border border-amber-800/40 font-medium transition"
  >
              + RSUs & Equity Nuance
            </button>
            <button
    type="button"
    onClick={() => {
      setCategory("bank_criteria");
      setContent(templateBank);
    }}
    className="px-2 py-0.5 rounded bg-blue-950/50 hover:bg-blue-900/60 text-blue-300 border border-blue-800/40 font-medium transition"
  >
              + German Bank Underwriting Quirks
            </button>
          </div>

          {
    /* Rich Formatting Toolbar */
  }
          <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-lg border border-slate-800 text-slate-300 text-xs">
            <button
    type="button"
    onClick={() => insertFormatting("**", "**")}
    title="Bold"
    className="p-1 rounded hover:bg-slate-800 hover:text-white"
  >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
    type="button"
    onClick={() => insertFormatting("*", "*")}
    title="Italic"
    className="p-1 rounded hover:bg-slate-800 hover:text-white"
  >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <span className="h-3 w-px bg-slate-800 mx-1" />
            <button
    type="button"
    onClick={() => insertFormatting("\u2022 ")}
    title="Bullet Point"
    className="p-1 rounded hover:bg-slate-800 hover:text-white"
  >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
    type="button"
    onClick={() => insertFormatting("1. ")}
    title="Numbered List"
    className="p-1 rounded hover:bg-slate-800 hover:text-white"
  >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>
            <button
    type="button"
    onClick={() => insertFormatting("> ")}
    title="Quote / Callout"
    className="p-1 rounded hover:bg-slate-800 hover:text-white"
  >
              <Quote className="w-3.5 h-3.5" />
            </button>

            <span className="h-3 w-px bg-slate-800 mx-1" />
            <span className="text-[10px] text-slate-500">Supports Markdown formatting</span>
          </div>

          {
    /* Textarea */
  }
          <textarea
    ref={textareaRef}
    rows={5}
    required
    placeholder="Type meeting summary, German equity specifics, probation nuances, or bank underwriting quirks..."
    value={content}
    onChange={(e) => setContent(e.target.value)}
    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono leading-relaxed"
  />

          {
    /* One-Click Expat Nuance Tags */
  }
          <div className="space-y-1.5">
            <span className="text-[10px] font-semibold text-slate-400 block">
              Attach Expat Nuance Tags:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {availableTags.map((tag) => {
    const isSelected = selectedTags.includes(tag);
    return <button
      key={tag}
      type="button"
      onClick={() => toggleTag(tag)}
      className={`px-2 py-0.5 rounded text-[10px] font-medium transition ${isSelected ? "bg-blue-600 text-white font-semibold" : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"}`}
    >
                    {tag}
                  </button>;
  })}
            </div>
          </div>

          {
    /* Footer Controls */
  }
          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
    type="checkbox"
    checked={isPinned}
    onChange={(e) => setIsPinned(e.target.checked)}
    className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-0 cursor-pointer"
  />
              <span className="flex items-center gap-1 font-medium">
                <Pin className="w-3 h-3 text-amber-400" />
                <span>Pin to top of case</span>
              </span>
            </label>

            <div className="flex items-center gap-2">
              <button
    type="button"
    onClick={() => {
      setIsComposing(false);
      setContent("");
    }}
    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
  >
                Cancel
              </button>
              <button
    type="submit"
    disabled={isSubmitting || !content.trim()}
    className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md shadow-blue-600/30 flex items-center gap-1.5 transition"
  >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? "Saving..." : "Save Advisor Note"}</span>
              </button>
            </div>
          </div>
        </form>}

      {
    /* NOTES LIST */
  }
      <div className="space-y-3">
        {sortedNotes.length === 0 ? <div className="py-8 px-4 text-center rounded-xl border border-dashed border-slate-800 text-slate-500 text-xs space-y-2">
            <p>No advisor notes found in this category.</p>
            <p className="text-[11px] text-slate-600">
              Click "Add Rich Note" to record first meeting takeaways, stock grants, or bank criteria.
            </p>
          </div> : sortedNotes.map((note) => {
    return <div
      key={note.id}
      className={`rounded-xl p-4 border transition-all text-xs space-y-3 relative group ${note.pinned ? "bg-gradient-to-b from-amber-950/20 to-slate-900 border-amber-500/40 shadow-sm" : "bg-slate-900/80 border-slate-800 hover:border-slate-700"}`}
    >
                {
      /* Header: Author & Category & Pinned Pill */
    }
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <img
      src={note.authorAvatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"}
      alt={note.authorName}
      className="w-7 h-7 rounded-full object-cover border border-slate-700"
    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{note.authorName}</span>
                        {getCategoryBadge(note.category)}
                        {note.pinned && <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                            <Pin className="w-2.5 h-2.5" />
                            <span>Pinned</span>
                          </span>}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(note.createdAt).toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: "numeric"
    })}{" "}
                        at{" "}
                        {new Date(note.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    })}
                      </span>
                    </div>
                  </div>

                  {
      /* Actions: Pin & Delete */
    }
                  <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition">
                    <button
      onClick={() => togglePinLeadNote(lead.id, note.id, !note.pinned)}
      title={note.pinned ? "Unpin note" : "Pin note to top"}
      className={`p-1.5 rounded transition ${note.pinned ? "text-amber-400 bg-amber-500/10 hover:bg-amber-500/20" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"}`}
    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                    <button
      onClick={() => {
        if (confirm("Delete this advisor note?")) {
          deleteLeadNote(lead.id, note.id);
        }
      }}
      title="Delete note"
      className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {
      /* Content Rendering */
    }
                <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
                  {renderFormattedContent(note.content)}
                </div>

                {
      /* Tags */
    }
                {note.tags && note.tags.length > 0 && <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {note.tags.map((t) => <span
      key={t}
      className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800/80 text-blue-300 border border-slate-700/60"
    >
                        #{t}
                      </span>)}
                  </div>}
              </div>;
  })}
      </div>
    </div>;
};
