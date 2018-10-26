import express from 'express'
import Debug from 'debug'
import { nameProject } from '../config'
import { Combinations } from '../models';

const app = express.Router()
const debug = new Debug(`${nameProject}: combinations`)

const colors = [
  '#FF0000', '#4CAF50', '#FF9800', '#1E88E5', '#E91E63',
  '#FF0000', '#4CAF50', '#FF9800', '#1E88E5', '#E91E63',
  '#FF0000', '#4CAF50', '#FF9800', '#1E88E5', '#E91E63',
]/* .sort(e => Math.random() - 0.5) */


app.get('/', async (req, res) => {

  try {
    
    const combinations = await Combinations.findOne({}, { __v:0, _id:0});
    res.status(200).json(combinations)
    debug('Mostrando todas las coordenadas')
    
  } catch (error) {

    handleError(res, error)
    debug('Error al mostrar la coordenadas')

  }

})





app.get('/:letter', async (req, res) => {

  const letter = req.params.letter

  const result = {}
  

  try {
    
    const combinations  = await Combinations.findOne({'letter': letter}, { __v:0, _id:0})

    if (combinations !== null) {


      const t = JSON.parse(JSON.stringify(combinations))

      for (let i = 0; i < t.combinations.length; i++) {
        const el = t.combinations[i];
        el['color'] = colors[i];
      }

      debug(`Mostrando las combinaciones de la letra ${letter}`)
      res.status(200).json(t)

    }
    
    if (combinations === null) {

      debug(`Error al recuperar las combinaciones de la letra ${letter}`)

      res.status(200).json({
        message: 'No existen combinaciones para esta letra'
      })
      
    }

  } catch (error) {

    handleError(res, 'Datos no encontrados')
    debug(`Error al mostrar las combinaciones de la letra: ${letter}`)

  }

})



const handleError = (res, message) => {

  return res.status(401).json({
    message: 'coordinate of the letter x not found',
    error:   message || 'Data Not Found'
  })

}

export default app