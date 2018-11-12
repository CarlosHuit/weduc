import mongoose, { Schema } from 'mongoose'

const learnedSchema = new Schema(
  {
    letter: { type: String, required: true, maxlength: 2 },
    rating: { type: Number, required: true, min: 0, max: 5 },  
  },
  { _id: false }
)

const userProgress = new Schema( {
  user_id:        { type: String, required: true, maxlength: 100, unique: true },
  learnedLetters: [learnedSchema]
})



// const userProgress = new Schema(
//   {
//     user_id:        { type: String, required: true, maxlength: 100, unique: true },
//     learnedLetters: [
//       {
//         letter: { type: String, required: true, maxlength: 2 },
//         rating: { type: Number, required: true, min: 0, max: 5 },
//       },
//       {
//         _id: false
//       }
//     ]
//   }
// )



var ToySchema = new Schema({ name: String });

var ToyBoxSchema = new Schema({
  toys: [ToySchema],
  buffers: [Buffer],
  strings: [String],
  numbers: [Number]
  // ... etc
});

export default mongoose.model('progress_of_user', userProgress)