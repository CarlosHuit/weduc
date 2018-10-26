import mongoose, { Schema } from 'mongoose'

const letterSchema = new Schema(
    {
        vocals:       { type: String, required: true, maxlength: 5 },
        consonants:   { type: String, required: true, maxlength: 25 },
        alphabet:     { type: String, required: true, maxlength: 28 },
        combinations: { type: Object, required: true },
        sound_letters: { type: Object, required: true },
    }
);

export default mongoose.model('Letter', letterSchema)