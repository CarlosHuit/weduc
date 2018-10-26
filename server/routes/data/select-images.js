import express from 'express'
import Debug from 'debug'
import {
  SelectImages,
  User
} from '../../models';
import {
  nameProject
} from '../../config'
import {
  required
} from '../../middleware'

const app = express.Router()
const debug = new Debug(`${nameProject}: select-images`)


app.post('/', required, async (req, res) => {

  const {
    user_id,
    startTime,
    finishTime,
    date,
    letter,
    lowerCase,
    upperCase,
    replays,
    amount,
    corrects,
    incorrects,
    pattern,
    historial
  } = req.body
  const { id } = req.user._id
  const user = await User.findOne(id)


  if (user !== null) {


    try {

      const x = new SelectImages({
        user_id: req.user._id,
        startTime,
        finishTime,
        date,
        letter,
        lowerCase,
        upperCase,
        replays,
        amount,
        corrects,
        incorrects,
        pattern,
        historial
      })

      const save = await x.save()


      debug('Guardando los datos en: SelectImages collection')

      res.status(200).json({
        message: 'Datos guardados correctamente'
      })

    } catch (error) {

      debug(error)
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

    const data = await SelectImages.find({}, { _id: 0, __v: 0 })

    if (data.length !== 0) {
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

  // r/es.send('hol')

})

app.get('/:letter', async (req, res) => {

  const letter = req.params.letter

  try {

    const data = await SelectImages.find({
      letter: letter
    }, {
      _id: 0,
      __v: 0
    })

    if (data.length > 0) {
      res.status(200).json(data)
    } else {
      handleError(res, 'No existen datos asignado a esta letra.')
    }
  } catch (error) {

  }

})

const handleError = (res, message) => {

  return res.status(401).json({
    message: 'Data not found',
    error: message || 'Data Not Found'
  })

}

export default app
