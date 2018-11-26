import { nameProject } from '../config'
import { User } from '../models'
import Debug           from 'debug'

const debug = new Debug(`${nameProject}: validate-user`)

export const validateUser = async (req, res, next) => {

  
  try {
    
    const email = req.user.email;
    const { _id } = req.user._id
    const user = await User.findOne({email: email})

    if (!user) {
      debug('El usuario no existe')

      return res.status(401).json({
        message: 'No autorizado',
        error:   'Usuario Invalido' 
      })
    }
  

    if (user) {
      debug('Usuario validado correctamente')
      next()
    }

  } catch (error) {
    
    debug('Error al validar el usuario')
    debug(error)
    return res.status(401).json({
      message: 'Imposible valida',
      error:   'Ha ocurrido un error'
    })

  }


}