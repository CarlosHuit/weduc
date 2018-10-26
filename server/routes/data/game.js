import express from 'express'
import Debug from 'debug'
import { Game, User } from '../../models';
import { required } from '../../middleware'
import { nameProject } from '../../config'

const app   = express.Router()
const debug = new Debug(`${nameProject}: game-data`)


app.post('/', required, async (req, res) => {

  const { _id } = req.user._id
  const user = await User.findOne(_id)


  if (user !== null) {

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
  
    
        const gameData = new Game(data)
        const saveData = await gameData.save();
        
      }
  
      debug(`Guardando los datos del usuario ${req.user._id}`);

      res.status(200).json({
        message: 'Datos Guardados correctamente'
      })
      
    } catch (error) {

      const msg = 'Error al guardar los datos en la BD'
      debug(msg)
      handleError(res, 'Ha ocurrido un error.')

    }

  } else {

    debug('No se puede registrar datos a un usuario inexistente')
    res.status(401).json({
      message: 'Usuario no existe'
    })

  }


})


app.get('/', async (req, res) => {

  try{

    const data = await Game.find({}, {_id: 0, __v: 0} );

    debug('Mostrando todos lo registros de game_component')
    res.status(200).json(data)


  } catch (e) {

    debug('Error al mostrar la informacion')
    handleError(res, 'Datos no encontrados')

  }



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