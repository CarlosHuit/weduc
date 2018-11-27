import express from 'express'
import Debug from 'debug'
import { DrawLettersData           } from '../../models/user-data'
import { nameProject               } from '../../config'
import { verifyToken, validateUser } from '../../middleware'

const app   = express.Router()
const debug = new Debug(`${nameProject}: draw-letters-data`)


app.post('/', verifyToken, validateUser, async (req, res) => {


  try {

    const x = req.body
    
    for (let i = 0; i < x.length; i++) {
      
      const el = x[i];

      const data = {
        user_id:     req.user._id,
        startTime:   el.startTime,
        finalTime:   el.finalTime,
        date:        el.date,
        letter:      el.letter,
        handWriting: el.handWriting,
        board:       el.board,
      }

      const drawLetterData = new DrawLettersData(data)
      const saveData       = await drawLetterData.save()

    }

    debug('Guardando los datos en DrawLetter');
    res.status(200).json({
      message: 'Datos Guardados correctamente'
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

  const x = await DrawLettersData.find()
  res.status(200).json(x)

})



export default app