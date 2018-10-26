import express from 'express'
import Debug from 'debug'
import { GuessLetter, User } from '../../models';
import { nameProject       } from '../../config'
import { required          } from '../../middleware'

const app = express.Router()
const debug = new Debug(`${nameProject}: guess-letter`)


app.post('/', required, async (req, res) => {

  const { user_id, date, startTime, letter, words, finalTime } = req.body

  const { _id } = req.user._id
  const user    = await User.findOne(_id)

  if (user !== null) {
    
    try{
  
      const data     = new GuessLetter({
        user_id: req.user._id,
        date,
        startTime,
        finalTime,
        letter,
        words
      })
      const saveData = await data.save();
  
      debug('Guardando todos los datos')
  
      res.status(200).json({
        message: 'Datos guardados correctamente'
      })
  
    } catch (e) {

      debug('Error al guardar la informacion en la DB')
      handleError(res, 'Ha ocurrido un error, no se ha guardado')

    }

  } else {

    debug('No se puede registrar a un usuairio inexistente')

    res.status(401).json({
      message: 'No se puede registrar informacion a un usuario inexistente'
    })
  }


})


app.get('/', async (req, res) => {

  try {

    const data = await GuessLetter.find({}, { _id: 0, __v: 0 });
    debug('Mostrando la informacion de GuessLetter')
    res.status(200).json(data)

  } catch (e) {

    debug('Error al mostrar la informacion de GuessLetter')
    handleError(res, 'Datos no encontrados')

  }

})



const handleError = (res, message) => {

  return res.status(401).json({
    message: 'Letter not found',
    error: message || 'Data Not Found'
  })

}

export default app
