
import mongoose, { Schema } from 'mongoose'

const gameSchema = new Schema(
  {
    user_id:     { type: String, required: true },
    date:        { type: String, required: true },
    startTime:   { type: String, required: true },
    finalTime:   { type: String, required: true },
    letter:      { type: String, required: true, maxlength: 1 },
    amount:      { type: Number, required: true, maxlength: 2 },
    correct:     { type: Number, required: true, maxlength: 2 },
    incorrect:   { type: Number, required: true, maxlength: 2 },
    repetitions: { type: Number, required: true, maxlength: 2 },
    historial:   [
      {
        letter: { type: String, required: true, maxlength: 2 },
        time:   { type: String, required: true, maxlength: 20 },
        status: { type: Boolean, required: true }
      }
    ],
  }
); 

export default mongoose.model('game_data', gameSchema)