import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  enterChatRoom,
  fetchMessages,
  sendImageApi,
  reportRequest,
  tradeRequest,
  connectAndSubscribe, // 🔌 새로 추가된 STOMP 연결 함수
  sendStompMessage, // 💬 새로 추가된 STOMP 전송 함수
} from "../../API/chatAPI";
import { ChatMessage } from "../../types/chat";
import "./chat.css";
import return_button from "../../assets/return_button.png";
import dotButtonImg from "../../assets/dot_button.png";
import pictureImg from "../../assets/chat_picture.png";
import sendImg from "../../assets/send.png";
import { chatExampleMessages } from "../../mockData/chatMessage"; // 더 이상 사용되지 않음
import { Client } from "@stomp/stompjs"; // STOMP 타입 정의를 위해 유지

const location = useLocation();
const { roomName, postName, img } = location.state || {
  roomName: "",
  postName: "",
  img: "",
};

// ✅ 이미지의 기본 경로 정의
const BASE_IMAGE_URL = "https://api.stg.subook.shop/";

// ✅ 상대 경로를 완전한 URL로 변환하는 유틸리티 함수 (Chat.tsx에 유지)
const getImageUrl = (path: string | undefined): string | undefined => {
  if (!path) return undefined;

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  let combinedPath = `${BASE_IMAGE_URL}${path}`;
  if (BASE_IMAGE_URL.endsWith("/") && path.startsWith("/")) {
    combinedPath = `${BASE_IMAGE_URL}${path.substring(1)}`;
  }

  return combinedPath;
};

const Chat = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [dotButton, setDotButton] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null); // 실제 이미지 파일
  const [selectedImg, setSelectedImg] = useState<string | undefined>(undefined); // 이미지 미리보기

  const [myID, setMyID] = useState<string>("");
  const [opponentID, setOpponentID] = useState<string>("");
  // 🔌 STOMP client 객체를 저장하는 상태 (연결 해제용)
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [postId, setPostId] = useState<string | null>(null);
  const [sellerTF, setSellerTF] = useState<boolean>(false);

  const reasonList = ["욕설", "비방", "광고", "도배", "부적절한_내용"];

  const chatScreenRef = useRef<HTMLDivElement>(null);

  // --- UI/Modal 토글 함수 (유지) ---
  const toggleDotButton = () => setDotButton((prev) => !prev);
  const openReportModal = () => {
    setReportOpen(true);
    setDotButton(false);
  };
  const closeReportModal = () => {
    setReportOpen(false);
    setReportReason(null);
  };

  // --- 신고 제출 (API 호출은 chatAPI.ts에서 가져옴) ---
  const handleReportSubmit = async () => {
    if (!reportReason) return alert("신고 사유를 선택해주세요.");

    const targetId = opponentID || roomId;
    if (!targetId) {
      alert("신고 대상이 불명확합니다.");
      return;
    }

    console.log("🚨 신고 제출 시작", { targetId, reportReason });
    try {
      // ✅ reportRequest API 호출 (로컬 폴백 처리도 API 내부로 분리됨)
      await reportRequest(targetId, reportReason);
      alert("신고가 접수되었습니다.");
      closeReportModal();
    } catch (err) {
      console.error("❌ 신고 전송 실패:", err);
      alert("신고 전송 중 오류가 발생했습니다.");
    }
  };

  // --- 거래 요청 (API 호출은 chatAPI.ts에서 가져옴) ---
  const handleTradeRequest = async () => {
    if (!postId) return alert("게시글 ID가 없습니다.");
    if (!opponentID) return alert("상대방 ID를 알 수 없습니다.");
    if (!confirm("정말로 이 책을 구매하시겠습니까?")) return;

    try {
      // ✅ tradeRequest API 호출
      await tradeRequest(postId, opponentID);
      alert("거래 요청이 전송되었습니다.");
    } catch (err) {
      console.error("거래 요청 실패:", err);
      alert("거래 요청 중 오류가 발생했습니다.");
    }
  };

  // --- 이미지 처리 함수 (유지) ---
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setSelectedImg(window.URL.createObjectURL(file));
  };
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setSelectedImg(undefined);
  };

  // --- 메시지 전송 함수 (STOMP 로직 분리) ---
  const sendMessage = async () => {
    if (!roomId) return console.error("❌ roomId 없음");

    const hasImage = !!selectedFile;
    const hasText = inputMessage.trim().length > 0;

    if (!hasImage && !hasText) {
      alert("전송할 내용이 없습니다.");
      return;
    }

    try {
      // 🖼️ 1️⃣ 이미지가 있다면 먼저 REST로 전송 (chatAPI 함수 사용)
      if (hasImage) {
        const senderId = myID;
        console.log("🖼️ 이미지 전송 시도:", selectedFile?.name);

        // ✅ API 호출
        const imgResponse = await sendImageApi(roomId, selectedFile!, senderId);

        // 이미지 전송 후, 이미지를 메시지에 추가
        if (imgResponse.data) {
          setMessages((prev) => [...prev, imgResponse.data]);
        }
        console.log("✅ 이미지 전송 성공:", imgResponse.data);
        setSelectedFile(null);
        setSelectedImg(undefined);

        // 💬 2️⃣ 이미지 성공 후 텍스트도 있다면 STOMP로 전송 (새로운 chatAPI 함수 사용)
        if (hasText && stompClient && stompClient.connected) {
          console.log("💬 이미지 전송 성공 후 텍스트 전송:", inputMessage);
          // ✅ API 호출
          sendStompMessage(stompClient, roomId, inputMessage, myID || "me");
          setInputMessage("");
        }
        return;
      }

      // 💬 3️⃣ 이미지가 없고 텍스트만 있는 경우 (새로운 chatAPI 함수 사용)
      if (hasText && stompClient && stompClient.connected) {
        console.log("💬 텍스트 전송:", inputMessage);
        // ✅ API 호출
        sendStompMessage(stompClient, roomId, inputMessage, myID || "me");
        setInputMessage("");
      }
    } catch (err) {
      console.error("❌ 메시지 전송 실패:", err);
      alert("메시지 전송 중 오류가 발생했습니다.");
    }
  };

  // 1️⃣ 초기 메시지 로드 (REST API)
  useEffect(() => {
    if (!roomId) return;

    // 채팅방 입장 및 postId 설정
    enterChatRoom(roomId)
      .then((postId) => postId && setPostId(postId))
      .catch((err) => console.error("❌ 채팅방 입장 중 에러:", err));

    // 메시지 이력 불러오기
    fetchMessages(roomId)
      .then(({ myId, messages, opponentId, imSeller }) => {
        setMyID(myId);
        setOpponentID(opponentId || "알 수 없음");
        setSellerTF(imSeller);
        setMessages(messages || []);
      })
      .catch((err) => {
        console.error("❌ 메시지 불러오기 실패:", err);
        setMessages(chatExampleMessages); // mock data 사용은 제거
        alert("⚠️ 채팅방 메시지 불러오기 실패");
      });
  }, [roomId]);

  // 2️⃣ STOMP WebSocket 연결 및 구독 (로직 분리)
  useEffect(() => {
    if (!roomId) return;

    let client: Client | undefined;

    try {
      // ✅ chatAPI의 connectAndSubscribe 함수를 사용하여 연결 및 구독
      client = connectAndSubscribe(roomId, (newMessage) => {
        // 새 메시지 수신 시 호출되는 콜백 (컴포넌트의 상태 업데이트)
        setMessages((prev) => [...prev, newMessage]);
      });

      setStompClient(client); // 전역 상태에 저장하여 전송 및 해제에 사용
    } catch (error) {
      console.error("❌ STOMP 연결 설정 실패:", error);
    }

    return () => {
      // 컴포넌트 언마운트 시 연결 해제
      if (client) {
        console.log("🔌 STOMP 연결 해제 (클린업)");
        client.deactivate();
      }
    };
  }, [roomId]);

  // 3. 메시지 목록이 업데이트될 때마다 최하단으로 스크롤 (유지)
  useEffect(() => {
    if (chatScreenRef.current) {
      chatScreenRef.current.scrollTop = chatScreenRef.current.scrollHeight;
    }
  }, [messages]);

  //======================================JSX 부분======================================//

  return (
    <div className="chat-whole-container">
      {/* 🔼 상단 헤더 */}
      <div className="chat-header">
        <img
          className="chat-return-button"
          src={return_button}
          alt="돌아가기"
          // onClick 핸들러 추가 필요 (예: navigate(-1))
        />
        <div className="chat-info">
          <div className="opponentName">{roomName || "상대방 이름"}</div>
          <div className="chat-board-name">{postName || "게시글 제목"}</div>
        </div>
        <img
          className="chat-dot-button"
          src={dotButtonImg}
          alt="옵션 버튼"
          onClick={toggleDotButton}
        />
        {dotButton && (
          <div className="dot-box">
            <div className="indi-buttonSet">
              <div className="buttonSet" onClick={openReportModal}>
                차단 & 신고
              </div>
            </div>
            {/* 판매자일 때만 거래하기 버튼 표시 */}
            {sellerTF && (
              <div className="indi-buttonSet">
                <div className="buttonSet" onClick={handleTradeRequest}>
                  거래하기
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 🔽 중앙 채팅 화면 */}
      <div className="chat-message-screen" ref={chatScreenRef}>
        {(() => {
          // ✅ 1. isRead === true인 메시지 중 가장 마지막 메시지 찾기
          const lastReadMsg = [...messages].filter((msg) => msg.isRead).pop(); // 마지막 isRead 메시지

          return messages.map((msg, index, arr) => {
            const isMine = msg.senderId === myID;

            // ✅ 날짜 구분선 로직 유지
            const currentDate = new Date(msg.sentAt).toLocaleDateString(
              "ko-KR",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "long",
              }
            );

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

                {/* 메시지 버블 */}
                <div
                  className={`chat-message-row ${isMine ? "mine" : "opponent"}`}
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

                        {msg.imageUrl && (
                          <div className="chat-image-bubble mine">
                            <img
                              src={getImageUrl(msg.imageUrl)}
                              alt="보낸 이미지"
                              className="chat-image"
                              onError={(e) =>
                                ((e.target as HTMLImageElement).src =
                                  "https://via.placeholder.com/150?text=Image+Not+Found")
                              }
                            />
                          </div>
                        )}

                        {msg.message && (
                          <div className="chat-bubble mine">{msg.message}</div>
                        )}

                        {/* ✅ 마지막 읽은 메시지에만 표시 */}
                        {lastReadMsg?.messageId === msg.messageId && (
                          <div className="chat-read-indicator">
                            👀 여기까지 읽었습니다
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {msg.imageUrl && (
                          <div className="chat-image-bubble opponent">
                            <img
                              src={getImageUrl(msg.imageUrl)}
                              alt="상대방 이미지"
                              className="chat-image"
                              onError={(e) =>
                                ((e.target as HTMLImageElement).src =
                                  "https://via.placeholder.com/150?text=Image+Not+Found")
                              }
                            />
                          </div>
                        )}

                        {msg.message && (
                          <div className="chat-bubble opponent">
                            {msg.message}
                          </div>
                        )}

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
          });
        })()}
      </div>

      {/* 🔽 선택 이미지 미리보기 */}
      {selectedImg && (
        <div className="chat-selected-overlay">
          <img
            src={selectedImg}
            alt="선택한 이미지"
            className="selected-img-show"
          />
          <button className="remove-img-btn" onClick={handleRemoveImage}>
            ✖
          </button>
        </div>
      )}

      {/* 🔽 하단 입력창 */}
      <div className="chat-input">
        <input
          type="file"
          accept="image/*"
          id="imageInput"
          style={{ display: "none" }}
          onChange={handleImageSelect}
        />

        <label htmlFor="imageInput" className="chat-picture-label">
          <img
            src={pictureImg}
            alt="카메라 이미지"
            className="chat-picture-img"
          />
        </label>

        <input
          className="chat-input-field"
          placeholder="메시지를 입력하세요"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()} // 엔터키 입력 시 전송 추가
        />

        <img
          src={sendImg}
          alt="업로드 버튼"
          className="chat-upload"
          onClick={sendMessage}
        />
      </div>

      {/* 🔽 신고 모달 */}
      {reportOpen && (
        <div className="report-modal">
          <div className="report-content">
            <div>신고하기</div>

            <div className="report-options">
              {reasonList.map((reason) => (
                <label key={reason} className="report-option">
                  <input
                    type="radio"
                    name="reportReason"
                    value={reason}
                    checked={reportReason === reason}
                    onChange={() => setReportReason(reason)}
                  />
                  {reason}
                </label>
              ))}
            </div>

            <div className="report-buttons">
              <button onClick={handleReportSubmit}>제출</button>
              <button onClick={closeReportModal}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
