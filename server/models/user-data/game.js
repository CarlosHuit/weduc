import mongoose, { Schema } from 'mongoose'

const History = new Schema(
  {
    letter: { type: String, required: true, maxlength: 1 },
    time:   { type: String, required: true, maxlength: 20},
    status: { type: Boolean, required: true },

  }, { _id: 0 }
)



const GameDataSchema = new Schema(
  {
    user_id:     { type: String, required: true, maxlength: 100 },
    date:        { type: String, required: true, maxlength: 20  },
    startTime:   { type: String, required: true, maxlength: 20  },
    finalTime:   { type: String, required: true, maxlength: 20  },
    letter:      { type: String, required: true, maxlength: 1   },
    amount:      { type: Number, required: true, max: 100 },
    correct:     { type: Number, required: true, max: 100 },
    incorrect:   { type: Number, required: true, max: 100 },
    repetitions: { type: [String], required: true         },
    historial:   [History]
  }
)


export default mongoose.model('game_data_user', GameDataSchema)
