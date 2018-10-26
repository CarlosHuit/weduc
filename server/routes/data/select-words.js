import express from 'express'
import Debug from 'debug'
import { SelectWords, User } from '../../models';
import { nameProject } from '../../config'
import { required } from '../../middleware'

const app   = express.Router()
const debug = new Debug(`${nameProject}: select-words`)


app.post('/', required, async (req, res) => {

  const data = req.body
  const { id } = req.user._id
  const user   = await User.findOne(id)


  if (user !== null) {

    
    try {

      for (let i = 0; i < data.length; i++) {

        const el = data[i];
        
        const x = new SelectWords({
  
          user_id:    req.user._id,
          startTime:  el.startTime,
          finishTime: el.finishTime,
          date:       el.date,
          letter:     el.letter,
          replays:    el.replays,
          amount:     el.amount,
          corrects:   el.corrects,
          incorrects: el.incorrects,
          pattern:    el.pattern,
          historial:  el.historial,
        })
  
        const save = await x.save()
      }
  
  
      debug('Guardando los datos en: SelectWords collection')
  
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

app.get('', async (req, res) => {


  try {

    const data = await SelectWords.find({}, {_id: 0, __v:0})
    debug(data.length)
    
    if (data.length !== 0){
      res.status(200).json(data)

    } else {

      res.status(401).json({
        message: 'No existen datos'
      })

    }
    
  } catch (error) {
    const msg = 'Error al obtener los datos'
    handleError(res, msg)
    debug(msg)
  }


})

app.get('/:letter', async (req, res) => {

  const letter = req.params.letter

  try {
    
    const data = await SelectWords.find({letter: letter}, {_id:0, __v:0})

    if (data.length > 0) {
      res.status(200).json(data)
    } else {
      handleError(res, 'No existen datos asignado a esta letra.')
    }
  } catch (error) {
    
  }

})

const handleError = (res, message) => {

  return res.status(401).json(
    {
      message: 'Data not found',
      error: message || 'Data Not Found'
    }
  )

}

export default app