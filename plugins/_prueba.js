import fetch from "node-fetch";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

let handler = async (m, { conn }) => {
  
    await conn.reply(m.chat, `Ocurrió un error al enviar el audio.`, m, rcanal1);
  }
};

handler.command = /^1$/i;
export default handler;