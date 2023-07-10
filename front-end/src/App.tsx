import { useEffect, useState } from "react";
import "./App.css";

import Canvas from "./canvas";
import { baseApi } from "./http";
let intervalMethod: any;
const intialPosition = [0];
function App() {
  const [points, setPoints] = useState<number[]>([...intialPosition]);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [status, setStatus] = useState<string>("");
  const [history, setHistory] = useState<any[]>([]);
  const sendFinalPosition = async (line: any) => {
    baseApi("/syncPosition", { line, userId });
  };
  const registerUserName = async (user?: string) => {
    let result = await baseApi("/registerUserName", {
      userName: user ? user : userName,
    });
    loadHistory();
    setUserId(result._id);
    if (result.line) {
      setPoints([...result.line]);
    } else {
      setPoints([...intialPosition]);
    }
  };
  const startBetting = () => {
    setPoints((points) => {
      if (points.length > 500) clearInterval(intervalMethod);
      const drawPoints = new Array(points.length + 10)
        .fill(" ")
        .map((_, i) => i);
      sendFinalPosition(drawPoints);
      return drawPoints;
    });
  };
  const logout = () => {
    setUserId("");
    setUserName("");
  };
  const loadHistory = async () => {
    let result = await baseApi("/loadHistory", {});
    setHistory(result);
  };
  useEffect(() => {
    if (status == "betting") {
      if (intervalMethod) clearInterval(intervalMethod);
      intervalMethod = setInterval(() => {
        startBetting();
      }, 100);
    }
    if (status == "stop") {
      if (intervalMethod) clearInterval(intervalMethod);
    }
  }, [status]);
  if (!userId)
    return (
      <div>
        <input value={userName} onChange={(e) => setUserName(e.target.value)} />
        <button disabled={!userName} onClick={() => registerUserName()}>
          register
        </button>
      </div>
    );

  return (
    <div>
      Current User : {userName}
      <button onClick={() => logout()}>Logout</button>
      <div style={{ display: "flex" }}>
        <div>
          <button onClick={() => loadHistory()}>reload</button>
          {history.map((el: any) => (
            <div
              key={el._id}
              onClick={() => {
                setUserName(el?.userName);
                registerUserName(el?.userName);
              }}
            >
              {" "}
              {el?.userName} : {el?.line?.length}
            </div>
          ))}
        </div>
        <Canvas key={userId} width={500} height={500} points={points} />
        <div>
          <button
            disabled={status == "betting"}
            onClick={() => setStatus("betting")}
          >
            Bet{" "}
          </button>
          <button
            disabled={status === "stop"}
            onClick={() => setStatus("stop")}
          >
            Stop
          </button>

          <button
            onClick={() => {
              setPoints([...intialPosition]);
              sendFinalPosition(intialPosition);
            }}
          >
            restart
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
