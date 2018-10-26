import express from 'express'
import Debug from 'debug'
import { Words, Letters } from '../models';
import { nameProject } from '../config'

const app   = express.Router()
const debug = new Debug(`${nameProject}: words_and_letters`)
const omit  = { __v: 0, _id: 0 }

app.get('/', async (req, res) => {

  try {

    const words   = await Words.find({}, omit)
    const letters = await Letters.findOne({vocals: 'aeiou'}, omit)

    res.status(200).json({
        words: words,
        letters: letters
    })

    debug('Mostrando todos los registros de Words y Letters')

  } catch (error) {

    const msg = `Error al mostrar los registro de Words y Letters`
    debug(msg)
    handleError(res, msg)

  }
})

const handleError = (res, message) => {

  return res.status(401).json({
    message: 'Words-And-Letters not found',
    error: message || 'Data Not Found'
  })

}

export default app
