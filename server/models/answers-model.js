import mongoose, { Schema } from 'mongoose'


const AnswerSchema = new Schema(
  {
    user:    { type: Schema.Types.ObjectId,  ref: 'User', required: true  },
    text:       { type: String, required: true, maxlength: 240 },
    date:       { type: Date,   required: true, maxlength: 240 },
  }
)


const CommentsSchema = new Schema(
  {
    comment_id: { type: Schema.Types.ObjectId, ref: 'Course' },
    answers:  [AnswerSchema] 
  }
)


export default mongoose.model('Answer', CommentsSchema)
