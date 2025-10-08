export const APP_NAME = "EscolarMX";
export const APP_VERSION = "3.25.10.06";

const HOST = window.location.host;
const HOST_URL =
  "https://api" +
  (HOST.startsWith("localhost") || HOST.startsWith("127.0.0.1")
    ? "dev.escolarmx.net"
    : HOST);

console.log(HOST);
console.log(HOST_URL);

export const BASE_URL = HOST_URL;
export const URL_API = `${BASE_URL}/api`;
