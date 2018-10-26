import mongoose, {
  Schema
} from 'mongoose'

const courseSchema = new Schema({
  title:    { type: String, required: true, maxlength: 50, unique: true },
  subtitle: { type: String, required: true, maxlength: 100 },
  imageUrl: { type: String, required: true, maxlength: 200 },
  urlVideo: { type: String, required: true, maxlength: 200 },
  description: { type: String, required: true, maxlength: 250 },
});

export default mongoose.model('course', courseSchema)
