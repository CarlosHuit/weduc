import express from 'express'

const app = express.Router()

app.get('/', (req, res) => {
    res.send('<h1>API web-app</h1>')
})

export default app