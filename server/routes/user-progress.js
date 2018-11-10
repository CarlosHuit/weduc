import express from 'express'
import Debug from 'debug'
import { Syllables } from '../models';
import { nameProject } from '../config'

const app = express.Router()
const debug = new Debug(`${nameProject}: syllables`)

app.get('/:letter', async (req, res) => {

})


app.get('', async (req, res) => {

    res.send('Hola como estas')

})

const handleError = (res, message) => {

  return res.status(401).json({
    message: 'User Progress not found',
    error: message || 'Data Not Found'
  })

}

export default app
