"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { createRoomApi, joinChatApi } from "../services/RoomService";
import useChatContext from "../context/ChatContext";
import { useRouter, usePathname } from "next/navigation";
const JoinCreateChat = () => {
  const router = useRouter();
  const [detail, setDetail] = useState({
    roomId: "",
    userName: "",
  });

  const pathname = usePathname().slice(1);
  const pageTitle = pathname === "join-room" ? "Join Room" : "Create Room";
  const roomIdLabel = pathname === "join-room" ? "Room ID" : "New Room ID";

  const { setRoomId, setCurrentUser, setConnected } = useChatContext();

  function handleFormInputChange(event) {
    setDetail({
      ...detail,
      [event.target.name]: event.target.value,
    });
  }

  function validateForm() {
    if (detail.roomId === "" || detail.userName === "") {
      toast.error("Invalid Input !!");
      return false;
    }
    return true;
  }

  async function joinChat() {
    if (validateForm()) {
      try {
        const room = await joinChatApi(detail.roomId);
        toast.success("joined..");
        setCurrentUser(detail.userName);
        setRoomId(room.roomId);
        setConnected(true);
        router.push("/new-chat");
      } catch (error) {
        if (error.status == 400) {
          toast.error(error.response.data);
        } else {
          toast.error("Error in joining room");
        }
        console.log(error);
      }
    } else {
      console.log("error");
    }
  }

  async function createRoom() {
    if (validateForm()) {
      try {
        const response = await createRoomApi(detail.roomId);
        toast.success("Room Created Successfully !!");
        setCurrentUser(detail.userName);
        setRoomId(response.roomId);
        setConnected(true);
        router.push("/chat");
      } catch (error) {
        console.log(error);
        if (error.status == 400) {
          toast.error("Room  already exists !!");
        } else {
          toast("Error in creating room");
        }
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="p-10 dark:border-gray-700 border w-full flex flex-col gap-5 max-w-md rounded dark:bg-gray-900 shadow">
        <div>
          <img src="./assets/chat.png" className="w-24 mx-auto" />
        </div>

        <h1 className="text-2xl font-semibold text-center ">{pageTitle}</h1>
        {/* name div */}
        <div className="">
          <label htmlFor="name" className="block font-medium mb-2">
            Your name
          </label>
          <input
            onChange={handleFormInputChange}
            value={detail.userName}
            type="text"
            id="name"
            name="userName"
            placeholder="Enter the name"
            className="w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* room id div */}
        <div className="">
          <label htmlFor="name" className="block font-medium mb-2">
            {roomIdLabel}
          </label>
          <input
            name="roomId"
            onChange={handleFormInputChange}
            value={detail.roomId}
            type="text"
            id="name"
            placeholder="Enter the room id"
            className="w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-center gap-2 mt-4">
          {pageTitle === "Join Room" ? (
            <button
              onClick={joinChat}
              className="px-3 py-2 dark:bg-blue-500 hover:dark:bg-blue-800 rounded-full"
            >
              Join Room
            </button>
          ) : (
            <button
              onClick={createRoom}
              className="px-3 py-2 dark:bg-orange-500 hover:dark:bg-orange-800 rounded-full"
            >
              Create Room
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JoinCreateChat;
