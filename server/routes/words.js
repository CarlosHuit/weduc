import express from 'express'
import Debug from 'debug'
import { Words } from '../models';
import { nameProject } from '../config'

const app = express.Router()
const debug = new Debug(`${nameProject}: words`)

app.get( '/', async (req, res) => {

  try {

    const words = await Words.find({}, { __v:0, _id:0})

    debug('Mostrando todos los registros de Words')
    res.status(200).json(words)
  
  } catch (error) {
    
    const msg = 'Error al mostrar los registros de words'
    debug(msg)
    handleError(res, msg)
  
  }

})


app.get('/random/:letter', async (req, res) => {

  const letterValidation = req.params.letter.toLowerCase()
  const omit  = {_id:0, __v: 0, letter: 0} 
  const words = [];

  try {


    const AllWords      = await Words.find({}, omit)
    const wordsOfLetter = await Words.findOne({letter: letterValidation}, omit)

    AllWords.forEach(element => element.words.forEach(el => words.push(el)))

    const t = cleanWords(words, letterValidation)
    const lowerCase = prepareData(wordsOfLetter.words, t, 'lowerCase')
    const upperCase = prepareData(wordsOfLetter.words, t, 'upperCase')


    debug('Mostran las palabras pata select-words')
    res.status(200).json({
      lowerCase: lowerCase,
      upperCase: upperCase
    })

  } catch (error) {
    const msg = 'Data not found'
    debug(msg)
    handleError(res, msg)
  }

})


app.get( '/:letter', async (req, res) => {

  const letter = req.params.letter

  try {

    const words  = await Words.findOne({'letter': letter}, { __v:0, _id:0})

    if (!words) {

      debug(`No existen registros para: ${letter}`)

      res.status(401).json({
        message: 'No encontrado',
        error: 'El registro no existe en la DB'
      })

    } else {

      res.status(200).json(words)
      debug(`Mostrando los registros de la letra: ${letter}`)

    }
  
  } catch (error) {
  
    const msg = `Error al mostrar los registros para: ${letter}`
    debug(msg)
    handleError(res, msg)
  
  }
})


app.get('/random-name-img/:letter', async (req, res) => {

  const letterValidation = req.params.letter.toLowerCase()
  const words = [];
  const omit  = { 
    _id:0, __v: 0,
    letter: 0
  } 

  try {

    
    const AllWords      = await Words.find({}, omit)
    const wordsOfLetter = await Words.findOne({letter: letterValidation}, omit)

    AllWords.forEach(element => element.words.forEach(el => words.push(el)))

    const corrects   = discardIncorrectWords(wordsOfLetter.words, letterValidation)
    const incorrects = discardCorrectWords(AllWords, letterValidation)


    // const wordsRandom = setValues(palabras correctas, t, 'lowerCase')
    const wordsRandom = setValues(corrects, incorrects)

    res.status(200).json(wordsRandom);


  } catch (error) {
    const msg = 'Data not found'
    debug(error)
    debug(msg)
    handleError(res, msg)
  }

})


const setValues = (corrects, incorrects) => {

  const min = 2;
  const max = 5 
  const totalWords  = 8
  const randomWords = []

  let numberOfCorrectWords   = 0;
  let numberOfIncorrectWords = 0;

  if ( corrects.length < 3) {

    numberOfCorrectWords   = corrects.length
    numberOfIncorrectWords = totalWords - numberOfCorrectWords

  } else {

    numberOfCorrectWords   = randomInt(min, max, corrects)
    numberOfIncorrectWords = totalWords - numberOfCorrectWords

  }

  const correctWords   = generateRandomWords(numberOfCorrectWords,   corrects  )
  const incorrectWords = generateRandomWords(numberOfIncorrectWords, incorrects)

  correctWords.forEach(  w => randomWords.push(w) )
  incorrectWords.forEach(w => randomWords.push(w) )

  const mx = messUpWords(randomWords);

  return {
    corrects:   correctWords,
    incorrects: incorrectWords,
    words:      mx
  };

}


const prepareData = ( allWords, cleanWords, type ) => {


  const randomNumberOfCorrectWords   = randomInt(2,6, allWords.length)
  const randomNumberOfIncorrectWords = 10 - randomNumberOfCorrectWords
  const correctWords1   = generateRandomWords(randomNumberOfCorrectWords, allWords)
  const incorrectWords1 = generateRandomWords(randomNumberOfIncorrectWords, cleanWords)


  const randomWords    = []
  const correctWords   = []
  const incorrectWords = [] 


  if (type === 'lowerCase') {

    correctWords1.forEach(  w => {
      randomWords.push(w.toLowerCase())
      correctWords.push(w.toLowerCase())
    })

    incorrectWords1.forEach(w => {
      randomWords.push(w.toLowerCase())
      incorrectWords.push(w.toLowerCase())
    })

  }
  
  if (type === 'upperCase') {

    correctWords1.forEach(  w => {
      randomWords.push( w.toUpperCase())
      correctWords.push(w.toUpperCase())
    })

    incorrectWords1.forEach(w => {
      randomWords.push(w.toUpperCase())
      incorrectWords.push(w.toUpperCase())
    })
  }

  const mx = messUpWords(randomWords);

  return {
    corrects: correctWords,
    incorrects: incorrectWords,
    words: mx
  };

}


const discardIncorrectWords = (words, letterValidation) => {

  const t = []

  words.forEach(word => {
    const val = word[0] === letterValidation ? t.push(word) : false;
  })

  return JSON.parse(JSON.stringify(t))

}


const discardCorrectWords = (AllWords, letterValidation) => {

  const r = [];

  AllWords.forEach(el => el.words.forEach(word => {
    const val = word[0] !== letterValidation ? r.push(word) : false;
  }))

  return JSON.parse(JSON.stringify(r))

}


const cleanWords = (words, coincidence) =>  {

  const l = []

  words.forEach(x => {

    const word       = x.split('')
    let coincidences = 0;

    for (let m = 0; m < word.length; m++) {
      const letter = word[m];

      if ( letter === coincidence ) {
        coincidences ++;
        break
      }

    }

    const addCount = coincidences === 0 ? l.push(x) : false; 

  })

  return l

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


const randomInt = (min, maxi, length) => {
  const max = maxi > length ? length + 1 : maxi + 1;
  return Math.floor(Math.random() * (max - min)) + min;
}


const generateRandomWords = (max, words) => {
    
  const usedIndexes = [];
  const f = []
  let count         = 0;

  while (count < max) {

    const numberRandom = randomInt(0, words.length - 1)
    const verifyIndex  = usedIndexes.indexOf(numberRandom);

    if (verifyIndex === -1) {

      usedIndexes.push(numberRandom)
      f.push(words[numberRandom])
      count++

    }

  }

  return f

}


const handleError = (res, message) => {

  return res.status(401).json({
    message: 'Words not found',
    error: message || 'Data Not Found'
  })

}


export default app
