import CryptoJS from "crypto-js";
import dotenv from "dotenv";
import querystring from "querystring";
import axios from "axios";

dotenv.config({
  path: ".env.local",
});

export function createSign(params) {
  const keys = Object.keys(params);
  keys.sort();
  let toSign = "";
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    toSign += key + params[key];
  }
  console.log(toSign, "toSign");

  const hmac = CryptoJS.HmacSHA256(toSign, config.secretKey);
  const signature = hmac.toString(CryptoJS.enc.Hex);
  return signature;
}

const config = {
  port: process.env.PORT ?? 3000,
  apiUrl: process.env.BYFLOW_API,
  apiKey: process.env.API_KEY,
  secretKey: process.env.SECRET_KEY,
};

const body = {
  apiKey: config.apiKey,
  name: "Diego",
  email: "davc93@gmail.com",
  externalId: "18394816-4",
};

const s = createSign(body);
const encodedBody = querystring.stringify({ ...body, s });
console.log(encodedBody);

async function name() {
  try {
    const response = await axios.post(
      `${config.apiUrl}/customer/create`,
      encodedBody
    );
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

name()
