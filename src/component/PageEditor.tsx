import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, ContentState } from "draft-js";

interface PageEditorProps {
  socketRef: React.MutableRefObject<WebSocket | null>;
  roomId: string;
  onCodeChange: (code: string) => void;
}

const PageEditor = forwardRef(
  ({ socketRef, roomId, onCodeChange }: PageEditorProps, ref) => {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    useImperativeHandle(ref, () => ({
      setEditorContent: (content: string) => {
        const contentState = ContentState.createFromText(content);
        setEditorState(EditorState.createWithContent(contentState));
      },
    }));

    const handleEditorChange = (state: EditorState) => {
      setEditorState(state);
      const plainText = state.getCurrentContent().getPlainText();
      onCodeChange(plainText);

      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        socketRef.current.send(
          JSON.stringify({
            action: "content-change",
            data: {
              roomId,
              content: plainText,
            },
          })
        );
      } else {
        console.error("WebSocket is not open. Cannot send message.");
      }
    };

    useEffect(() => {
      const handleWebSocketMessage = (event: MessageEvent) => {
        const { action, data } = JSON.parse(event.data);

        if (action === "code-change") {
          const { content } = data;
          if (content) {
            setEditorState(
              EditorState.createWithContent(
                ContentState.createFromText(content)
              )
            );
          }
        }
      };

      if (socketRef.current) {
        socketRef.current.onmessage = handleWebSocketMessage;
        socketRef.current.onerror = (error) => {
          // Handle WebSocket errors
        };
        socketRef.current.onclose = () => {
          // Handle WebSocket closure
        };
      }

      return () => {
        if (socketRef.current) {
          socketRef.current.onmessage = null;
        }
      };
    }, [socketRef]);

    return (
      <div>
        <Editor
          toolbarClassName="toolbar-class"
          wrapperClassName="wrapper-class"
          editorClassName="editor-class"
          editorState={editorState}
          onEditorStateChange={handleEditorChange}
        />
      </div>
    );
  }
);

export default PageEditor;

// import React, {
//   useEffect,
//   useRef,
//   useState,
//   forwardRef,
//   useImperativeHandle,
// } from "react";
// import { Editor } from "react-draft-wysiwyg";
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
// import { EditorState, ContentState } from "draft-js";

// interface PageEditorProps {
//   socketRef: React.MutableRefObject<WebSocket | null>;
//   roomId: string;
//   onCodeChange: (code: string) => void;
// }

// const PageEditor = forwardRef(
//   ({ socketRef, roomId, onCodeChange }: PageEditorProps, ref) => {
//     const [editorState, setEditorState] = useState(EditorState.createEmpty());

//     useImperativeHandle(ref, () => ({
//       setEditorContent: (content: string) => {
//         const contentState = ContentState.createFromText(content);
//         setEditorState(EditorState.createWithContent(contentState));
//       },
//     }));

//     const handleEditorChange = (state: EditorState) => {
//       setEditorState(state);
//       const plainText = state.getCurrentContent().getPlainText();

//       onCodeChange(plainText);

//       if (
//         socketRef.current &&
//         socketRef.current.readyState === WebSocket.OPEN
//       ) {
//         socketRef.current.send(
//           JSON.stringify({
//             action: "content-change",
//             data: {
//               roomId,
//               content: plainText,
//             },
//           })
//         );
//       } else {
//         console.error("WebSocket is not open. Cannot send message.");
//       }
//     };

//     useEffect(() => {
//       const handleWebSocketMessage = (event: MessageEvent) => {
//         const { action, data } = JSON.parse(event.data);

//         if (action === "code-change") {
//           const { content } = data;
//           if (content) {
//             setEditorState(
//               EditorState.createWithContent(
//                 ContentState.createFromText(content)
//               )
//             );
//           }
//         }
//       };

//       if (socketRef.current) {
//         socketRef.current.onmessage = handleWebSocketMessage;
//         socketRef.current.onerror = (error) => {
//           // console.error("WebSocket error:", error);
//         };
//         socketRef.current.onclose = () => {
//           // console.log("WebSocket connection closed.");
//         };
//       }

//       return () => {
//         if (socketRef.current) {
//           socketRef.current.onmessage = null;
//         }
//       };
//     }, [socketRef]);

//     return (
//       <div>
//         <Editor
//           toolbarClassName="toolbar-class"
//           wrapperClassName="wrapper-class"
//           editorClassName="editor-class"
//           editorState={editorState}
//           onEditorStateChange={handleEditorChange}
//         />
//       </div>
//     );
//   }
// );

// export default PageEditor;
