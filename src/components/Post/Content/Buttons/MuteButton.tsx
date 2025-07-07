import { GoMute, GoUnmute } from "react-icons/go";

const MuteButton = ({
  toggleMute,
  isMuted,
}: {
  isMuted: boolean;
  toggleMute: () => void;
}) => {
  return (
    <button
      onClick={toggleMute}
      className="group"
    >
      {isMuted ? (
        <GoMute size={24} className="opacity-80 hover:opacity-100" />
      ) : (
        <GoUnmute size={24} className="opacity-80 hover:opacity-100" />
      )}
    </button>
  );
};

export default MuteButton;
