import mongoose, { Schema } from 'mongoose'

const ObjectId = mongoose.Schema.Types.ObjectId

const SelectWordsSchema = new Schema({
  user_id:      { type: ObjectId, required: true,},
  startTime:    { type: String,   required: true, maxlength: 20 },
  finishTime:   { type: String,   required: true, maxlength: 20 },
  date:         { type: String,   required: true, maxlength: 20 },
  letter:       { type: String,   required: true, maxlength: 1  },
  replays:      { type: [String], required: true, max: 50, min: 0 },
  amount:       { type: Number,   required: true, max: 50, min: 0},
  corrects:     { type: Number,   required: true, max: 50, min: 0},
  incorrects:   { type: Number,   required: true, max: 50, min: 0},
  pattern:      { type: [String], required: true},
  historial:    [
    {
      time:   { type: String, required: true, maxlength: 20 },
      word:   { type: String, required: true, maxlength: 50 },
      state:  { type: Boolean, required: true },
    }
  ],
});

export default mongoose.model('select_words_data', SelectWordsSchema)
