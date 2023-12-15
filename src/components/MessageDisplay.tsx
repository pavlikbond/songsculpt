"use client";
import { IoClose } from "react-icons/io5";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

import { MdError } from "react-icons/md";
type MessageProps = {
  responseMessage: {
    message: string;
    type: string;
  };
  setResponseMessage: (message: { message: string; type: string }) => void;
};

const MessageDisplay = ({ responseMessage, setResponseMessage }: MessageProps) => {
  //function to delete the message
  const deleteMessage = () => {
    setResponseMessage({ message: "", type: "" });
  };
  return (
    <>
      {responseMessage.message ? (
        <div
          className={`${
            responseMessage.type === "error"
              ? "bg-red-100 text-red-500 border-red-400"
              : "bg-green-100 text-green-600 border-green-400"
          } p-2 rounded-md my-2 border-l-4 border-solid flex justify-between items-center`}
        >
          <div className="flex gap-4 items-center">
            {responseMessage.type === "error" ? <MdError size="28" /> : <IoMdCheckmarkCircleOutline size="28" />}
            <p>{responseMessage.message}</p>
          </div>
          <IoClose
            onClick={deleteMessage}
            size="28"
            className="cursor-pointer text-slate-700 rounded hover:bg-slate-50 transition-all duration-300"
          />
        </div>
      ) : null}
    </>
  );
};

export default MessageDisplay;
