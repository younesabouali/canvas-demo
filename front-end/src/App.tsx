import { useEffect, useState } from "react";
import "./App.css";
import Canvas, { Line } from "./canvas";
import { baseApi } from "./http";
let intervalMethod: any;
const intialPosition: Line = { from: [0, 500], to: [0, 500] };
function App() {
  const [line, setLine] = useState<Line>({ ...intialPosition });
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [status, setStatus] = useState<string>("");
  const [history, setHistory] = useState<any[]>([]);
  const sendFinalPosition = async (line: Line) => {
    baseApi("/syncPosition", { line, userId });
  };
  const registerUserName = async (user?: string) => {
    let result = await baseApi("/registerUserName", {
      userName: user ? user : userName,
    });
    loadHistory();
    setUserId(result._id);
    if (result.line) {
      setLine({ ...result.line });
    } else {
      setLine({ ...intialPosition });
    }
  };
  const startBetting = () => {
    setLine((e) => {
      const newValue: Line = {
        from: [...e.from],
        to: [e.to[0] + 50, e.to[1] - 50],
      };
      sendFinalPosition(newValue);

      return newValue;
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
      }, 1000);
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
              {el?.userName} : <pre> {JSON.stringify(el.line)}</pre>
            </div>
          ))}
        </div>
        <Canvas key={userId} width={500} height={500} line={line} />
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
        </div>
      </div>
    </div>
  );
}

export default App;
