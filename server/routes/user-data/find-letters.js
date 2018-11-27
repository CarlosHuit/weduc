import express from 'express'
import Debug from 'debug'
import { FindLettersData  } from '../../models/user-data'
import { nameProject      } from '../../config'
import { verifyToken, validateUser } from '../../middleware'

const app = express.Router()
const debug = new Debug(`${nameProject}: find-letter-data`)


app.post('/', verifyToken, validateUser, async (req, res) => {


    try {
  
      const { user_id, date ,startTime, finalTime, letter, words  } = req.body
        
      const drawLetterData = new FindLettersData(
        {
          user_id: req.user._id,
          date,
          startTime,
          finalTime,
          letter,
          words
        }
      )
      const saveData       = await drawLetterData.save();
  
      debug('Guardando los datos en FindLetter');
      res.status(200).json({
        message: 'Datos Guardados correctamente1'
      })
      
    } catch (error) {

      debug(error)
      debug('Ha ocurrido un error');
  
      res.status(400).status({
        message: 'Data not saves',
        error:   'An internal error has occurred'
      })
  
    }


})


app.get('/', async (req, res) => {

  // try{

  //   const data = await FindLetter.find({}, {_id: 0, __v: 0} );
  //   res.status(200).json(data)
  //   debug('Mostrando todos los datos')
    
  // } catch (e) {
  //   debug('Datos no encontrados')
  //   handleError(res, 'Datos no encontrados')
  // }

  res.send('Hola mundo')

})



const handleError = (res, message) => {

  return res.status(401).json({
    message: 'Data not found',
    error: message || 'Data Not Found'
  })

}

export default app