import express from 'express'
import Debug from 'debug'
import { DrawLetter, User } from '../../models';
import { nameProject } from '../../config'
import { required } from '../../middleware'

const app = express.Router()
const debug = new Debug(`${nameProject}: draw-letter-data`)


app.post('/', required, async (req, res) => {


  const { _id } = req.user._id
  const user = await User.findOne( _id )

  if (user !== null) {

    try {
  
      const x = req.body
  
      
      for (let i = 0; i < x.length; i++) {
        
        const el = x[i];
  
        const data = {
          user_id:         req.user._id,
          date:            el.date,
          startTime:       el.startTime,
          finalTime:       el.finalTime,
          letter:          el.letter,
          boardData:       el.boardData,
          handWritingData: el.handWritingData,
        }
  
        const drawLetterData = new DrawLetter(data)
        const saveData       = await drawLetterData.save();
  
      }
  
      debug('Guardando los datos en DrawLetter');
      res.status(200).json({
        message: 'Datos Guardados correctamente'
      })
      
    } catch (error) {
      debug(error)
      debug('Ha ocurrido un error');
      handleError(res, 'Ha ocurrido un error.')
  
    }
    
  } else {
    
    debug('No se puede guardar informacion de un usuario sin registrar')
    res.status(401).json({
      message: 'No se puede guardar informacion de un usuario sin registrar'
    })
  }


})


app.get('/', async (req, res) => {

  try{

    const data = await DrawLetter.find({}, {_id: 0, __v: 0} );
    res.status(200).json(data)

    debug('Mostrando todos los datos')
    
  } catch (e) {
    debug('Datos no encontrados')
    handleError(res, 'Datos no encontrados')
  }

})



const handleError = (res, message) => {

  return res.status(401).json({
    message: 'Data not found',
    error: message || 'Data Not Found'
  })

}

export default app