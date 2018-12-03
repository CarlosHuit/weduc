import express from 'express'
import Debug from 'debug'
import { nameProject               } from '../config'
import { verifyToken, validateUser } from '../middleware'
import { CommentsModel             } from '../models'

const app   = express.Router()
const debug = new Debug(`${nameProject}: comments`)


app.post('/', async (req, res) => {

  try {

    const t = req.body
    debug(t)    
    // const newComment = new CommentsModel()

  } catch (error) {

    debug('An internal error has occurred')
    debug(error)
    handleError(res)

  }

})

app.get('/', (req, res) => {

  debug('hola')
  res.send('HOLA MUNDO')

})


app.get('/:course_id', async (req, res) => {

  const course_id = req.params.course_id
  
  try {
    
    const data = await CommentsModel.find({}, {__v: 0})

    res.status(200).json(data);

    
  } catch (error) {

    debug('Error al guardar los datos en la DB')
    handleError(res, 'Datos no encontrados')

  }

})


const handleError = (res, message) => {

  return res.status(400).json({
    message: 'Data not found',
    error: message || 'An internal error has occurred'
  })

}

export default app