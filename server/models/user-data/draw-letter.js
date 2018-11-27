import mongoose, { Schema } from 'mongoose'

const SizeCanvas = new Schema(
  {
    width:  { type: Number, required: true },
    height: { type: Number, required: true },
  }, { _id: false }
)

const Coordinates = new Schema(
  {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  }, { _id: false }
)

const Board = new Schema(
  {
    coordinates: [[Coordinates]],
    sizeCanvas:  [SizeCanvas],
    timeClear:   { type: String, required: true, maxlength: 20 }
  }, { _id: false }
)

const DrawLettersDataSchema = new Schema({
  user_id:     { type: String,   required: true, maxlength: 100 },
  startTime:   { type: String,   required: true, maxlength: 20 },
  finalTime:   { type: String,   required: true, maxlength: 20 },
  date:        { type: String,   required: true, maxlength: 20 },
  letter:      { type: String,   required: true, maxlength: 1  },
  handWriting: { type: [String], required: true, maxlength: 1  },
  board:       [Board],
})

export default mongoose.model('draw_letters_data_user', DrawLettersDataSchema)
