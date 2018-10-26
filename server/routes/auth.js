import express from 'express'
import Debug from 'debug'
import jwt from 'jsonwebtoken'
import { secret, nameProject } from '../config'
import { User } from '../models'
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
    return handLoginFailed(res, 'La contrasena no coincide!')
    
  }
  
  
  
  const token = createToken(user)
  res.status(200).json({
    token,
    message:   'Login Exitoso',
    userId:    user._id,
    firstName: user.firstName,
    lastName:  user.lastName,
    email:     user.email
  })
  
  
  debug(`El email y el password han sido verificados correctamente}`)
  
  
})


const createToken = (user) => jwt.sign({ user }, secret, { expiresIn: 86400 }) //86400



app.post('/signup', async ( req, res, next ) => {
  
  
  const { firstName, lastName, email, password } = req.body
  const findEmail = await User.findOne( { email } )

  if (findEmail) {
    
    debug(`El email: ${email} ya se encuentra registrado.`)
    return handLoginFailed(res, `El email: ${email} ya esta registrado. \n Verifica y vuelve a intentarlo.`)
    
  }
  

  const currentUser = new User( { firstName, lastName, email, password: hash(password, 10) } )
  const user = await currentUser.save()
  const token = createToken( user )
  
  
  res.status(201).json(
    {
      message: 'Usuario Guardado',
      token,
      userId: user._id,
      firstName,
      lastName,
      email
    }
  )


  debug(`Registrando cuenta con el email: ${currentUser.email}`)


})



function handLoginFailed(res, message) {
  return res.status(401).json({
    message: 'Login Fallido',
    error:   message || 'Email y/o password no coinciden.'
  })
}


export default app