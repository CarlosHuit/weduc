import mongoose, { Schema } from 'mongoose'

const FindLetterSchema = new Schema(
  {
    user_id:         { type: String, required: true, maxlength: 100 },
    date:            { type: String, required: true, maxlength: 20  },
    startTime:       { type: String, required: true, maxlength: 20  },
    finalTime:       { type: String, required: true, maxlength: 20  },
    letter:          { type: String, required: true, maxlength: 1   },
    pattern:         { type: [String], required: true,    },
    fails:           { type: Number, required: true, min:0, max: 40  },
    pressLetter:     { type: [String], required: true  },
    couples:         { type: [String], required: true  },
    historial:       [
      {
        time:    { type: String, required: true, maxlength: 20 },
        letter:  { type: String, required: true, maxlength: 20 },
        state:   { type: Array,  required: true }
      }
    ]
  }
); 


export default mongoose.model('find_letter_data', FindLetterSchema)
