import mongoose, { Schema } from 'mongoose'


const menuSchema = new Schema({
  user_id:     {type: String, required: true, },
  initTime:    {type: String, required: true},
  successTime:  {type: String, required: true},
  date:        {type: String, required: true},
  selection:    [
    {
      letter:        { type: String, required: true, maxlength: 1 },
      openModalTime: { type: String, required: true },
      letterUpper:   { type: Number, required: true, max: 99 },
      letterLower:   { type: Number, required: true, max: 99 },
      words:         { type: Object, required: true },
      syllables:     { type: Object, required: true },
      cancelTime:    { type: String, required: true },
    }
  ],
});

export default mongoose.model('menu_letters_data', menuSchema)
