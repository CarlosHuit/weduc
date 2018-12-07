import mongoose, { Schema } from 'mongoose'


const CommentSchema = new Schema(
  {
    user_id:    { type: Schema.Types.ObjectId,  ref: 'User'    },
    text:       { type: String, required: true, maxlength: 240 },
    date:       { type: Date,   required: true, maxlength: 240 },
    answers_id: { type: Schema.Types.ObjectId,  ref: 'Answer'  }
  }
)


const CommentsSchema = new Schema(
  {
    course_id: { type: Schema.Types.ObjectId, ref: 'Course' },
    comments:  [CommentSchema] 
  }
)


export default mongoose.model('Comment', CommentsSchema)
