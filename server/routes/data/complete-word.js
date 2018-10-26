import express from 'express'
import Debug from 'debug'
import { CompleteWord, User } from '../../models';
import { nameProject } from '../../config'
import { required } from '../../middleware'

const app = express.Router()
const debug = new Debug(`${nameProject}: complete-word`)


app.post('/',required, async (req, res) => {
  
  const { user_id, date, startTime, finishTime, letter, words } = req.body

  const { _id } = req.user._id
  const user = await User.findOne( _id )

  if (user !== null) {

    try {
  
      const data = new CompleteWord({
        user_id: req.user._id,
        date,
        startTime,
        finishTime,
        letter,
        words
      })

      const save = await data.save()

      debug('Guardando los datos en CompleteWord')
      res.status(200).json({
        message: 'Datos guardados correctamente'
      })
  
    } catch (e) {
  
      debug('Ha ocurrido un error al guardar la informacion')
      handleError(res, 'Ha ocurrido un error')
  
    }
    
  } else {

    debug('No se puede registrar informacion a un usuario inexistete')
    res.status(401).json({
      message: 'No se puede registrar informacion a un usuario inexistete'
    })

  }

})


app.get('/', async (req, res) => {

    try {
      const data = await CompleteWord.find({}, { _id: 0, __v:0 })

      debug('Mostrando los datos de comlpete word')
      res.status(200).json(data)

    } catch (error) {

      debug('Datos no encontrados')
      handleError(res, 'Datos no encontrados')

    }

})



const handleError = (res, message) => {

  return res.status(401).json(
    {
      message: 'Data not found',
      error: message || 'Data Not Found'
    }
  )

}

export default app