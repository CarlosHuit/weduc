import mongoose, { Schema } from 'mongoose'


const targetSchema = new Schema(
  {
    user_id:    { type: String, required: true },
    initTime:   { type: String, required: true },
    date:       { type: String, required: true },
    finishTime: { type: String, required: true },
    letter:     { type: String, required: true },
    options:    [
      {
        word:       { type: String, required: true, maxlength: 50   },
        initTime:   { type: String, required: true, maxlength: 20   },
        pressImage: { type: Number, required: true, max: 40, min: 0 },
        pressWord:  { type: Number, required: true, max: 40, min: 0 },
        lower:      { type: Number, required: true, max: 40, min: 0 },
        upper:      { type: Number, required: true, max: 40, min: 0 },
        succesTime: { type: String, required: true, maxlength: 20   }
      }
    ],
  }
);

export default mongoose.model('target_data', targetSchema)
