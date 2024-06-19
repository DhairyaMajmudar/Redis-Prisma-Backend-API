import express from "express"
import 'dotenv/config'
import fileUpload from "express-fileupload"
import router from "./routes/user.route.js"
import helmet from "helmet"
import cors from "cors"
import { redis } from "./db/redis.config.js"
import consola from "consola"

const app = express()

const port = process.env.PORT || 3333

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload())

app.use(helmet())
app.use(cors())

app.use('/api/v1', router)


redis.on("connect", () => {
    consola.success("Redis Connected");
})

app.listen(port, () => {
    consola.success(`Server is running on port ${port}`)
})