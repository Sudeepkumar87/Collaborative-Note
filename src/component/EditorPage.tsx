import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  startTransition,
} from "react";
import Client from "./Client";
import PageEditor from "./PageEditor";
import {
  useLocation,
  useParams,
  useNavigate,
  Navigate,
} from "react-router-dom";
import toast from "react-hot-toast";
import { ACTIONS } from "./Actions";
import "../style/style.css";

interface ClientType {
  username: string;
  socketId: string;
}

const EditorPage: React.FC = () => {
  const [clients, setClients] = useState<ClientType[]>([]);
  const [versionHistory, setVersionHistory] = useState<string[]>([]); // New state for version history
  const socketRef = useRef<WebSocket | null>(null);
  const location = useLocation();
  const { roomId = "" } = useParams<{ roomId?: string }>();
  const navigate = useNavigate();
  const codeRef = useRef<string>("");
  const editorRef = useRef<any>(null);

  useEffect(() => {
    const init = async () => {
      socketRef.current = new WebSocket("ws://localhost:5000");

      const handleErrors = (err: any) => {
        console.log("Error", err);
        toast.error("Socket connection failed. Try again later.");
        navigate("/");
      };

      socketRef.current.onerror = handleErrors;

      socketRef.current.onopen = () => {
        if (socketRef.current) {
          socketRef.current.send(
            JSON.stringify({
              action: ACTIONS.JOIN,
              data: {
                roomId,
                username: location.state?.username,
              },
            })
          );
        }
      };

      socketRef.current.onmessage = (event) => {
        const { action, data } = JSON.parse(event.data);

        if (action === ACTIONS.JOINED) {
          const { clients, username, socketId } = data;
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room.`);
          }
          setClients(clients);
        }

        if (action === ACTIONS.DISCONNECTED) {
          const { socketId, username } = data;
          toast.success(`${username} left the room`);
          setClients((prev) => {
            return prev.filter((client) => client.socketId !== socketId);
          });
        }

        if (action === "code-change") {
          const { code } = data;
          if (editorRef.current) {
            editorRef.current.setEditorContent(code);
          }
        }
      };
    };

    init();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [roomId, navigate, location]);

  if (!location.state) {
    return <Navigate to="/" />;
  }

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success(`Room ID is copied`);
    } catch (error) {
      console.log(error);
      toast.error("Unable to copy the room ID");
    }
  };

  const leaveRoom = async () => {
    startTransition(() => {
      navigate("/");
    });
  };

  // Handle version history
  const saveVersion = (content: string) => {
    setVersionHistory((prev) => [...prev, content]);
  };

  const revertToPreviousVersion = () => {
    if (versionHistory.length > 1) {
      const lastVersion = versionHistory[versionHistory.length - 2]; // Get the previous version
      editorRef.current.setEditorContent(lastVersion);
      setVersionHistory((prev) => prev.slice(0, -1)); // Remove the last version
      toast.success("Reverted to previous version");
    } else {
      toast.error("No previous versions available");
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row flex-grow-1">
        <div
          className="col-md-2 bg-dark text-light d-flex flex-column h-100"
          style={{ boxShadow: "2px 0px 4px rgba(0,0,0,0.1)" }}
        >
          <div className="d-flex flex-column flex-grow-1 overflow-auto">
            <span className="mb-2">Members</span>
            <div className="d-flex flex-column mb-5 mt-3">
              {clients.map((client) => (
                <Client key={client.socketId} username={client.username} />
              ))}
            </div>
          </div>

          <div className={"mt-auto mb-3 custom-padding"}>
            <button className="btn btn-success w-100 mb-2" onClick={copyRoomId}>
              Copy Room ID
            </button>
            <button className="btn btn-danger w-100 mb-2" onClick={leaveRoom}>
              Leave Room
            </button>
            <button
              className="btn btn-warning w-100"
              onClick={revertToPreviousVersion}
            >
              Revert to Previous Version
            </button>
          </div>
        </div>

        <div className="col-md-10 text-light d-flex flex-column h-100">
          <PageEditor
            socketRef={socketRef}
            roomId={roomId}
            ref={editorRef}
            onCodeChange={(code) => {
              codeRef.current = code;
              saveVersion(code); // Save version on code change

              if (socketRef.current) {
                socketRef.current.send(
                  JSON.stringify({
                    action: "content-change",
                    data: { roomId, content: code },
                  })
                );
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
