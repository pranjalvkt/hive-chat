"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  FiSend,
  FiPaperclip,
  FiSmile,
  FiMoreVertical,
  FiPhone,
  FiVideo,
  FiArrowLeft,
} from "react-icons/fi";
import { BsCheckAll, BsCheck } from "react-icons/bs";
import { useRouter } from "next/navigation";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import toast from "react-hot-toast";
import useChatContext from "@/context/ChatContext";
import { getMessagess } from "@/services/RoomService";
import { baseURL } from "@/config/AxiosHelper";
import { timeAgo } from "@/config/helper";

const ChatHeader = ({ user, handleLogout, roomName }) => {

  return (
    <div className="bg-white border-b p-4 flex items-center justify-between sticky top-0">
      <div className="flex items-center space-x-3">
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
          <FiArrowLeft className="w-5 h-5 text-gray-600" onClick={handleLogout} /> 
        </button>
        <img
          src={user.avatar}
          alt={roomName}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h2 className="font-semibold text-gray-800">{roomName}</h2>
          <p className="text-sm text-gray-500">Online</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
          <FiPhone className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
          <FiVideo className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
          <FiMoreVertical className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

const ChatRoom = () => {
  const router = useRouter();
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [stompClient, setStompClient] = useState(null);

  const {
    roomId,
    currentUser,
    connected,
    setConnected,
    setRoomId,
    setCurrentUser,
  } = useChatContext();

  useEffect(() => {
    if (!connected) {
      router.push("/");
    }
  }, [connected, roomId, currentUser]);

  useEffect(() => {
    async function loadMessages() {
      try {
        const fetchedMessages = await getMessagess(roomId);
        setMessages(fetchedMessages);
      } catch (error) {
        console.error("Failed to load messages", error);
      }
    }
    if (connected) {
      loadMessages();
    }
  }, [roomId]);


  // const [messages, setMessages] = useState([
  //   {
  //     id: 1,
  //     text: "Hey there! How's it going?",
  //     sender: "other",
  //     status: "read",
  //     senderName: "John Doe",
  //     avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=John",
  //     timestamp: "09:41 AM",
  //   },
  //   {
  //     id: 2,
  //     text: "I'm doing great! Just working on some new features.",
  //     sender: "me",
  //     status: "read",
  //     senderName: "Me",
  //     avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=Me",
  //     timestamp: "09:42 AM",
  //   },
  //   {
  //     id: 3,
  //     text: "That sounds interesting! Can you tell me more about it?",
  //     sender: "other",
  //     status: "read",
  //     senderName: "John Doe",
  //     avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=John",
  //     timestamp: "09:45 AM",
  //   },
  //   {
  //     id: 4,
  //     text: "Sure! I'm building a responsive chat interface using React and Tailwind CSS.",
  //     sender: "me",
  //     status: "delivered",
  //     senderName: "Me",
  //     avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=Me",
  //     timestamp: "09:47 AM",
  //   },
  // ]);

  const chatUser = {
    name: "John Doe",
    avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=John",
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    let client;
    const connectWebSocket = () => {
      const sock = new SockJS(`${baseURL}/chat`);
      client = Stomp.over(sock);

      client.connect({}, () => {
        setStompClient(client);

        toast.success("connected");

        client.subscribe(`/topic/room/${roomId}`, (message) => {
          const newMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, newMessage]);
        });
      });
    };
    if (connected) {
      connectWebSocket();
    }

    return () => {
      if (client) {
        client.disconnect();
      }
    };
  }, [roomId]);

  const sendMessage = async () => {
    if (stompClient && connected && input.trim()) {
      const message = {
        sender: currentUser,
        content: input,
        roomId: roomId,
      };

      stompClient.send(
        `/app/sendMessage/${roomId}`,
        {},
        JSON.stringify(message)
      );
      setInput("");
    }
  };

  function handleLogout() {
    stompClient.disconnect();
    setConnected(false);
    setRoomId("");
    setCurrentUser("");
    router.push("/join-room");
  }

  const MessageStatus = ({ status }) => {
    if (status === "sent") return <BsCheck className="text-gray-500" />;
    if (status === "delivered") return <BsCheckAll className="text-gray-500" />;
    if (status === "read") return <BsCheckAll className="text-blue-500" />;
    return null;
  };
  
  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col">
      <ChatHeader user={chatUser} handleLogout={handleLogout} roomName={roomId}/>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.timeStamp}
            className={`flex ${
              message.sender === "me" ? "justify-end" : "justify-start"
            } items-end space-x-2`}
          >
            {message.sender !== "me" && (
              <img
                src={`https://robohash.org/${message.sender}.png`}
                alt={message.sender}
                className="w-10 h-10 rounded-full"
              />
            )}
            <div className="flex flex-col">
              <span className="text-sm text-gray-600 mb-1 ml-2">
                {message.sender}
              </span>
              {/* {message.sender !== "me" && (
              )} */}
              <div
                className={`max-w-[85%] md:max-w-[70%] lg:max-w-[60%] rounded-2xl p-4 min-w-[100%] ${
                  message.sender === "me"
                    ? "bg-blue-500 text-white ml-auto"
                    : "bg-white text-gray-800 border border-gray-200"
                }`}
              >
                <p className="text-sm md:text-base break-words leading-relaxed ">
                  {message.content}
                </p>
                <div className="flex justify-end mt-2 items-center space-x-1">
                  <span
                    className={`text-xs ${
                      message.sender === "me"
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {timeAgo(message.timeStamp)}
                  </span>
                  {message.sender === "me" && (
                    <MessageStatus status={message.status} />
                  )}
                </div>
              </div>
            </div>
            {message.sender === "me" && (
              <img
                src={message.avatar}
                alt={message.senderName}
                className="w-10 h-10 rounded-full"
              />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t bg-white p-4">
        <div className="flex items-center space-x-2 max-w-4xl mx-auto">
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="Add attachment"
          >
            <FiPaperclip className="w-6 h-6 text-gray-500" />
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="Add emoji"
          >
            <FiSmile className="w-6 h-6 text-gray-500" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 p-3 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500 transition-colors duration-200 text-black"
            aria-label="Message input"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <FiSend className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
