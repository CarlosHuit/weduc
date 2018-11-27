import mongoose, { Schema } from 'mongoose'

const Historial = new Schema(
  {
    time: { type: String, required: true, maxlength: 20 },
    word: { type: String, required: true, maxlength: 20 },
    state: { type: Boolean, required: true}
  }, { _id: false }
)

const SelectWordsData = new Schema(
  {
    user_id:    { type: String,   required: true, maxlength: 100 },
    startTime:  { type: String,   required: true, maxlength: 20 },
    finishTime: { type: String,   required: true, maxlength: 20 },
    replays:    { type: [String], required: true },
    date:       { type: String,   required: true, maxlength: 20 },
    letter:     { type: String,   required: true, maxlength: 1  },
    amount:     { type: Number,   required: true, maxlength: 20 },
    corrects:   { type: Number,   required: true, maxlength: 20 },
    incorrects: { type: Number,   required: true, maxlength: 20 },
    pattern:    { type: [String], required: true },
    historial:  [Historial]
  }
)

export default mongoose.model('select_words_data_user', SelectWordsData)
