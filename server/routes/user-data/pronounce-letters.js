import express from 'express'
import Debug from 'debug'
import { PronounceLettersData      } from '../../models/user-data'
import { verifyToken, validateUser } from '../../middleware'
import { nameProject } from '../../config'


const app   = express.Router()
const debug = new Debug(`${nameProject}: pronounce-letters`)


app.post('/', verifyToken, validateUser, async (req, res) => {

    
  try {

    const data    = req.body
    
    for (let i = 0; i < data.length; i++) {

      const element = data[i];

      const x    = new PronounceLettersData({
        user_id:   req.user._id,
        startTime: element.startTime,
        finalTime: element.finalTime,
        date:      element.date,
        letter:    element.letter,
        countHelp: element.countHelp,
        historial: element.historial,
      })

      const save = await x.save()
      
    }


    debug('Guardando la informacion recolectada')

    res.status(200).json({
      message: 'Datos guardados correctamente'
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

app.get('/', (req, res, next) => res.send('Hola mundo'))


/* app.get('/', async (req, res) => {

  try {

    const x = await IdentifyLetter.find({}, {_id: 0, __v: 0})

    debug(x.length)

    if (x !== null && x.length > 0) {

      debug('Mostrando la informacion')
      res.status(201).json(x)

    } 

    if (x.length === 0 || x === null) {

      debug('No hay datos para mostrar')
      res.status(401).json({
        message: 'No hay datos para mostrar'
      })

    }


    
  } catch (error) {
    debug('Error al obtener los datos')

    res.status(401).json({
      message: 'Error al obtener los datos'
    })
  }


}) */



export default app