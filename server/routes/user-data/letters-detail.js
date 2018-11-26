import express from 'express'
import Debug from 'debug'
import { verifyToken, validateUser } from '../../middleware'
import { nameProject       } from '../../config'
import { LettersDetailData } from '../../models/user-data'


const app   = express.Router()
const debug = new Debug(`${nameProject}: letters-detail-data`)


app.post('/', verifyToken, validateUser, async (req, res) => {
  
  const { user_id, startTime, finalTime, date, letter, cardExample, MemoryGame } = req.body

  try {

    const items = req.body

    for (let i = 0; i < items.length; i++) {

      const item = items[i];

      const x = new LettersDetailData({
        user_id: req.user._id,
        startTime:    item.startTime,
        finalTime:    item.finalTime,
        date:         item.date,
        letter:       item.letter,
        cardExample:  item.cardExample,
        memoryGame:   item.memoryGame,
      })
      const saveData = await x.save()
      
    }


    debug('Datos guardados')
    res.status(200).json({ message: 'Datos guardados' })

  } catch (error) {

    debug(error)
    debug('Error al guardar la informacion en la db')
    res.status(401).json({
      error:   'Data not saved',
      message: 'Error inesperado'
    }) 

  }


  
})


app.get('/', async (req, res) => {

  res.send('hola munnd')

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