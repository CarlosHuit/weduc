import Debug from 'debug'
import { secret } from '../config'
import jwt from 'jsonwebtoken'
import { nameProject } from '../config'

const debug = new Debug(`${nameProject}: auth-token`)

export const verifyToken = (req, res, next) => {

  const authorization = req.headers.authorization
  
  if (authorization) {
    const tokenHeader = authorization.slice(6)
    
    jwt.verify(tokenHeader, secret, (err, token) => {
      if (err) {
  
        debug('Token invalido')
        
        return res.status(401).json({
          message: 'No autorizado',
          error:   'Token invalido'
        })
        
      }
      
      debug(`Token verificado correctamente`)
      req.user = token.user
      next()
  
    })
  } else {
    res.status(401).json({
      message: 'invalid token'
    })
  }
}