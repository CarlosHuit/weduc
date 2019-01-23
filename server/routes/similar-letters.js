import express from 'express'
import Debug from 'debug'
import { SimilarLetters } from '../models';
import { nameProject } from '../config';
import { verifyToken, validateUser } from '../middleware'

const app = express.Router()
const debug = new Debug(`${nameProject}: similarLetters`)


app.get('/', async (req, res) => {

  try {
    const t = [];
    const similarLetters = await SimilarLetters.find({}, {_id: 0, __v: 0})
    
    for (let i = 0; i < similarLetters.length; i++) {
      const el = similarLetters[i];
      const d = {};
      d['l'] = el.letter;
      d['sm'] = el.similarLetters;
      t.push(d)
    }

    debug('Se muestran todos los registros de letras similares');
    res.status(200).json(t)

  } catch (error) {

    const msg = 'Error al mostrar los registros de letras similares'
    debug(msg)
    handleError(res, msg )

  }

})


app.get('/:letter', async (req, res) => {

  const letter = req.params.letter
  const letterLower = letter.toLowerCase();
  const letterUpper = letter.toUpperCase();
  debug(letterLower)

  try {

    const findSimilarLettersLower = await SimilarLetters.findOne({ letter: letterLower })
    const findSimilarLettersUpper = await SimilarLetters.findOne({ letter: letterUpper })

    if ( findSimilarLettersLower && findSimilarLettersUpper ) {

      debug(`Mostrando las letras similares: ${letter}`)

      const x = [
        {
          letter: letterLower,
          similarLetters: findSimilarLettersLower.similarLetters
        },
        {
          letter:         letterUpper,
          similarLetters: findSimilarLettersUpper.similarLetters
        }
      ]

      res.status(200).json(x)

    } else {

      debug(`No se han encontrado letras similares a: ${letter}`)

      res.status(401).json({
        message: 'No encontrado',
        error: 'El registro no existe en la DB'
      })

    }


  } catch (error) {

    const msg = `Error al obtener las letras similares a: ${letter}`
    debug(msg)
    handleError(res, msg)

  }

})


app.get('/random/:letter', verifyToken, validateUser, async (req, res) => {

  const letterLowerCase = req.params.letter.toLowerCase();
  const letterUpperCase = req.params.letter.toUpperCase();

  try {

    const lettersLowerCase = await SimilarLetters.findOne({letter: letterLowerCase}, {_id: 0, __v: 0})
    const lettersUpperCase = await SimilarLetters.findOne({letter: letterUpperCase}, {_id: 0, __v: 0})

    const similarLowerCase = lettersLowerCase['similarLetters']
    const similarUpperCase = lettersUpperCase['similarLetters']

    const lowerCaseRandom = [];
    const upperCaseRandom = [];
    const amountLowerCase   = randomInt(8, 12)
    const amountUpperCase   = randomInt(8, 12)

    for (let i = 0; i < amountLowerCase; i++) {
      lowerCaseRandom.push(letterLowerCase)
    }

    for (let i = 0; i < amountUpperCase; i++) {
      upperCaseRandom.push(letterUpperCase)
    }


    for (let i = 0; i < 3; i++) {

      lowerCaseRandom.push(similarLowerCase[i])
      upperCaseRandom.push(similarUpperCase[i])

      similarLowerCase.forEach(letter => lowerCaseRandom.push(letter) )
      similarUpperCase.forEach(letter => upperCaseRandom.push(letter) )

    }


    const randomLowerCase = messUpWords(lowerCaseRandom)
    const randomUpperCase = messUpWords(upperCaseRandom)

    const upper = []
    const lower = []

    for (let i = 0; i < randomLowerCase.length; i++) {
      const element = `${randomLowerCase[i]}${i}`;
      lower.push(element)
    }

    for (let i = 0; i < randomUpperCase.length; i++) {
      const element = `${randomUpperCase[i]}${i}`;
      upper.push(element)
    }

    debug('mostrando letras similares de manera aleatoria')

    res.status(200).json({
      upperCase: upper,
      lowerCase: lower,
      u: lettersUpperCase,
      l: lettersLowerCase,
    })



  } catch (error) {
    debug(error)
  }
});

const handleError = (res, message) => {

  return res.status(401).json({
    message: 'Courses not found',
    error: message || 'Data Not Found'
  })

}

const messUpWords = (words) => {

  let messy = []

  while (true) {

    if (!words.length) { break }

    const extraction = words.shift()
    const random  = Math.floor(Math.random() * (messy.length + 1))
    const start   = messy.slice(0, random)
    const medium  = extraction
    const end     = messy.slice(random, messy.length)

    messy = (start).concat(medium).concat(end)

  }

  return messy

}

const randomInt = (min, max ) => {
  return Math.floor(Math.random() * (max - min)) + min;
}

export default app
