import express  from 'express'
import Debug    from 'debug'
import mongoose from 'mongoose'
import { nameProject                } from '../config'
import { verifyToken, validateUser  } from '../middleware'
import { CommentsModel, AnswerModel } from '../models'

const app   = express.Router()
const debug = new Debug(`${nameProject}: answers`)


app.post('/', verifyToken, validateUser, async (req, res) => {

  try {


    const { user_id, text, date,  comment_id, temp_id } = req.body
    debug(temp_id)
    const answer    = { _id: new mongoose.Types.ObjectId(), user: user_id, text, date }
    const addAnswer = await AnswerModel.findOneAndUpdate({comment_id}, {$push: {answers: answer } })

    answer['temp_id']    = temp_id
    answer['comment_id'] = comment_id
    
    debug(`Add answer to comment with id: ${comment_id}`)
    return res.status(200).json(answer)


  } catch (error) {

    debug('An internal error has occurred')
    debug(error)
    handleError(res)

  }

})

app.get('/:comment_id', verifyToken, validateUser, async (req, res) => {

  try {

    const course_id = req.params.course_id
    const data      = await CommentsModel.findOne({course_id}, {__v: 0})
      .populate('comments.user', { __v: 0, password: 0, email: 0 })

    const result = data ? data.comments : []

    res.status(200).json(result)

  } catch (error) {

    debug(error)
    degug('An internal error has ocurred')
    handleError(res)
    
  }

})

app.delete('/:comment_id', verifyToken, validateUser, async (req, res) => {

  try {
    
    const user_id = req.user._id
    const { comment_id, answer_id } = req.query
  
    const deleteAnswer = await AnswerModel.updateOne(
      { comment_id },
      { $pull: { 'answers': { _id: answer_id, user_id }} },
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