import express from 'express'
import Debug from 'debug'
import { SoundLetters } from '../models';
import { nameProject } from '../config'

const app = express.Router()
const debug = new Debug(`${nameProject}: similarLetters`)

const soundsLetters = {
  a: '"ha"',
  b: '"b"',
  c: '"ce"',
  d: '"d"',
  e: '"e"',
  f: '"f"',
  g: '"ge"',
  h: '"ache"',
  i: '"i"',
  j: "...jota",
  k: '"ka"',
  l: 'l',
  m: '"eme"',
  n: '"ene"',
  ñ: '"eñe"',
  o: '"oh"',
  p: '.. p',
  q: '"cu"',
  r: '"erre"',
  s: '"ese"',
  t: '.. t',
  u: '"u .."',
  v: '"uve"',
  w: '"doble uve"',
  x: '".. equis"',
  y: '".. lle"',
  z: 'seta'
};

app.get('/save', async (req, res) => {

  try {

    const soundLetter = new SoundLetters({ letters: soundsLetters })
    const save = await soundLetter.save()

    debug('Guardando los sonidos de las letras')

    res.status(200).json({ message: 'Informacion guardada' })

  } catch (error) {

    handleError(res, 'Ha ocurrido un error')

  }

})

app.get('/', async (req, res) => {

  try {

    const data = await SoundLetters.findOne({}, { _id: 0, __v: 0 })
    debug(`Mostrando los registros de las pronunciaciones`)

    res.status(200).send(data.letters)

  } catch (error) {

    const msg = 'Error al mostrar los registros no encontrados'
    debug(msg)

    handleError(res, msg)

  }

})

const handleError = (res, message) => {

  return res.status(401).json({
    message: 'Letter not found',
    error: message || 'Data Not Found'
  })

}

export default app
