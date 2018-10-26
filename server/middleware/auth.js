import Debug from 'debug'
import { secret } from '../config'
import jwt from 'jsonwebtoken'
import { nameProject } from '../config'

const debug = new Debug(`${nameProject}: auth-token`)

export const required = (req, res, next) => {

  jwt.verify(req.query.token, secret, (err, token) => {

    if (err) {

      debug('El token no fue encriptado con la clave correcta')
      
      return res.status(401).json( {
        message: 'No autorizado',
        error: 'Token no valido'
      })

    }

    debug(`Token verificado correctamente`)
    req.user = token.user
    next()

  })
}