"use client"

import React from "react";
import { useRouter } from "next/navigation";

const LandingPage = () => {
  const router = useRouter();
  const onJoin = () => {
    router.push("/join-room");
  };

  const onCreate = () => {
    router.push("/create-room");
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="flex flex-col space-y-4 p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Welcome to Chat Room
        </h1>
        <button
          onClick={onJoin}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
        >
          Join Room
        </button>
        <button
          onClick={onCreate}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
        >
          Create Room
        </button>
      </div>
    </div>
  );
};
export default LandingPage;