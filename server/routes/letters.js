import express from 'express'
import Debug from 'debug'
import { Letters } from '../models';
import { nameProject } from '../config'

const app = express.Router()
const debug = new Debug(`${nameProject}: letters'`)

app.get('', async (req, res) => {

  try {

    const letters = await Letters.findOne({vocals: 'aeiou'}, {_id: 0, __v: 0})

    debug('Mostrando la informacion de las letras')
    res.status(200).json(letters)

  } catch (error) {

    debug('Error al mostrar la informacion de las letras')
    handleError(res, 'Error al mostrar la informacion de las letras')

  }

})


const handleError = (res, message) => {

  return res.status(401).json({
    message: 'Letter not found',
    error: message || 'Data Not Found'
  })

}

export default app
