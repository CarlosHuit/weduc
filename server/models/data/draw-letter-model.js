import mongoose, { Schema } from 'mongoose'

const drawLetterSchema = new Schema(
  {
    user_id:         { type: String, required: true },
    date:            { type: String, required: true, maxlength: 20 },
    startTime:       { type: String, required: true, maxlength: 20 },
    finalTime:       { type: String, required: true, maxlength: 20 },
    letter:          { type: String, required: true, maxlength: 1 },
    boardData:       [
      {
        startTime:    { type: String, required: true, maxlength: 20 },
        nextTime:     { type: String, required: true, maxlength: 20 },
        repeatTime:   { type: String, required: true, maxlength: 20 },
        coordinates:  { type: Array,  required: true }
      }
    ],
    handWritingData: [
      {
        startTime:  { type: String, required: true, maxlength: 20 },
        nextTime:   { type: String, required: true, maxlength: 20 },
        repetition: { type: Array },
      }
    ]
  }
); 

const BoardData = new Schema(
  {
    startTime:    { type: String, required: true, maxlength: 20 },
    nextTime:     { type: String, required: true, maxlength: 20 },
    repeatTime:   { type: String, required: true, maxlength: 20 },
    coordinates:  { type: Array,  required: true }
  }
)

const HandWritingData = new Schema(
  {
    Time:       { type: String, required: true, maxlength: 20 },
    nextTime:   { type: String, required: true, maxlength: 20 },
    repetition: { type: Array, required: true },
  }
)

export default mongoose.model('draw_letters_data', drawLetterSchema)
