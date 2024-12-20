// import dotenv from 'dotenv';
// dotenv.config();
import express from 'express'
import morgan from 'morgan'
import path from 'node:path'
import cookieParser from "cookie-parser";
import jwt from 'jsonwebtoken'; 

const app = express()
const __dirname = path.dirname(new URL(import.meta.url).pathname)
const PORT = process.env.PORT || 3000

import { router as homeRouter } from './routes/home.route.js'
import { router as pageRouter } from './routes/pages.route.js'
import { router as authRouter } from './routes/auth.route.js'

//template
app.set('view engine', 'ejs')
//middleware
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())
//token
app.use((req, res, next) => {
    const token = req.cookies.access_token
    req.session = { user: null }
    try {
        const data = jwt.verify(token, process.env.SECRET_KEY);
        req.session.user = data
    } catch {
        req.session.user = null
    }
    next()
})

//routes
app.use(authRouter)
app.use(homeRouter)
app.use(pageRouter)

app.use((req, res) => {
    res.status(404).render('404', { message: 'Page Not Found' })  // Render a custom 404 page
})
//statics
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
//puerto
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`)
})