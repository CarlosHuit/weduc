import mongoose, { Schema } from 'mongoose'

const Selection = new Schema(
  {
    letter: { type: String,   required: true, maxlength: 1 },
    time:   { type: String,   required: true, maxlength: 20 },
    status: { type: Boolean,  required: true }
  }, { _id: 0 }
)

const Options = new Schema(
  {
    word:         { type: String,   required: true, maxlength: 50 },
    startTime:    { type: String,   required: true, maxlength: 20 },
    finalTime:    { type: String,   required: true, maxlength: 20 },
    correct:      { type: Number,   required: true, maxlength: 50 },
    incorrect:    { type: Number,   required: true, maxlength: 50 },
    pressImage:   { type: [String], required: true, maxlength: 50 },
    instructions: { type: [String], required: true, maxlength: 50 },
    historial:    [Selection]
  }, { _id: 0 }
)

const FindLetterSchema = new Schema(
  {
    user_id:    { type: String, required: true, maxlength: 100 },
    date:       { type: String, required: true, maxlength: 20  },
    startTime:  { type: String, required: true, maxlength: 20  },
    finalTime:  { type: String, required: true, maxlength: 20  },
    letter:     { type: String, required: true, maxlength: 1   },
    words:      [Options]
  }
)

export default mongoose.model('find_letters_data_user', FindLetterSchema)