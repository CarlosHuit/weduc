import express  from 'express'
import Debug    from 'debug'
import mongoose from 'mongoose'
import { nameProject                } from '../config'
import { verifyToken, validateUser  } from '../middleware'
import { CommentsModel, AnswerModel } from '../models'
import { cpus } from 'os';

const app   = express.Router()
const debug = new Debug(`${nameProject}: comments`)


app.post('/', verifyToken, validateUser, async (req, res) => {

  try {

    const { temp_id, course_id, text, date, user_id } = req.body
    const courseComments = await CommentsModel.findOne({ course_id: course_id })

    if (!courseComments) {


      /*------ Generate the ObjectsIds of use on mongodb collections ------*/
      const idComment = new mongoose.Types.ObjectId()
      const idAnswers = new mongoose.Types.ObjectId()

      
      /*------ Init and save the first comment of the course ------*/
      const comment         = { _id: idComment, user_id, text, date, answers_id: idAnswers }
      const courseComments  = new CommentsModel({ course_id, comments: [comment] })
      const saveComment     = await courseComments.save()
      
      

      /*------ Initializing the collection of answers of the current course ------*/
      const initAnswers           = { _id: idAnswers, comment_id: comment._id  , answers: [] }
      const initAnswerComment     = new   AnswerModel(initAnswers)
      const saveInitAnswerComment = await initAnswerComment.save()

      
      debug('Creating a new register, adding the first comment and initialize your answers collection')

      comment['temp_id'] = temp_id
      return res.status(200).json(comment)

    }

    if (courseComments) {


      /*------ Generate the ObjectsIds of use on mongodb collections ------*/
      const idComment = new mongoose.Types.ObjectId()
      const idAnswers = new mongoose.Types.ObjectId()


      /* Save the new comment of course & the referenc to their answers */
      const comment    = { _id: idComment, user_id, text, date, answers_id: idAnswers }
      const addComment = await CommentsModel.findOneAndUpdate({course_id: course_id}, {$push: {comments: comment } }) 


      /*------ Initializing the collection of answers of the current course ------*/
      const initAnswers           = { _id: idAnswers, comment_id: comment._id  , answers: [] }
      const initAnswerComment     = new   AnswerModel(initAnswers)
      const saveInitAnswerComment = await initAnswerComment.save()


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
      .populate('comments.user_id',    { __v: 0, password: 0, email: 0 })
      .populate({
        path: 'comments.answers_id',
        populate: {
          path: 'answers.user'
        }
      })



    const result = data ? data.comments : []

    res.status(200).json(result)

  } catch (error) {

    debug(error)
    debug('An internal error has ocurred')
    handleError(res)
    
  }

})

app.delete('/:course_id', verifyToken, validateUser, async (req, res) => {

  try {
    
    const user_id = req.user._id
    const { course_id, comment_id } = req.query

    const data    = await AnswerModel.findOne({ comment_id }, {answers: 1})
    const answers = data.answers.length

    if (answers === 0) {

      const deleteComment = await CommentsModel.updateOne(
        { course_id },
        { $pull: { 'comments': { _id: comment_id, user_id }} },
        { safe: true }
      )

      const removeAnswers = await AnswerModel.deleteOne({comment_id})

      res.status(200).json({ message: 'Comment deleted' })

    } else {

      res.status(202).json({
        error: 'Accepted but not deleted',
        answers: 'Contain aswers'
      })

    }
    

  } catch (error) {
    
    debug(error)
    res.status(500).json({
      error:   'Internal Server Error',
      message: 'An internal erros has ocurred'
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
