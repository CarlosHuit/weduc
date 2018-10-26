import mongoose, { Schema } from 'mongoose'

const syllablesSchema = new Schema(
    {
        letter: { type: String, required: true, maxlength: 2 },
        syllables: { type: Array, required: true}
    }
);

export default mongoose.model('Syllables', syllablesSchema)