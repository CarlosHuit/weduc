import express from 'express'
import Debug from 'debug'
import { nameProject } from '../config'
import { Coordinates } from '../models'
import { verifyToken, validateUser } from '../middleware'

const app = express.Router()
const debug = new Debug(`${nameProject}: coordinates`)


app.get('/', async (req, res) => {

  try {
    
    const coordinates = await Coordinates.find({}, { __v:0, _id:0});
    res.status(200).json(coordinates)
    debug('Mostrando todas las coordenadas')
    
  } catch (error) {

    handleError(res, error)
    debug('Error al mostrar la coordenadas')

  }

})



app.post('/guardar', verifyToken, validateUser, async (req, res) => {

  const { letter, coordinates } = req.body
  
  try {
    
    const existLetter = await Coordinates.findOne({letter})
    
    if (!existLetter) {

      const coo = new Coordinates({ letter, coordinates })
      const saveCoordinates = await coo.save()

      debug(`Guardando las coordenadas de la letra ${letter}`)
      res.status(201).json({letter, coordinates})

    } else {

      debug('Registro duplicado, no se guarda')

      res.status(401).json({
        message: 'Registro Duplicado',
        error: 'El registro ya existe en la DB'
      })

    }

    
  } catch (error) {

    debug('Error al guardar los datos en la DB')
    handleError(res, 'Datos no encontrados')

  }

})



app.get('/:letter', verifyToken, validateUser, async (req, res) => {

  const letter = req.params.letter
  const letterUpper = letter.toUpperCase()
  const letterLower = letter.toLowerCase()

  const result = {}
  

  try {
    
    const coordenadasUpper  = await Coordinates.findOne({'letter': letterUpper}, { __v:0, _id:0})
    const coordenadasLower  = await Coordinates.findOne({'letter': letterLower}, { __v:0, _id:0})

    result[letterLower] = coordenadasLower.coordinates;
    result[letterUpper] = coordenadasUpper.coordinates;

    debug(`Mostrando las coordenadas de la letra ${letter}`)

    res.status(200).json({
      letter: letter,
      coordinates: result
    })
    

  } catch (error) {

    handleError(res, 'Datos no encontrados')
    debug(`Error al mostrar las coordenadas de la letra: ${letter}`)

  }

})



const handleError = (res, message) => {

  return res.status(401).json({
    message: 'coordinate of the letter x not found',
    error:   message || 'Data Not Found'
  })

}

export default app