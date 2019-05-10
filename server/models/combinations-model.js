import mongoose, { Schema } from 'mongoose'

const SyllableSchema = new Schema(
  {
    w: { type: String, required: true, maxlength: 20 },
    p: { type: String, required: true, maxlength: 20 },
  },
  {
    _id: false
  }
)


const CombinationsSchema = new Schema(
  {
    combination: { type: String,   required: true, maxlength: 4},
    word:        { type: String,   required: false, maxlength: 100 },
    syllable:    SyllableSchema,
    syllables:   { type: [String], required: true },
  },
  {
    _id: false
  }
  
)

const combinationSchema = new Schema(
  {
    letter:       { type: String, required: true, maxlength: 2 },
    combinations: [CombinationsSchema]
  }
);



export default mongoose.model('Combinations', combinationSchema)
