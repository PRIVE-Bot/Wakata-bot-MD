import { join } from 'path'
import { promises as fs } from 'fs'
import { EventEmitter } from 'events'
import { google } from 'googleapis'

const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly']
const TOKEN_PATH = join(process.cwd(), 'token.json')

class GoogleAuth extends EventEmitter {
  constructor(port = 3000) {
    super()
    this.port = port
  }

  async authorize(credentials) {
    let token
    const { client_secret, client_id } = credentials.installed || credentials.web
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      `http://localhost:${this.port}`
    )

    try {
      token = JSON.parse(await fs.readFile(TOKEN_PATH, 'utf-8'))
    } catch (e) {
      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
      })
      this.emit('auth', authUrl)

      const code = await new Promise(resolve => {
        this.once('token', resolve)
      })

      const { tokens } = await oAuth2Client.getToken(code)
      token = tokens
      await fs.writeFile(TOKEN_PATH, JSON.stringify(token, null, 2))
    }

    oAuth2Client.setCredentials(token)
    return oAuth2Client
  }

  token(code) {
    this.emit('token', code)
  }
}

class GoogleDrive extends GoogleAuth {
  constructor(port = 3000) {
    super(port)
    this.path = '/drive/api'
  }

  async getFolderID(path) {
    return null
  }

  async infoFile(path) {
    return null
  }

  async folderList(path) {
    return []
  }

  async downloadFile(path) {
    return null
  }

  async uploadFile(path) {
    return null
  }
}

export { GoogleAuth, GoogleDrive }