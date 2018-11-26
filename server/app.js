import express from 'express'
import compression from 'compression'
import bodyParser from 'body-parser'
import path from 'path'
import { 
  auth, user, letter, word, coordinates, similarLetters, saveData, Syllables,
  Target, GuessLetter,
  DrawLetter, CompleteWord, SoundLetters, Courses, InitialData, FindLetter, SelectWords, SelectImages,
  IdentifyLetter, Combinations, UserProgress
} from './routes'

import { lettersMenu, lettersDetail, Game } from './routes/user-data'

const app = express()
const compress = compression()

app.use(compress)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

if ( process.env.NODE_ENV === 'development' ) {
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Request-With, Content-Type, Accept, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS')
    next()
  })
}

if ( process.env.NODE_ENV === 'production' ) {
  app.use(express.static(path.join(process.cwd(), 'dist')))
}

app.use('/api/auth',                auth              )
app.use('/api/auth/user',           user              )
app.use('/api/initial-data',        InitialData       )


app.use('/api/letters',             letter            )
app.use('/api/guardar',             saveData          )
app.use('/api/words',               word              )
app.use('/api/syllables',           Syllables         )
app.use('/api/coordinates',         coordinates       )
app.use('/api/similar-letters',     similarLetters    )
app.use('/api/sound-letters',       SoundLetters      )
app.use('/api/courses',             Courses           )
app.use('/api/combinations',        Combinations      )
app.use('/api/user-progress',       UserProgress      )


app.use('/api/data/letters-menu',    lettersMenu      )
app.use('/api/data/letters-detail',  lettersDetail    )
app.use('/api/data/game',            Game             )

app.use('/api/data/target',          Target           )
app.use('/api/data/guess-letter',    GuessLetter      )
app.use('/api/data/draw-letter',     DrawLetter       )
app.use('/api/data/complete-word',   CompleteWord     )
app.use('/api/data/find-letter',     FindLetter       )
app.use('/api/data/select-words',    SelectWords      )
app.use('/api/data/select-images',   SelectImages     )
app.use('/api/data/identify-letter', IdentifyLetter   )

export default app
