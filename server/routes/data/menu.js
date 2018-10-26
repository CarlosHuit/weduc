import express from 'express'
import Debug from 'debug'
import { Menu, User  } from '../../models';
import { required    } from '../../middleware'
import { nameProject } from '../../config'


const app   = express.Router()
const debug = new Debug(`${nameProject}: menu-data`)


app.post('/', required, async (req, res) => {

  const { user_id, initTime, date, selection, successTime } = req.body
  const { _id } = req.user._id
  const user   = await User.findOne(_id)

  
  if (user !== null) {
    
    try {
      
      const x    = new Menu({ user_id: req.user._id, initTime, date, selection, successTime })
      const save = await x.save()
  
      debug('Guardando la informacion recolectada')
      debug(selection)

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

  const x = await Menu.find()
  debug('Mostrando la informacion')

  res.status(201).json(x)

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