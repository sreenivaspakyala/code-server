import * as cs from "code-server"
import * as fspath from "path"
import Websocket from "ws"

const wss = new Websocket.Server({ noServer: true })

export const plugin: cs.Plugin = {
  displayName: "Test Plugin",
  routerPath: "/test-plugin",
  homepageURL: "https://example.com",
  description: "Plugin used in code-server tests.",

  init(config) {
    config.logger.debug("test-plugin loaded!")
  },

  router() {
    const r = cs.express.Router()
    r.get("/test-app", (_, res) => {
      res.sendFile(fspath.resolve(__dirname, "../public/index.html"))
    })
    r.get("/goland/icon.svg", (_, res) => {
      res.sendFile(fspath.resolve(__dirname, "../public/icon.svg"))
    })
    return r
  },

  wsRouter() {
    const wr = cs.WsRouter()
    wr.ws("/test-app", (req) => {
      wss.handleUpgrade(req, req.socket, req.head, (ws) => {
        ws.send("hello")
      })
    })
    return wr
  },

  applications() {
    return [
      {
        name: "Test App",
        version: "4.0.0",
        iconPath: "/icon.svg",
        path: "/test-app",

        description: "This app does XYZ.",
        homepageURL: "https://example.com",
      },
    ]
  },
}
