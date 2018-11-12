import express            from 'express'
import Debug              from 'debug'
import { UserProgress, User   } from '../models';
import { nameProject    } from '../config'
import { required       } from '../middleware'

const app       = express.Router()
const debug     = new Debug(`${nameProject}: user-progress`)
const alphabet  = 'abcdefghijklmnñopqrstuvwxyz'
const maxRating = 5

app.post('/', required, async (req, res, next) => {

  const { _id }            = req.user._id
  const user               = await User.findOne(_id)
  const { letter, rating } = req.body
  const validation         = validateLetterAndRating(alphabet, maxRating, letter, rating)

  
  if ( validation ) {

    if (user !== null) {
      
      try {
        const user_id        = req.user._id
        const learnedLetter  = { letter, rating }
        const newRegister    = { user_id, learnedLetters: [ {letter, rating } ] }
  
        const findUserProgress = await UserProgress.findOne({user_id: req.user._id})
        
        if( findUserProgress ) {
  
          const valLetter = findUserProgress.learnedLetters.find( letterComplete => letterComplete.letter === letter )
  
          if (!valLetter) {
  
            findUserProgress.learnedLetters.push(learnedLetter)
            const n     = new UserProgress(findUserProgress)
            const saveN = await n.save()
            
            debug(`Agre gando la letra: ${letter}`)
            res.send(200).json({ message: 'Datos guardados' })

          } else {
  
            if (valLetter.rating < rating) {
  
              for (let i = 0; i < findUserProgress.learnedLetters.length; i++) {

                const el = findUserProgress.learnedLetters[i];  
                if (el.letter === letter) { el.rating = rating }
                
              }

              const n  = new UserProgress(findUserProgress)
              const sN = await n.save()
  
              debug(`cambiando el rating de la letra: ${letter}`)
              res.status(200).json({message: 'Datos Guardados'})
  
            } else {

              debug('No se modifica el rating')
              handleError(res, 'Cambios sin realizar', 'Cambios sin realizar')

            }
          }
  
  
        } else {
  
          const newUserProgress = new UserProgress(newRegister)
          const saveNewRegister = await newUserProgress.save()
  
          debug(`Creando nuevo registro de progreso`)
          res.status(200).json(
            {
              message: 'Registrado exitosamente'
            }
          )

        }
  
      } catch (error) {
  
        debug(error)
        handleError(res, 'Ha ocurrido un error', 'Ha ocurrido un error')
  
      }
  
    } else {
  
      debug('No se puede registrar datos a un usuario inexistente')
      handleError(res, 'Data not save', 'invalid user')
  
    }

  } else {

    debug('Error al guardar, datos invalidos')
    handleError(res, 'Error when saving', 'Invalid Data')

  }
  

})

const validateLetterAndRating = (alphabet, maxRating, letter, rating) => {

  let valLetter = false;
  const valRating = rating <= maxRating ? true : false;
  alphabet.split('').forEach(l => l === letter ? valLetter = true : null );

  return valLetter === true && valRating === true ? true : false;

}

app.get('/', async (req, res) => {

  debug('hola')

})

const handleError = (res, message, error) => {

  return res.status(401).json({
    message: message || 'User Progress not found',
    error: error || 'Data Not Found'
  })

}

export default app
