"use client";
import React, { useState, useRef, useContext, useEffect } from "react";
import ChatBody from "./chat-body";
import { WebsocketContext } from "@/app/context/ws";
import { ChatContext } from "@/app/context/rooms";
import { UserContext } from "@/app/context/user";

export default function ChatWindow({ room, messages }) {
  const scrollContainerRef = useRef(null);
  const [message, setMessage] = useState();
  const { conn } = useContext(WebsocketContext);
  const { rooms, addMessageToRoom, addUserToRoom, removeUserFromRoom } =
    useContext(ChatContext);
  // const [messages, setMessages] = useState([]);
  const { user } = useContext(UserContext);

  const sendMessage = async () => {
    // console.log("Send Message");
    setMessage("");
    conn.send(message);
    addMessageToRoom(room.id, {
      type: "self",
      username: user.username,
      content: message,
    });
    if (scrollContainerRef.current) {
      const scrollContainer = scrollContainerRef.current;
      // Scroll to the bottom
      // Add a small delay to allow the scroll operation to take effect
      setTimeout(() => {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }, 10);
    }
  };

  useEffect(() => {
    // const r = rooms.find((r) => r.id === room.id); // Use find instead of filter
    // if (r) {
    //   setMessages(r.messages); // Update messages state with the messages of the room
    // }

    if (conn != null) {
      // Move WebSocket event listeners setup inside the if block
      conn.onmessage = (message) => {
        const m = JSON.parse(message.data);
        if (m.content.includes("has lft the room.")) {
          // setUsers((prevUsers) =>
          //   prevUsers.filter((user) => !m.content.includes(user))
          // ); // console.log("On Message");
          removeUserFromRoom(room.id, {
            id: "",
            roomId: room.id,
            username: m.content.split(" has ")[0],
          });
          addMessageToRoom(room.id, {
            type: user.username !== m.username ? "other" : "self",
            username: m.username,
            content: m.content,
          });
        } else if (m.content.includes("has joined the room.")) {
          // setUsers((prevUsers) => [...prevUsers, m.username]);
          addUserToRoom(room.id, {
            id: "",
            roomId: room.id,
            username: m.username,
          });
          // console.log("On Message");
          addMessageToRoom(room.id, {
            type: user.username !== m.username ? "other" : "self",
            username: m.username,
            content: m.content,
          });
        } else if (user.username != m.username) {
          // console.log("On Message");
          addMessageToRoom(room.id, {
            type: user.username !== m.username ? "other" : "self",
            username: m.username,
            content: m.content,
          });
        }

        // Scroll to the bottom
        if (scrollContainerRef.current) {
          const scrollContainer = scrollContainerRef.current;
          setTimeout(() => {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
          }, 10);
        }
      };

      conn.onclose = () => {
        // alert("closed");
      };
      conn.onerror = () => {
        // alert("err");
      };
      conn.onopen = () => {
        // alert("open");
      };
    }
  }, []); // Update the dependencies to include conn

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  return (
    <div className="">
      <div className="px-4 py-4 pb-4 text-center bg-dark-primary">
        <h1 className="text-xl font-bold  ">{room?.name || "Not Selected"}</h1>
      </div>
      <div className="">
        <ChatBody scrollContainerRef={scrollContainerRef} data={messages} />
        <div className="mt-2 flex flex-row gap-2 px-6 items-center">
          <textarea
            className=" resize-none block p-2.5 w-full text-sm  bg-gray rounded-lg border focus:border-transparent focus:ring-0 text-dark-primary"
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.ctrlKey && event.key === "Enter") {
                sendMessage();
              }
            }}
            rows={2}
            placeholder="Message"
          ></textarea>
          <button
            onClick={sendMessage}
            className="w-10 h-10 text-xs px-6 py-6 rounded-full bg-dark-secondary text-white flex items-center justify-center"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
