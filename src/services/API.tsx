import axios from "axios";

const bearerAuth = "Bearer TbRspQY04EUcVZPPbuh48MHhQxftRYa5";
export const access_token = "TbRspQY04EUcVZPPbuh48MHhQxftRYa5";

const API = axios.create({
  baseURL: `https://mobile-hybrid-api.herokuapp.com`, // prod
  //baseURL: `http://192.168.0.17:9000`,              // dev
  headers: {
    common: {
      Authorization: bearerAuth,
    },
  },
});

export function addAuthToken(token: string): void {
  API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export function forget(): void {
  API.defaults.headers.common["Authorization"] = bearerAuth;
}

export default API;
