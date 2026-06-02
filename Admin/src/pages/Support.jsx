import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

const Support = () => {

  const [contacts, setContacts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [selectedMessage, setSelectedMessage] =
    useState(null);

  const [reply, setReply] =
    useState("");

  const [sending, setSending] =
    useState(false);

  // =========================================
  // FETCH CONTACTS
  // =========================================
  const fetchContacts =
    async () => {

      try {

        const { data } =
          await axios.get(
            "http://localhost:5000/api/contact"
          );

        setContacts(
          data.contacts || []
        );

      } catch (error) {

        console.log(error);

        alert(
          "Failed to load support messages"
        );

      } finally {

        setLoading(false);
      }
    };

  // =========================================
  // DELETE CONTACT
  // =========================================
  const deleteContact =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete this message?"
        );

      if (!confirmDelete)
        return;

      try {

        await axios.delete(
          `http://localhost:5000/api/contact/${id}`
        );

        setContacts((prev) =>
          prev.filter(
            (item) =>
              item._id !== id
          )
        );

        if (
          selectedMessage?._id === id
        ) {

          setSelectedMessage(
            null
          );
        }

        alert(
          "Message deleted successfully"
        );

      } catch (error) {

        console.log(error);

        alert(
          "Failed to delete message"
        );
      }
    };

  // =========================================
  // SEND REPLY
  // =========================================
  const sendReply =
    async () => {

      if (!reply.trim()) {

        return alert(
          "Reply cannot be empty"
        );
      }

      try {

        setSending(true);

        const { data } =
          await axios.put(
            `http://localhost:5000/api/contact/reply/${selectedMessage._id}`,
            {
              reply,
            }
          );

        alert(
          data.message
        );

        // UPDATE CONTACT LIST
        setContacts((prev) =>
          prev.map((item) =>
            item._id ===
            selectedMessage._id
              ? {
                  ...item,
                  adminReply:
                    reply,
                  status:
                    "Resolved",
                }
              : item
          )
        );

        // UPDATE SELECTED MESSAGE
        setSelectedMessage({
          ...selectedMessage,
          adminReply:
            reply,
          status:
            "Resolved",
        });

        setReply("");

      } catch (error) {

        console.log(error);

        alert(
          error.response?.data
            ?.message ||
            "Failed to send reply"
        );

      } finally {

        setSending(false);
      }
    };

  // =========================================
  // LOAD CONTACTS
  // =========================================
  useEffect(() => {

    fetchContacts();

  }, []);

  // =========================================
  // LOADING
  // =========================================
  if (loading) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-gray-100 text-xl font-semibold">

        Loading support messages...

      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gray-100 p-4 md:p-6">

      {/* HEADER */}

      <div className="mb-6">

        <h1 className="text-3xl font-bold">
          Support Messages
        </h1>

        <p className="mt-2 text-gray-500">
          Manage customer contact requests
        </p>

      </div>

      {/* EMPTY STATE */}

      {contacts.length === 0 && (

        <div className="rounded-2xl bg-white p-8 text-center text-gray-500 shadow">

          No support messages found.

        </div>
      )}

      {/* CONTENT */}

      {contacts.length > 0 && (

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* ===================================== */}
          {/* LEFT SIDE */}
          {/* ===================================== */}

          <div className="overflow-hidden rounded-2xl bg-white shadow">

            <div className="border-b px-5 py-4 text-lg font-bold">

              All Messages

            </div>

            <div className="max-h-[700px] overflow-y-auto">

              {contacts.map((contact) => (

                <div
                  key={contact._id}
                  onClick={() => {

                    setSelectedMessage(
                      contact
                    );

                    setReply(
                      contact.adminReply ||
                        ""
                    );
                  }}
                  className={`cursor-pointer border-b p-4 transition hover:bg-gray-50 ${
                    selectedMessage?._id ===
                    contact._id
                      ? "bg-gray-100"
                      : ""
                  }`}
                >

                  <div className="flex items-center justify-between">

                    <h3 className="font-semibold">
                      {contact.name}
                    </h3>

                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        contact.status ===
                        "Resolved"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >

                      {contact.status}

                    </span>

                  </div>

                  <p className="mt-1 truncate text-sm text-gray-600">

                    {contact.subject}

                  </p>

                  <p className="mt-2 text-xs text-gray-400">

                    {new Date(
                      contact.createdAt
                    ).toLocaleString()}

                  </p>

                </div>
              ))}

            </div>

          </div>

          {/* ===================================== */}
          {/* RIGHT SIDE */}
          {/* ===================================== */}

          <div className="rounded-2xl bg-white p-6 shadow lg:col-span-2">

            {selectedMessage ? (

              <>

                {/* TOP */}

                <div className="flex flex-col gap-4 border-b pb-5 md:flex-row md:items-start md:justify-between">

                  <div>

                    <h2 className="text-2xl font-bold">

                      {
                        selectedMessage.subject
                      }

                    </h2>

                    <p className="mt-2 text-gray-500">

                      From:{" "}

                      <span className="font-semibold">

                        {
                          selectedMessage.name
                        }

                      </span>

                    </p>

                    <p className="text-gray-500">

                      Email:{" "}

                      <span className="font-semibold">

                        {
                          selectedMessage.email
                        }

                      </span>

                    </p>

                    <p className="mt-2 text-sm text-gray-400">

                      {new Date(
                        selectedMessage.createdAt
                      ).toLocaleString()}

                    </p>

                  </div>

                  <button
                    onClick={() =>
                      deleteContact(
                        selectedMessage._id
                      )
                    }
                    className="rounded-xl bg-red-500 px-5 py-2 font-semibold text-white hover:bg-red-600"
                  >

                    Delete

                  </button>

                </div>

                {/* USER MESSAGE */}

                <div className="mt-6">

                  <h3 className="mb-3 text-lg font-bold">

                    Customer Message

                  </h3>

                  <div className="whitespace-pre-wrap rounded-2xl bg-gray-50 p-5 leading-relaxed text-gray-700">

                    {
                      selectedMessage.message
                    }

                  </div>

                </div>

                {/* OLD REPLY */}

                {selectedMessage.adminReply && (

                  <div className="mt-6">

                    <h3 className="mb-3 text-lg font-bold text-green-600">

                      Admin Reply

                    </h3>

                    <div className="whitespace-pre-wrap rounded-2xl bg-green-50 p-5 leading-relaxed text-gray-700">

                      {
                        selectedMessage.adminReply
                      }

                    </div>

                  </div>
                )}

                {/* REPLY BOX */}

                <div className="mt-8">

                  <h3 className="mb-3 text-lg font-bold">

                    Reply to Customer

                  </h3>

                  <textarea
                    rows="6"
                    placeholder="Write your solution or reply here..."
                    value={reply}
                    onChange={(e) =>
                      setReply(
                        e.target.value
                      )
                    }
                    className="w-full rounded-2xl border border-gray-300 p-4 focus:outline-none focus:ring-2 focus:ring-black"
                  />

                  <div className="mt-4 flex flex-wrap gap-3">

                    <button
                      onClick={sendReply}
                      disabled={sending}
                      className="rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50"
                    >

                      {sending
                        ? "Sending..."
                        : selectedMessage.adminReply
                        ? "Update Reply"
                        : "Send Reply"}

                    </button>

                    <button
                      onClick={() =>
                        setReply("")
                      }
                      className="rounded-xl border border-gray-300 px-6 py-3 font-semibold hover:bg-gray-100"
                    >

                      Clear

                    </button>

                  </div>

                </div>

              </>

            ) : (

              <div className="flex h-full items-center justify-center text-lg text-gray-400">

                Select a message to view details

              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
};

export default Support;