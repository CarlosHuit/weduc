import { Router } from 'express'
import Debug from 'debug'
import { Target, User } from '../../models';
import { nameProject } from '../../config'
import { required } from '../../middleware'

const app   = Router()
const debug = new Debug(`${nameProject}: target-data`)


app.post('/', required, async (req, res) => {

  const { user_id, initTime, letter, date, options, finishTime } = req.body
  const { id } = req.user._id
  const user   = await User.findOne(id)

  debug(req.body)

  if (user !== null) {

    try {
  
      const x = new Target({
        user_id: req.user._id,
        initTime,
        finishTime,
        letter,
        date,
        options,
      })

      const save = await x.save()
  
      debug('Guardando los datos en: Target collection')
  
      res.status(200).json( {
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

    const data = await Target.find({}, {_id: 0, __v:0})
    res.status(200).json(data)

  } catch (error) {

    handleError(res, 'Ha ocurrido un error')

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