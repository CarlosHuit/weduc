import Debug from 'debug'
import app from './app'
import mongoose from 'mongoose'
import { mongoURL, port, nameProject } from './config'

const debug = new Debug(`${nameProject}:root`)
mongoose.Promise = global.Promise

async function  start() {

  mongoose.set('useCreateIndex', true)

  try {
  
    await mongoose.connect( mongoURL, { useNewUrlParser: true } )
    
    app.listen( port, () => debug(`Servidor escuchando en el puerto: ${ port }`))
    
  } catch (error) {

    debug(error)
    
  }
}

start()