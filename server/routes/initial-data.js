import express         from 'express'
import Debug           from 'debug'
import { nameProject } from '../config'
import { verifyToken, validateUser } from '../middleware';
import { Words, Letters, SimilarLetters, UserProgress, Coordinates } from '../models';

const app   = express.Router()
const debug = new Debug(`${nameProject}: initial-data`)
const omit  = { __v: 0, _id: 0 }

app.get('/', verifyToken, validateUser, async (req, res) => {


  try {
    
    const t = [];
    const w = [];
    let l = [];
    const words       = await Words.find({}, omit)
    const letters     = await Letters.findOne({vocals: 'aeiou'}, omit)
    const sL          = await SimilarLetters.find({}, omit); 
    const lLetters    = await UserProgress.findOne({ user_id: req.user._id})
    const coordinates = await Coordinates.find({}, omit)

    l = lLetters ? lLetters.learnedLetters : [];
    words.forEach(x => w.push({ l: x.letter, w: x.words }))
    sL.forEach(x => t.push({l: x.letter, sl:  x.similarLetters}))
    
    res.status(200).json({
        words:          w,
        letters:        letters,
        similarLetters: t,
        learnedLetters: l, 
        coordinates:    coordinates
    })

    debug('Mostrando todos los registros de Words y Letters')

  } catch (error) {
    
    debug('An internal error has occurred')
    handleError(res)

  }


})

const handleError = (res, message) => {

  return res.status(400).json({
    message: 'Data not found',
    error: message || 'An internal error has occurred'
  })

}

export default app
