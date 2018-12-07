// const MONGODB_URI_SERVER = process.env.MONGODB_URI || 'mongodb://emox:mX179zAzAzA@ds241737.mlab.com:41737/welearn'
const MONGODB_URI_SERVER = process.env.MONGODB_URI || 'mongodb:emox2544:mX179zA@ds141661.mlab.com:41661/weduc'

const MONGODB_URI_LOCAL  = process.env.MONGODB_URI || 'mongodb://localhost/weduc'

const PORT_SERVER = process.env.PORT || 8000
const PORT_LOCAL  = process.env.PORT || 3000


export const nameProject = 'WEDUC'
export const secret      = process.env.SECRET || 'mi clave secreta'
export const port        = process.env.NODE_ENV === 'production' ? PORT_SERVER        : PORT_LOCAL
export const mongoURL    = process.env.NODE_ENV === 'production' ? MONGODB_URI_SERVER : MONGODB_URI_LOCAL

