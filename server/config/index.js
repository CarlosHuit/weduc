export const secret = process.env.SECRET || 'mi clave secreta'
export const nameProject = 'WEDUC'



if ( process.env.NODE_ENV === 'production' ) {
  
  export const port     = process.env.PORT || 8000
  export const mongoURL = process.env.MONGODB_URI || 'mongodb://emox:mX179zAzAzA@ds241737.mlab.com:41737/welearn'
  
}

if ( process.env.NODE_ENV === 'development' ) {

  export const port     = process.env.PORT || 3000
  export const mongoURL = process.env.MONGODB_URI || 'mongodb://localhost/weduc'
  
}