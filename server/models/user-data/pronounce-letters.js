import mongoose, { Schema } from 'mongoose'

const Historial = new Schema(
  {
    startRecord: { type: String,  required: true, minlength:5, maxlength: 20  },
    finalRecord: { type: String,  required: true, minlength:5, maxlength: 20  },
    sentence:    { type: String,  required: true, minlength:1, maxlength: 200  },
    state:       { type: Boolean, required: true },
  }
)

const PronounceLettersSchema = new Schema(
  {
    

    user_id:     { type: String,   required: true, minlength:20, maxlength: 200 },
    startTime:   { type: String,   required: true, minlength:5, maxlength: 20   },
    finalTime:   { type: String,   required: true, minlength:5, maxlength: 20   },
    date:        { type: String,   required: true, minlength:5, maxlength: 20   },
    letter:      { type: String,   required: true, minlength:1,  maxlength: 2   },
    countHelp:   { type: [String], required: true },
    historial:   [Historial],
  }
);

export default mongoose.model('pronounce_letters_data_user', PronounceLettersSchema)
