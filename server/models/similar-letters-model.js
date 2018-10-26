import mongoose, { Schema } from 'mongoose'

const similarLettersSchema = new Schema(
    {
        letter: { type: String, required: true, maxlength: 2},
        similarLetters: { type: Array, required: true}
    }
);

export default mongoose.model('SimilarLetter', similarLettersSchema)