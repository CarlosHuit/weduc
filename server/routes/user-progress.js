import express            from 'express'
import Debug              from 'debug'
import { UserProgress, User   } from '../models';
import { nameProject    } from '../config'
import { required, verifyToken } from '../middleware'

const app       = express.Router()
const debug     = new Debug(`${nameProject}: user-progress`)
const alphabet  = 'abcdefghijklmnñopqrstuvwxyz'
const maxRating = 5

app.post('/', verifyToken, async (req, res, next) => {

  

  try {
    

    const { _id }            = req.user._id
    const { letter, rating } = req.body
    const validation         = validateLetterAndRating(alphabet, maxRating, letter, rating)
    const userValidation     = await User.findOne(_id)



    if ( userValidation !== null && validation ) {

      const userProgressProfile = await UserProgress.findOne({user_id: req.user._id}, { __v: 0 })



      if (userProgressProfile) {



        const lLetters    = userProgressProfile.learnedLetters.slice()
        const letterExist = lLetters.find( group => group.letter === letter )



        if (letterExist)  {



          if (letterExist.rating >= rating) {
            res.status(401).json({
              message: `El rating de la letra "${letter}", no se actualiza`,
              error:   'El rating obtenido es menor al anterior'
            })
          }



          if (letterExist.rating < rating) {


            const updateData = lLetters.slice()
            updateData.forEach(el => el.letter === letter ? el.rating = rating : null );

            const update = await UserProgress.findByIdAndUpdate(userProgressProfile._id, {$set: {learnedLetters: updateData}}, {new: true} )

            debug(`El rating de la letra "${letter}" se actualiza a "${rating}"`)
            res.status(200).json({ message: 'Rating actualizado'})

          }



        } 



        if (!letterExist) {


          const newElement  = { letter, rating }
          const updateData  = lLetters.slice()
          updateData.push(newElement)

          const update = await UserProgress.findByIdAndUpdate(userProgressProfile._id, {$set: {learnedLetters: updateData}}, {new: true} )

          debug(`Guardando el progreso de la letra : ${letter}`)
          res.status(200).json({ message: `Progreso en la letra ${letter} guardado`})


        }



      }



      if (!userProgressProfile) {

        const s = new UserProgress({ user_id: req.user._id, learnedLetters: [{ letter, rating }] })
        const t = await s.save()
        
        debug(`Creando un nuevo userProgressProfile para: ${req.user.email}`)
        res.status(200).json({ message: 'Saved data' })

      }



    } else {

      debug('unauthorized')
      handleError(res, 'unauthorized', 'datos y/o usuario invalidos')

    }
    


  } catch (error) {
    

    debug('Ha ocurrido un error')
    handleError(res, 'Ha ocurrido un error', 'Ha ocurrido un error')


  }



})



const validateLetterAndRating = (alphabet, maxRating, letter, rating) => {

  let valLetter = false;
  const valRating = rating <= maxRating ? true : false;
  alphabet.split('').forEach(l => l === letter ? valLetter = true : null );

  return valLetter === true && valRating === true ? true : false;

}



app.get('/', async (req, res) => {

  

})

const handleError = (res, message, error) => {

  return res.status(401).json({
    message: message || 'User Progress not found',
    error: error || 'Data Not Found'
  })

}

export default app
