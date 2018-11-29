import express from 'express'
import Debug from 'debug'
import { Courses } from '../models';
import { nameProject } from '../config'
import { verifyToken, validateUser } from '../middleware'

const app = express.Router()
const debug = new Debug(`${nameProject}: courses`) 

const subjects = [
  {
    title: 'Lectura',
    subtitle: 'lectura',
    imageUrl: 'https://21hjk03hprzp3wb3op3limx7-wpengine.netdna-ssl.com/wp-content/uploads/2015/08/reading_1440765640.jpg',
    description: 'Aprende los conceptos basico necesarios para que aprendas a leer'
  },
  {
    title:    'Escritura',
    subtitle: 'escritura',
    imageUrl:    'https://www.curiosfera.com/wp-content/uploads/2017/11/so%C3%B1ar-con-escribir.jpg',
    description: 'Aprender todo lo necesario para dominar el grandioso mundo de la escritura'
  },
  {
    title:    'matemáticas básicas',
    subtitle: 'matematicas-basicas',
    imageUrl:    'https://i2.wp.com/www.calculators.org/graphics/algebra.jpg?zoom=2',
    description: 'Domina las operaciones aritmeticas basicas y aprende a aplicarlos en la vida real.'
  },
  {
    title:    'Dibujo',
    subtitle: 'dibujo',
    imageUrl:    'http://digo.do/wp-content/uploads/2015/02/EL-ARTE-DE-DIBUJAR.jpg',
    description: 'Domina las operaciones aritmeticas basicas y aprende a aplicarlos en la vida real.'
  },
  {
    title:    'Programación',
    subtitle: 'programacion',
    imageUrl:    'https://www.educaciontrespuntocero.com/wp-content/uploads/2015/12/programacion-macbook-pixabay.jpg',
    description: 'Domina las operaciones aritmeticas basicas y aprende a aplicarlos en la vida real.'
  }
];

app.get('/', verifyToken, validateUser, async (req, res) => {

  try {

    const courses = await Courses.find({}, { __v:0, _id:0});

    debug('Mostrando la informacion de todos los cursos')
    res.status(200).json(courses)
    
  } catch (error) {

    debug('Error al mostrar la informacion de los cursos')
    handleError(res, error)

  }

})



app.get('/:name', verifyToken, validateUser, async (req, res) => {

  const name = req.params.name
  
  try {

    const findCourse = await Courses.findOne({subtitle: name}, {_id: 0, __v:0})    
    debug(`Guardando la informacion de los cursos`)

    res.status(201).json(findCourse)
    
  } catch (error) {

    debug('Error al mostrar la informacion de los cursos')
    handleError(res, 'Error al guardar la informacion de los cursos')

  }

})



const handleError = (res, message) => {

  return res.status(401).json({
    message: 'Courses not found',
    error: message || 'Data Not Found'
  })

}

export default app