// src/pages/admin/AdminChatViewer.tsx
import React, { useEffect, useState } from "react";
import { fetchMessages } from "../../API/chatAPI";
import { ChatMessage } from "../../types/chat";
import { chatExampleMessages } from "../../mockData/chatMessage";
import "./admin_chat_css.css";

interface AdminChatViewerProps {
  roomId: string;
}

export const AdminChatViewer = ({ roomId }: AdminChatViewerProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [reportedID, setReportedID] = useState<string>("");

  useEffect(() => {
    const loadChat = async () => {
      try {
        const response = await fetchMessages(roomId);
        setMessages(response.messages);
        setReportedID(response.myId);
      } catch (error) {
        console.error("❌ 채팅 내역 불러오기 실패:", error);
        setMessages(chatExampleMessages);
      }
    };
    loadChat();
  }, [roomId]);

  return (
    <div className="chat-whole-container">
      <div className="chat-header">
        <div className="chat-info">
          <h3>채팅방 ID: {roomId}</h3>
        </div>
      </div>

      <div className="chat-message-screen">
        {messages
          .sort(
            (a, b) =>
              new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
          )
          .map((msg, index, arr) => {
            const reportedUserMessage = msg.senderId === reportedID;
            const currentDate = new Date(msg.sentAt).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              weekday: "long",
            });
            const prevDate =
              index > 0
                ? new Date(arr[index - 1].sentAt).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    weekday: "long",
                  })
                : null;
            const showDateSeparator = currentDate !== prevDate;

            return (
              <React.Fragment key={msg.messageId}>
                {showDateSeparator && (
                  <div className="chat-date-separator">📅 {currentDate}</div>
                )}
                <div
                  className={`chat-message-row ${
                    reportedUserMessage ? "mine" : "opponent"
                  }`}
                >
                  <div className="chat-bubble-row">
                    {reportedUserMessage ? (
                      <>
                        <div className="chat-bubble opponent">{msg.message}</div>
                        <div className="chat-time">
                          {new Date(msg.sentAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="chat-time">
                          {new Date(msg.sentAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <div className="chat-bubble mine">{msg.message}</div>
                      </>
                    )}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
      </div>
    </div>
  );
};

