import express from 'express'
import morgan from 'morgan'
import path from 'node:path'

const app = express()
const __dirname = path.dirname(new URL(import.meta.url).pathname)
const PORT = process.env.PORT ?? 3000

import { router as homeRouter } from './routes/home.route.js'
import { router as pageRouter } from './routes/pages.route.js'
import { router as authRouter } from './routes/auth.route.js'

//middleware
app.use(morgan('dev'))
//routes
app.use(authRouter)
app.use(homeRouter)
app.use(pageRouter)
app.use((req, res) => {
    res.json({mensaje:'Pagina no encontrada'})
})
//statics
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`)
})