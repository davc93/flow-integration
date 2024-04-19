import express from "express";
import dotenv from "dotenv";
import querystring from "querystring";
import axios from "axios";
import CryptoJS from "crypto-js";
import cors from "cors"
import nodemailer from "nodemailer"
// import crypto from "crypto"
dotenv.config({
  path: ".env.local",
});

export const config = {
  port: process.env.PORT ?? 3000,
  apiUrl: process.env.BYFLOW_API,
  apiKey: process.env.API_KEY,
  secretKey:process.env.SECRET_KEY,
  baseUrl:process.env.BASE_URL,
  smtpEmail:process.env.SMTP_EMAIL,
  smtpPassword:process.env.SMTP_PASSWORD
};
export async function sendMail(info) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secure: true,
    port: 465,
    auth: {
      user: config.smtpEmail,
      pass: config.smtpPassword,
    },
  });
  await transporter.sendMail(info);
}

export function createSign(params) {
  const keys = Object.keys(params)
  keys.sort()
  let toSign = ""
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    toSign += key + params[key]  
  }

  const hmac = CryptoJS.HmacSHA256(toSign,config.secretKey)
  const signature = hmac.toString(CryptoJS.enc.Hex)
  return signature
}


const app = express();
app.use(cors())
app.use(express.json());


app.post("/api/payment/create", async (req, res) => {
  const frontendData = req.body;
  const privateData = {
    apiKey: config.apiKey,
    commerceOrder: "uuid-1234-1234-1234",
    urlConfirmation: `${config.baseUrl}/notifications`,
    urlReturn: `${config.baseUrl}/payment-status`,
  };
  const params = {
    ...frontendData,
    ...privateData,

  };
  const signature = createSign(params)
  const body = {
    ...params,
    s:signature
  }

  console.log(body);
  const encodedBody = querystring.stringify(body);
  try {
    const response = await axios.post(`${config.apiUrl}/payment/create`, encodedBody);
    res.status(200).send({url:response.data.url+"?token="+response.data.token});
  } catch (error) {
    // console.error(error);
    res.status(500).json(error);
  }
});

app.post("/notifications",async (req, res) => {
  const {body} = req.body
  console.log(req);
  const mail = {
    from: config.smtpEmail,
    to: "davc93@gmail.com",
    subject: "Mensaje de flow",
    html: `<h2>Servicio de notificaciones de flow</h2><p>${req}</p>`,
  };
  res.send({
    message: "Notification received",
  });
  await sendMail(mail)
  
});
app.use(express.static("dist"))
app.listen(config.port, () => {
  console.log("Servidor escuchando en puerto:", config.port);
});