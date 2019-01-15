import mongoose, { Schema } from 'mongoose'


const CommentSchema = new Schema(
  {
    user_id:    { type: Schema.Types.ObjectId,  ref: 'User', required: true },
    text:       { type: String, required: true, maxlength: 240, required: true },
    date:       { type: Date,   required: true, maxlength: 240, required: true },
    answers_id: { type: Schema.Types.ObjectId,  ref: 'Answer', required: true  }
  }
)


const CommentsSchema = new Schema(
  {
    course_id: { type: Schema.Types.ObjectId, ref: 'Course', required: true},
    comments:  [CommentSchema] 
  }
)


export default mongoose.model('Comment', CommentsSchema)
