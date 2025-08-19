import fetch from "node-fetch";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

let handler = async (m, { conn }) => {
  try {
    const audioUrl = "https://files.catbox.moe/ktilca.mp3";
    const imgUrl = "https://files.catbox.moe/f8qrut.png";
    const tmpDir = "./tmp";
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
    const audioPath = path.join(tmpDir, "audio.mp3");
    const opusPath = path.join(tmpDir, "audio.opus");
    const imgPath = path.join(tmpDir, "cover.png");
    const resAudio = await fetch(audioUrl);
    const audioBuffer = Buffer.from(await resAudio.arrayBuffer());
    fs.writeFileSync(audioPath, audioBuffer);
    const resImg = await fetch(imgUrl);
    const imgBuffer = Buffer.from(await resImg.arrayBuffer());
    fs.writeFileSync(imgPath, imgBuffer);
    await new Promise((resolve, reject) => {
      exec(`ffmpeg -i "${audioPath}" -c:a libopus -b:a 64k -vbr on -metadata title="Naruto Audio" -attach "${imgPath}" -metadata:s:t mimetype=image/png "${opusPath}"`, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    const audioFinal = fs.readFileSync(opusPath);
    await conn.sendMessage(
      m.chat,
      {
        audio: audioFinal,
        mimetype: "audio/ogg; codecs=opus",
        ptt: true,
        fileName: "Naruto-Audio.opus"
      },
      { quoted: m }
    );
    fs.unlinkSync(audioPath);
    fs.unlinkSync(opusPath);
    fs.unlinkSync(imgPath);
  } catch (e) {
    console.error(e);
    await conn.sendMessage(m.chat, { text: "Ocurrió un error al enviar el audio." }, { quoted: m });
  }
};

handler.command = /^1$/i;
export default handler;