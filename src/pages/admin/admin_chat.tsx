// src/pages/admin/AdminChatViewer.tsx
import React, { useEffect, useState } from "react";
import { fetchMessages } from "../../API/chatAPI";
import { ChatMessage } from "../../types/chat";
import { chatExampleMessages } from "../../mockData/chatMessage";

interface AdminChatViewerProps {
  roomId: string;
}

export const AdminChatViewer = ({ roomId }: AdminChatViewerProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [myID, setMyID] = useState<string>("");

  useEffect(() => {
    const loadChat = async () => {
        setMessages(chatExampleMessages);
        const response = await fetchMessages(roomId);
        setMessages(response.messages);
        setMyID(response.myId);
    };

    loadChat();
  }, [roomId]);

  return (
    <div className="chat-message-screen">
      {messages
        .sort(
          (a, b) =>
            new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
        )
        .map((msg, index, arr) => {
          const isMine = msg.senderId === myID;

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
                  isMine ? "mine" : "opponent"
                }`}
              >
                <div className="chat-bubble-row">
                  {isMine ? (
                    <>
                      <div className="chat-time">
                        {new Date(msg.sentAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      <div className="chat-bubble mine">{msg.message}</div>
                    </>
                  ) : (
                    <>
                      <div className="chat-bubble opponent">
                        {msg.message}
                      </div>
                      <div className="chat-time">
                        {new Date(msg.sentAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </React.Fragment>
          );
        })}
    </div>
  );
};
