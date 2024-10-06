import React, { useState, FormEvent, startTransition } from "react";
import { v4 as uuid } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const [roomId, setRoomId] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  const navigate = useNavigate();

  const generateRoomId = (e: FormEvent) => {
    e.preventDefault();
    const id = uuid();
    setRoomId(id);
    toast.success("Room Id is generated");
  };

  const joinRoom = () => {
    if (!roomId || !username || !category) {
      alert("All fields are required");
      return;
    }

    startTransition(() => {
      navigate(`/EditorPage/${roomId}`, {
        state: { username, category },
      });
    });
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-12 col-md-6">
          <div className="card shadow-sm p-2 mb-5 bg-secondary rounded">
            <div className="card-body text-center bg-dark">
              <h4 className="card-title text-light mb-4">Enter the ROOM ID</h4>
              <div className="form-group">
                <input
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="form-control mb-2"
                  placeholder="ROOM ID"
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-control mb-2"
                  placeholder="USERNAME"
                />
              </div>
              {/* Category Selection */}
              <div className="form-group">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-control mb-2"
                >
                  <option value="">Select Category</option>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Ideas">Ideas</option>
                </select>
              </div>
              <button
                onClick={joinRoom}
                className="btn btn-success btn-lg btn-block"
              >
                JOIN
              </button>
              <p className="mt-3 text-light">
                Don't have a room ID? Create{" "}
                <span
                  onClick={generateRoomId}
                  className="text-success p-2"
                  style={{ cursor: "pointer" }}
                >
                  New Room
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

// import React, { useState, FormEvent, startTransition } from "react";
// import { v4 as uuid } from "uuid";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

// const Home: React.FC = () => {
//   const [roomId, setRoomId] = useState<string>("");
//   const [username, setUsername] = useState<string>("");

//   const navigate = useNavigate();

//   const generateRoomId = (e: FormEvent) => {
//     e.preventDefault();
//     const id = uuid();
//     setRoomId(id);
//     toast.success("Room Id is generated");
//   };

//   const joinRoom = () => {
//     if (!roomId || !username) {
//       alert("Both fields are required");
//       return;
//     }

//     startTransition(() => {
//       navigate(`/EditorPage/${roomId}`, {
//         state: { username },
//       });
//     });
//   };

//   return (
//     <div className="container-fluid">
//       <div className="row justify-content-center align-items-center min-vh-100">
//         <div className="col-12 col-md-6">
//           <div className="card shadow-sm p-2 mb-5 bg-secondary rounded">
//             <div className="card-body text-center bg-dark">
//               <h4 className="card-title text-light mb-4">Enter the ROOM ID</h4>
//               <div className="form-group">
//                 <input
//                   type="text"
//                   value={roomId}
//                   onChange={(e) => setRoomId(e.target.value)}
//                   className="form-control mb-2"
//                   placeholder="ROOM ID"
//                 />
//               </div>
//               <div className="form-group">
//                 <input
//                   type="text"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   className="form-control mb-2"
//                   placeholder="USERNAME"
//                 />
//               </div>
//               <button
//                 onClick={joinRoom}
//                 className="btn btn-success btn-lg btn-block"
//               >
//                 JOIN
//               </button>
//               <p className="mt-3 text-light">
//                 Don't have a room ID? Create{" "}
//                 <span
//                   onClick={generateRoomId}
//                   className="text-success p-2"
//                   style={{ cursor: "pointer" }}
//                 >
//                   New Room
//                 </span>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;
