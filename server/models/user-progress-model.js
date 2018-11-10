import mongoose, { Schema } from 'mongoose'

const userProgress = new Schema(
    {
        user_id:           { type: String, required: true, maxlength: 100 },
        learnedLetters:    [
            {
                letter: { type: String, required: true, maxlength: 2 },
                rating: { type: Number, required: true },
            }
        ]
    }
);

export default mongoose.model('user_progress', userProgress)