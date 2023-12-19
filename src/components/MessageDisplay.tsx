import { IoClose } from "react-icons/io5";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdError } from "react-icons/md";
import { FaCircleInfo } from "react-icons/fa6";

type MessageProps = {
  responseMessage: {
    message: string;
    type: string;
  };
  setResponseMessage?: (message: { message: string; type: string }) => void;
};

const MessageDisplay = ({ responseMessage, setResponseMessage }: MessageProps) => {
  const deleteMessage = () => {
    setResponseMessage && setResponseMessage({ message: "", type: "" });
  };

  if (!responseMessage.message) {
    return null;
  }

  let messageClass;
  let Icon;
  switch (responseMessage.type) {
    case "error":
      messageClass = "bg-red-100 text-red-500 border-red-400";
      Icon = MdError;
      break;
    case "info":
      messageClass = "bg-blue-100 text-blue-500 border-blue-400";
      Icon = FaCircleInfo;
      break;
    default:
      messageClass = "bg-green-100 text-green-600 border-green-400";
      Icon = IoMdCheckmarkCircleOutline;
  }

  return (
    <div className={`${messageClass} p-2 rounded-md my-2 border-l-4 border-solid flex justify-between items-center`}>
      <div className="flex gap-4 items-center">
        <Icon size="28" />
        <p>{responseMessage.message}</p>
      </div>
      {setResponseMessage && (
        <IoClose
          onClick={deleteMessage}
          size="28"
          className="cursor-pointer text-slate-700 rounded hover:bg-slate-50 transition-all duration-300"
        />
      )}
    </div>
  );
};

export default MessageDisplay;
