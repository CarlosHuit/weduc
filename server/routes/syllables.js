import express from 'express'
import Debug from 'debug'
import { Syllables } from '../models';
import { nameProject } from '../config'

const app = express.Router()
const debug = new Debug(`${nameProject}: syllables`)

app.get('/:letter', async (req, res) => {

  const letter = req.params.letter

  try {

    const syllables = await Syllables.findOne({letter: letter}, {__v: 0, _id:0 })


    debug(`Mostrando las syllables de la letra ${letter}`)
    res.status(200).json({
      letter: syllables.letter,
      syllables: syllables.syllables
    })

  } catch (error) {

    const msg = `Error al mostrar los registros syllables de la letra: ${letter}`;
    debug(msg)
    handleError(res, msg)

  }

})


app.get('', async (req, res) => {

  try {

    const syllables = await Syllables.find({}, {__v: 0, _id:0 })

    debug(`Mostrando todos los registros de Syllables`)
    res.status(200).json(syllables)

  } catch (error) {

    const msg = 'Error al mostrar los registros de Syllables'
    debug(msg)
    handleError(res, msg)

  }

})

const handleError = (res, message) => {

  return res.status(401).json({
    message: 'Syllables not found',
    error: message || 'Data Not Found'
  })

}

export default app
