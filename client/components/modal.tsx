import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Toast from "./toast";
import { createRoom } from "@/app/api/room";
const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const [roomName, setRoomName] = useState("");

  const submitHandler = async () => {
    try {
      const room = {
        id: uuidv4(),
        name: roomName,
      };

      await createRoom(room).then((res: any) => {
        // console.log(res.data);
        Toast({
          message: "Room Created",
          type: "success",
        });

        setTimeout(() => {
          onClose()
        }, 1000)
        window.location.reload()

      });
    } catch (error: any) {
      console.log(error);
      Toast({
        message: error.response.data.error.toUpperCase(),
        type: "error",
      });
    }
  };
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <Toast />
      <div className="flex items-center justify-center  pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-dark-secondary opacity-85"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle"></span>
        &#8203;
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                {/* Icon or anything you want */}
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className="text-lg leading-6 font-medium text-dark-secondary"
                  id="modal-title"
                >
                  Add Room
                </h3>
                <div className="flex flex-row items-center justify-center    gap-4">
                  <p className="text-sm leading-5 text-dark-secondary">
                    <input
                      placeholder="Room Name"
                      type="text"
                      className="p-3 w-full text-dark-primary mt-8 rounded-md border-2 border-grey focus:outline-none focus:border-dark-primary"
                      value={roomName}
                      autoComplete="true"
                      onChange={(e) => setRoomName(e.target.value)}
                    />
                  </p>
                  <button
                    className="p-3 mt-6 rounded-md bg-dark-secondary font-bold text-white"
                    type="submit"
                    onClick={submitHandler}
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
              <button
                onClick={onClose}
                type="button"
                className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-green text-base leading-6 font-medium text-white shadow-sm hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-outline-green transition ease-in-out duration-150 sm:text-sm sm:leading-5"
              >
                Close
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
