const handler = async (m, { conn, command }) => {
  await m.reply("h")
}

handler.command = ["1"]

export default handler