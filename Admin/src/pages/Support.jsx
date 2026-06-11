import React, { useEffect, useState } from "react";
import { 
  Headphones, 
  Trash2, 
  Mail, 
  Clock, 
  Inbox, 
  Loader2, 
  Send, 
  CornerDownRight, 
  User,
  RotateCcw
} from "lucide-react";

import api from "../services/api";

const Support = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  // =========================================
  // FETCH CONTACTS
  // =========================================
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/contact");
      setContacts(data.contacts || []);
    } catch (error) {
      console.log("FETCH SUPPORT MESSAGES ERROR:", error);
      alert("Failed to load support messages");
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // DELETE CONTACT
  // =========================================
  const deleteContact = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this message?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/contact/${id}`);
      setContacts((prev) => prev.filter((item) => item._id !== id));

      if (selectedMessage?._id === id) {
        setSelectedMessage(null);
      }
      alert("Message deleted successfully");
    } catch (error) {
      console.log("DELETE CONTACT ERROR:", error);
      alert("Failed to delete message");
    }
  };

  // =========================================
  // SEND REPLY
  // =========================================
  const sendReply = async () => {
    if (!reply.trim()) {
      return alert("Reply cannot be empty");
    }

    try {
      setSending(true);
      const { data } = await api.put(`/contact/reply/${selectedMessage._id}`, { reply });
      alert(data.message || "Reply compiled and sent successfully");

      // UPDATE CONTACT LIST REFLECTIVELY
      setContacts((prev) =>
        prev.map((item) =>
          item._id === selectedMessage._id
            ? { ...item, adminReply: reply, status: "Resolved" }
            : item
        )
      );

      // UPDATE SELECTED ACTIVE MESSAGE STACK
      setSelectedMessage({
        ...selectedMessage,
        adminReply: reply,
        status: "Resolved",
      });

      setReply("");
    } catch (error) {
      console.log("SEND REPLY ERROR:", error);
      alert(error.response?.data?.message || "Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // =========================================
  // ASYNC LOADER SYNC WINDOW
  // =========================================
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-poppins gap-3">
        <Loader2 className="animate-spin text-indigo-600 dark:text-indigo-400" size={32} />
        <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Syncing Helpdesk Matrices...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-6 lg:p-8 text-slate-800 dark:text-slate-100 font-poppins space-y-6">
      
      {/* HEADER SECTION */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-2.5">
          <Headphones className="text-indigo-600 dark:text-indigo-400" size={26} />
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-wide uppercase">
            Support Desk
          </h1>
        </div>
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
          Review, resolve, and audit inbound client inquiries and communications
        </p>
      </div>

      {/* EMPTY SYSTEM DATA GRID STATE */}
      {contacts.length === 0 && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center text-slate-400 dark:text-slate-500 shadow-xs max-w-2xl mx-auto">
          <Inbox className="mx-auto text-slate-300 dark:text-slate-700 mb-3" size={40} />
          <p className="text-xs font-black uppercase tracking-widest">No Support Inquiries Logged</p>
        </div>
      )}

      {/* CORE WORKSPACE CONTEXT LAYOUT GRID */}
      {contacts.length > 0 && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-start">

          {/* ===================================== */}
          {/* LEFT SIDE: INBOUND TICKETS FEED LIST */}
          {/* ===================================== */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col">
            <div className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-5 py-4 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Inbound Messages Queue ({contacts.length})
            </div>

            <div className="max-h-[680px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 no-scrollbar">
              {contacts.map((contact) => {
                const isSelected = selectedMessage?._id === contact._id;
                return (
                  <div
                    key={contact._id}
                    onClick={() => {
                      setSelectedMessage(contact);
                      setReply(contact.adminReply || "");
                    }}
                    className={`cursor-pointer p-4 transition-all flex flex-col gap-1.5 text-left outline-none border-l-4 ${
                      isSelected
                        ? "bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-600 dark:border-indigo-500 pl-3"
                        : "bg-white dark:bg-slate-900/40 border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/60 pl-3"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white truncate max-w-[70%]">
                        {contact.name}
                      </h3>
                      <span
                        className={`rounded-lg px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider shrink-0 border ${
                          contact.status === "Resolved"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50"
                            : "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50"
                        }`}
                      >
                        {contact.status}
                      </span>
                    </div>

                    <p className="truncate text-xs font-semibold text-slate-600 dark:text-slate-400">
                      {contact.subject}
                    </p>

                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1">
                      <Clock size={11} />
                      <span>{new Date(contact.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ===================================== */}
          {/* RIGHT SIDE: SELECTED CONVERSATION HUB */}
          {/* ===================================== */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 md:p-6 shadow-sm lg:col-span-2 space-y-6">
            {selectedMessage ? (
              <>
                {/* TICKET TOP DETAILS CONTROL ACTION BAR */}
                <div className="flex flex-col gap-4 border-b border-slate-100 dark:border-slate-800 pb-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-400 dark:border-indigo-900/50">
                      Subject Matter
                    </span>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight pt-1">
                      {selectedMessage.subject}
                    </h2>
                    
                    <div className="flex flex-col gap-0.5 pt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      <p className="flex items-center gap-1.5">
                        <User size={13} className="text-slate-400 dark:text-slate-500" />
                        <span>Client: <strong className="text-slate-700 dark:text-slate-300">{selectedMessage.name}</strong></span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Mail size={13} className="text-slate-400 dark:text-slate-500" />
                        <span>Address: <strong className="text-indigo-600 dark:text-indigo-400 font-mono text-[11px] font-medium">{selectedMessage.email}</strong></span>
                      </p>
                      <p className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                        <Clock size={13} className="text-slate-400 dark:text-slate-500" />
                        <span>Logged: {new Date(selectedMessage.createdAt).toLocaleString()}</span>
                      </p>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => deleteContact(selectedMessage._id)}
                      className="rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100/70 dark:hover:bg-rose-900/40 px-4 py-2 text-xs font-bold transition flex items-center gap-1.5 w-full sm:w-auto justify-center shadow-xs"
                    >
                      <Trash2 size={14} />
                      <span>Purge Entry</span>
                    </button>
                  </div>
                </div>

                {/* VISUAL INBOUND INQUIRY THREAD BLOCK */}
                <div className="space-y-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                    <Mail size={13} className="text-slate-400 dark:text-slate-500" />
                    Customer Raw Message
                  </h3>
                  <div className="whitespace-pre-wrap rounded-2xl border border-slate-100 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-950 p-4 text-sm font-semibold text-slate-700 dark:text-slate-300 leading-relaxed shadow-xs">
                    {selectedMessage.message}
                  </div>
                </div>

                {/* PAST RECORDED RESOLUTION FEEDBACK BLOCK */}
                {selectedMessage.adminReply && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <CornerDownRight size={13} />
                      Dispatched Solution Log
                    </h3>
                    <div className="whitespace-pre-wrap rounded-2xl border border-emerald-100 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/30 p-4 text-sm font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
                      {selectedMessage.adminReply}
                    </div>
                  </div>
                )}

                {/* CORRESPONDENCE OUTBOUND INTERACTION TERMINAL */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Draft Response Console
                  </h3>
                  <textarea
                    rows="5"
                    placeholder="Provide technical support, operational workflows, or administrative answers to resolve this ticket..."
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 text-sm font-semibold text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-600 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition"
                  />

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={sendReply}
                      disabled={sending}
                      className="rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white px-6 py-2.5 text-xs font-bold transition shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {sending ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          <span>Transmitting...</span>
                        </>
                      ) : (
                        <>
                          <Send size={14} />
                          <span>
                            {selectedMessage.adminReply ? "Modify Archive Reply" : "Transmit Dispatch Solution"}
                          </span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setReply("")}
                      className="rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 px-5 py-2.5 text-xs font-bold transition flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    >
                      <RotateCcw size={14} />
                      <span>Clear Draft</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex h-64 flex-col items-center justify-center text-slate-400 dark:text-slate-500 gap-2 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950/40">
                <Headphones className="text-slate-300 dark:text-slate-700" size={32} />
                <p className="text-xs font-black uppercase tracking-widest">
                  Select a support message record to audit
                </p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};

export default Support;