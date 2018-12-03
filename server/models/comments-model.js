import mongoose, { Schema } from 'mongoose'


const CommentSchema = new Schema({
  user_id: { type: String, required: true, maxlength: 100 },
  text:    { type: String, required: true, maxlength: 240 },
})


const CommentsSchema = new Schema({
  course_id: { type: String, required: true, maxlength: 100 },
  comments:  [CommentSchema] 
});


export default mongoose.model('Comment', CommentsSchema)
