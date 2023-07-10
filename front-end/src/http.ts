export const post = async (
  baseUrl: string,
  path: string,
  body?: { command: any; params: any },
  signal?: undefined
) => {
  let res = await (
    await fetch(baseUrl + path, {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("x-auth-token") || "",
      },
      body: JSON.stringify(body),
      signal,
    })
  ).json();
  return res;
};
const origin = window.location.origin;
// const origin = "http://localhost:3000";
export const baseApi = (path: string, body: any) => post(origin, path, body);
