"use client";

export default function Message({
  isSender,
  senderName = "User",
  text = "Hello!",
  time = "12:00 PM",
}) {
  return (
    <div
      className={`p-3 rounded-lg flex flex-col ${
        isSender
          ? "items-start col-start-1 col-end-8"
          : "items-end col-start-6 col-end-13"
      }`}
    >

      {/* Message Bubble */}
      <div
        className={`flex items-center ${
          isSender ? "flex-row" : "flex-row-reverse"
        }`}
      >
        {/* Avatar */}
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 text-white flex-shrink-0">
          {senderName.charAt(0).toUpperCase()}
        </div>

        {/* Message Content */}
        <div
          className={`relative text-sm py-2 px-4 shadow rounded-xl ${
            isSender ? "ml-3 bg-white" : "mr-3 bg-indigo-100"
          }`}
        >
          <div className="font-semibold text-gray-700">{senderName}</div>
          <div>{text}</div>
          <div className="text-xs text-gray-500 mt-1 text-right">{time}</div>
        </div>
      </div>
    </div>
  );
}
