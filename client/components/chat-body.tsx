import React from "react";

const ChatBody = ({ data, scrollContainerRef }: { data: any, scrollContainerRef: any }) => {
  return (
    <div ref={scrollContainerRef} className="overflow-y-auto px-6" id="chat-window" style={{ height: "400px", maxHeight: "400px" }}>
      {data.map((message: any, index: number) => {
        if (message.type == "self" && !message.content.includes("lft the room") && !message.content.includes("has joined the room.")) {
          return (
            <div
              className="flex flex-col mt-2 w-full text-right justify-end"
              key={index}
            >
              <div>
                <div className="bg-dark-secondary max-w-xs w-3/5 text-white px-4 py-2 rounded-md inline-block mt-1 text-left text-sm">
                  <div className="text-xs font-bold text-right text-green">{message.username}</div>
                  {message.content}
                </div>
              </div>
            </div>
          );
        } else if (message.content.includes("lft the room") || message.content.includes("has joined the room")) {
          return <div
            className="flex flex-col mt-2 w-full text-center justify-end"
            key={index}
          >
            <div>
              <div className="bg-dark-secondary max-w-xs opacity-50 text-white px-2 py-1 rounded-md inline-block mt-1 text-left text-xs">

                {message.content}
              </div>
            </div>
          </div>
        } else {
          return (
            <div className="mt-2" key={index}>
              <div>
                <div className="bg-grey  max-w-xs w-3/5 text-dark-secondary px-4 py-2 rounded-md inline-block mt-1 text-sm">
                  <div className="text-xs font-bold text-right text-green">{message.username}</div>
                  {message.content}
                </div>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
};

export default ChatBody;
