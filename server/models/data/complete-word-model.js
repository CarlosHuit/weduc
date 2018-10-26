import mongoose, { Schema } from 'mongoose'

const completeWordSchema = new Schema(
  {
    user_id:    { type: String, required: true },
    date:       { type: String, required: true, maxlength: 15 },
    startTime:  { type: String, required: true, maxlength: 15 },
    finishTime: { type: String, required: true, maxlength: 15 },
    letter:     { type: String, required: true, maxlength: 1 },
    words:      [
      {
        word:       { type: String, required: true, maxlength: 50 },
        startTime:  { type: String, required: true, maxlength: 20 },
        succesTime: { type: String, required: true, maxlength: 20 },
        pressImage: { type: Array, required: true },
        pressHelp:  { type: Array, required: true },
        historial:  [
          {
            time:   { type: String, required: true, maxlength: 20 },
            letter: { type: String, required: true, maxlength: 1 },
            state:  { type: Boolean, required: true }
          }
        ],
      }
    ],
  }
); 

export default mongoose.model('complete_word_data', completeWordSchema)
