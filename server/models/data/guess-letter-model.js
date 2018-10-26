import mongoose, { Schema } from 'mongoose'

const guessLetterSchema = new Schema(
  {
    user_id:     { type: String, required: true },
    date:        { type: String, required: true },
    startTime:   { type: String, required: true },
    finalTime:   { type: String, required: true },
    letter:      { type: String, required: true },
    words:       [
      {
        word:        { type: String, required: true, maxlength: 100  },
        startTime:   { type: String, required: true, maxlength: 20   },
        finalTime:   { type: String, required: true, maxlength: 20   },
        correct:     { type: Number, required: true, max: 40, min: 0 },
        incorrect:   { type: Number, required: true, max: 40, min: 0 },
        pressImage:  { type: Number, required: true, max: 40, min: 0 },
        repetitions: { type: Number, required: true, max: 40, min: 0 },
        historial:   [
          {
            letter: { type: String, required: true, maxlength: 1    },
            time:   { type: String, required: true, maxlength: 20   },
            status: { type: Boolean, required: true}
          }
        ],
      }
    ],
  }
);

export default mongoose.model('guess_letter_data', guessLetterSchema)
