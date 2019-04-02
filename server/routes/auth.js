import express from 'express'
import Debug from 'debug'
import jwt from 'jsonwebtoken'
import { secret, nameProject } from '../config'
import { User, Courses } from '../models'
import { hashSync as hash, compareSync as comparePassword } from 'bcryptjs'

const app = express.Router()
const debug = new Debug(`${nameProject}: auth`)

app.post( '/signin', async (req,res, next) => {


  const { email, password } = req.body
  const user = await User.findOne( { email } )


  if (!user) {
    
    debug(`El usuario con el email: ${email} no existe`)
    return handLoginFailed(res, `El email: ${email} no existe. \n Verifica y vuelve a intentarlo.`)
    
  }
  
  
  if (!comparePassword(password, user.password )) {
    
    debug(`Las contrasenas no coinciden: ${user.password} !== ${hash(password, 10)}`)
    return handLoginFailed(res, 'La contraseña no coincide')
    
  }
  
  
  const courses = await Courses.find({}, { __v:0});
  const token = createToken(user)

  const response = {
    auth: {
      token,
      message:   'Login Exitoso',
      userId:    user._id,
      firstName: user.firstName,
      lastName:  user.lastName,
      email:     user.email,
      avatar:    user.avatar
    },
    courses    
  }
  res.status(200).json(response)
  
  
  debug(`El email y el password han sido verificados correctamente}`)
  
  
})


const createToken = (user) => jwt.sign({ user }, secret, { expiresIn: 2592000 }) //86400





/* ------ validar que las contrase?as coincidan ------ */
app.post('/signup', async ( req, res, next ) => {
  

  const { firstName, lastName, email, password, password2, avatar } = req.body
  const findEmail = await User.findOne( { email } )

  if (findEmail) {
    
    debug(`El email: ${email} ya se encuentra registrado.`)
    return handLoginFailed(res, `El email: ${email} ya esta registrado. \n Verifica y vuelve a intentarlo.`)
    
  }

  if (password !== password2 ) {

    debug('Las contraseñas no coinciden')
    return handLoginFailed(res, 'Las contraseñas no coinciden')

  } 
  

  const currentUser = new User( { firstName, lastName, email, password: hash(password, 10), avatar } )
  const user        = await currentUser.save()
  const courses     = await Courses.find({}, { __v:0});
  const token       = createToken( user )
  
  const response = {
    auth: {
      token,
      message: 'Login Success',
      userId: user._id,
      firstName,
      lastName,
      email,
      avatar

    },
    courses
  }
  
  res.status(201).json(response)
  debug(`Cuenta registrada con el email: ${currentUser.email}`)




})



function handLoginFailed(res, message) {
  return res.status(401).json({
    message: 'Login Fallido',
    error:   message || 'Email y/o password no coinciden.'
  })
}


export default app