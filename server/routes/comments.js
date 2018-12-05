import express  from 'express'
import Debug    from 'debug'
import mongoose from 'mongoose'
import { nameProject               } from '../config'
import { verifyToken, validateUser } from '../middleware'
import { CommentsModel             } from '../models'
import { cpus } from 'os';

const app   = express.Router()
const debug = new Debug(`${nameProject}: comments`)


app.post('/', verifyToken, validateUser, async (req, res) => {

  try {

    const { temp_id, course_id, text, date, user_id } = req.body
    const course = await CommentsModel.findOne({ course_id: course_id })

    if (!course) {

      const comment     = { _id: new mongoose.Types.ObjectId(), user_id, text, date }
      const newComment  = new CommentsModel({ course_id, comments: [comment] })
      const saveComment = await newComment.save()

      comment['temp_id'] = temp_id
      
      debug('Creando un nuevo registro y agregando commentarios')
      return res.status(200).json(comment)

    }

    if (course) {

      
      const comment    = { _id: new mongoose.Types.ObjectId(), user_id, text, date }
      const addComment = await CommentsModel.findOneAndUpdate({course_id: course_id}, {$push: {comments: comment } }) 

      comment['temp_id'] = temp_id
      
      debug('Agregando un nuevo comentario')
      return res.status(200).json(comment)
    }


  } catch (error) {

    debug('An internal error has occurred')
    debug(error)
    handleError(res)

  }

})

app.get('/:course_id', verifyToken, validateUser, async (req, res) => {

  try {

    const course_id = req.params.course_id
    const data      = await CommentsModel.findOne({course_id}, {__v: 0})
      .populate('comments.user_id', { __v: 0, password: 0, email: 0 })

    const result = data ? data.comments : []

    res.status(200).json(result)

  } catch (error) {

    debug(error)
    degug('An internal error has ocurred')
    handleError(res)
    
  }

})

app.delete('/:course_id', verifyToken, validateUser, async (req, res) => {

  try {
    
    const user_id = req.user._id
    const { course_id, comment_id } = req.query
  
    const deleteComment = await CommentsModel.updateOne(
      { course_id },
      { $pull: { 'comments': { _id: comment_id, user_id }} },
      { safe: true }
    )
  
    res.status(200).json({ message: 'Comentario eliminado' })

  } catch (error) {
    
    debug(error)
    res.status(401).json({
      error:   'Unauthorized',
      message: 'Unauthorized'
    })
  }

})


const handleError = (res, message) => {

  return res.status(400).json({
    message: 'Data not found',
    error: message || 'An internal error has occurred'
  })

}

export default app