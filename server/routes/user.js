import express from 'express'
import Debug from 'debug'

const app = express.Router()
const debug = new Debug('web-app: user')

app.post('/user/:email', (req, res, next) => {
    const email = req.params.email
    debug(`${email}`)
})

export default app