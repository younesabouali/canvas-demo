import { useEffect, useState } from "react";
import "./App.css";

import { baseApi } from "./http";
import { GraphCanvas } from "./graph-canvas";
let intervalMethod: any;
const intialPosition = 0;
function App() {
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string>("");
  const [history, setHistory] = useState<any[]>([]);
  const sendFinalPosition = async (line: any) => {
    baseApi("/syncPosition", { line, userId });
  };

  function graphFunction(x: number) {
    return x ** 2;
  }
  const registerUserName = async (user?: string) => {
    let result = await baseApi("/registerUserName", {
      userName: user ? user : userName,
    });
    loadHistory();
    setUserId(result._id);
    console.log("before");
    if (result.line) {
      setProgress(result.line);
      console.log("if");
    } else {
      console.log("else");
      setProgress(intialPosition);
    }

    console.log("after");
    console.log(progress, result.line);
  };
  const startBetting = () => {
    setProgress((progress) => {
      if (progress >= 1) {
        clearInterval(intervalMethod);
        return progress;
      }
      let incrementedResult = progress + 0.1;
      if (incrementedResult > 1) incrementedResult = 1;
      sendFinalPosition(incrementedResult);
      return incrementedResult;
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
              {el?.userName} :{" "}
              {el?.line?.length ? el?.line?.length : el?.line?.toFixed(2)}
            </div>
          ))}
        </div>
        <GraphCanvas
          key={userId}
          width={500}
          height={500}
          xMax={100}
          incrementation={1}
          progress={progress}
          xMin={1}
          graphFunction={graphFunction}
        />
        {/* <Canvas /> */}
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
              setProgress(0);
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
