import mongoose, { Schema } from 'mongoose'

const soundLetters = new Schema(
    {
        letters: { type: Object, required: true },
    }
);

export default mongoose.model('sound_letters', soundLetters)