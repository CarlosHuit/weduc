import express         from 'express'
import Debug           from 'debug'
import { GameData    } from '../../models/user-data'
import { nameProject } from '../../config'
import { verifyToken, validateUser } from '../../middleware'

const app   = express.Router()
const debug = new Debug(`${nameProject}: game-data`)


app.post('/', verifyToken, validateUser, async (req, res) => {


  try {

    const x = req.body
    
    for (let i = 0; i < x.length; i++) {
  
      const el = x[i];
  
      const data = {
        user_id:     req.user._id,
        date:        el.date,
        startTime:   el.startTime,
        letter:      el.letter,
        amount:      el.amount,
        correct:     el.correct,
        incorrect:   el.incorrect,
        repetitions: el.repetitions,
        historial:   el.historial,
        finalTime:   el.finalTime
      }

  
      const gameData = new GameData(data)
      const saveData = await gameData.save();
      
    }

    debug(`Guardando los datos del usuario ${req.user._id}`);

    res.status(200).json({
      message: 'Datos Guardados correctamente'
    })
    
  } catch (error) {
    debug(error)
    const msg = 'Error al guardar los datos en la BD'
    debug(msg)
    handleError(res, 'Ha ocurrido un error.')

  }

})


app.get('/', async (req, res) => {

res.send('Hello world')


})



const handleError = (res, message) => {

  return res.status(401).json(
    {
      message: 'Letter not found',
      error: message || 'Data Not Found'
    }
  )

}

export default app