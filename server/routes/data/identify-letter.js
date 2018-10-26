import express from 'express'
import Debug from 'debug'
import { IdentifyLetter, User  } from '../../models';
import { required    } from '../../middleware'
import { nameProject } from '../../config'


const app   = express.Router()
const debug = new Debug(`${nameProject}: identify-letter`)


app.post('/', required, async (req, res) => {

  const data    = req.body
  const { _id } = req.user._id
  const user    = await User.findOne(_id)

  
  if (user !== null) {
    
    try {
      
      for (let i = 0; i < data.length; i++) {

        const element = data[i];

        const x    = new IdentifyLetter({
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

      debug('Error al guardar la informacion en la db')
      handleError(res, 'Ha ocurrido un error.')
  
    }

  } else {


    debug('Error al guardar, usuario no existe')
  
    res.status(401).json({
      error: 'User Not Found',
      message: 'No se puede registrar informacion a un usuario inexistente'
    })

  }



})


app.get('/', async (req, res) => {

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