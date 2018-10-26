import mongoose, { Schema } from 'mongoose'

const IdentifyLetterSchema = new Schema(
  {
    

    user_id:     { type: String, required: true, minlength:20, maxlength: 200 },
    date:        { type: String, required: true, minlength:5, maxlength: 20  },
    startTime:   { type: String, required: true, minlength:5, maxlength: 20  },
    finalTime:   { type: String, required: true, minlength:5, maxlength: 20  },
    letter:      { type: String, required: true, minlength:1,  maxlength: 2   },
    countHelp:   { type: [String], required: true },
    historial:   [
      {
        startRecord: { type: String,  required: true, minlength:5, maxlength: 20  },
        finalRecord: { type: String,  required: true, minlength:5, maxlength: 20  },
        sentence:    { type: String,  required: true, minlength:1, maxlength: 200  },
        state:       { type: Boolean, required: true },
      }
    ],
  }
);

export default mongoose.model('identify_letter_data', IdentifyLetterSchema)
