import mongoose, { Schema } from 'mongoose'

const letterSchema = new Schema(
    {
        letter: { type: String, required: true, maxlength: 2 },
        coordinates: { type: Array, required: true},
    }
);

export default mongoose.model('Coordinates', letterSchema)