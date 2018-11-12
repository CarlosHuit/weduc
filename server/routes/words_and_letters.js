import express from 'express'
import Debug from 'debug'
import { Words, Letters, SimilarLetters, UserProgress, User } from '../models';
import { nameProject } from '../config'
import { required, verifyToken } from '../middleware';

const app   = express.Router()
const debug = new Debug(`${nameProject}: words_and_letters`)
const omit  = { __v: 0, _id: 0 }

app.get('/', verifyToken, async (req, res) => {

  const { _id }            = req.user._id
  const user               = await User.findOne(_id)

  if (user) {
    try {
      
      const t = [];
      const w = [];
      let l = [];
      const words     = await Words.find({}, omit)
      const letters   = await Letters.findOne({vocals: 'aeiou'}, omit)
      const sL        = await SimilarLetters.find({}, omit); 
      const lLetters  = await UserProgress.findOne({ user_id: req.user._id})

      l = lLetters ? lLetters.learnedLetters : [];
      words.forEach(x => w.push({ l: x.letter, w: x.words }))
      sL.forEach(x => t.push({l: x.letter, m:  x.similarLetters}))
      
      res.status(200).json({
          words:          w,
          letters:        letters,
          similarLetters: t,
          learnedLetters: l
      })
  
      debug('Mostrando todos los registros de Words y Letters')
  
    } catch (error) {
  
      const msg = `Ha ocurrido un error, vuelve a intentarlo`
      debug(msg)
      handleError(res, msg)
  
    }
  } else {

    res.status(401).json({
      message: 'Usuario invalido'
    })

  }

})

const handleError = (res, message) => {

  return res.status(401).json({
    message: 'Words-And-Letters not found',
    error: message || 'Data Not Found'
  })

}

export default app
