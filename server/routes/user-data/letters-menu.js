import express from 'express'
import Debug from 'debug'
import { verifyToken, validateUser } from '../../middleware'
import { User            } from '../../models';
import { nameProject     } from '../../config'
import { LettersMenuData } from '../../models/user-data'


const app   = express.Router()
const debug = new Debug(`${nameProject}: letters-menu-data`)


app.post('/', verifyToken, validateUser, async (req, res) => {

  const { user_id, startTime, finalTime, date, tab_learned, tab_alphabet } = req.body

  try {

    const x = new LettersMenuData({
      user_id: req.user._id,
      startTime,
      finalTime,
      date,
      tab_learned,
      tab_alphabet
    })
    const saveData = await x.save()

    debug('Datos guardados')
    res.status(200).json({
      message: 'Datos guardados'
    })

  } catch (error) {

    debug(error)
    debug('Error al guardar la informacion en la db')
    res.status(401).json({
      error:   'Data not saved',
      message: 'Error inesperado'
    }) 

  }


  
/*   if (user !== null) {
    
    try {
      
      const x    = new Menu({ user_id: req.user._id, initTime, date, selection, successTime })
      const save = await x.save()
  
      debug('Guardando la informacion recolectada')
      debug(selection)

      res.status(200).json({
        message: 'Datos guardados correctamente'
      })
  
    } catch (error) {
      

  
    }

  } else {


    debug('Error al guardar, usuario no existe')
  
    res.status(401).json({
      error: 'User Not Found',
      message: 'No se puede registrar informacion a un usuario inexistente'
    })

  } */



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