import mongoose, { Schema } from 'mongoose'

const wordSchema = new Schema(
  {
    letter: { type: String, required: true, maxlength: 2},
    words:  { type: Array, required: true}
  }
);

export default mongoose.model('Word', wordSchema)