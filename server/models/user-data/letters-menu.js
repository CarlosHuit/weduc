import mongoose, { Schema } from 'mongoose'

const Times = new Schema(
  {
    startTime: { type: String, required: true, maxlength: 20 },
    finalTime: { type: String, required: true, maxlength: 20 },
  },
  {
    _id: false
  }
)

const LettersHeard = new Schema(
  {
    letter:    { type: String, required: true, maxlength: 1 },
    time:      { type: String, required: true, maxlength: 20 }
  },
  {
    id: false
  }
)

const Sort = new Schema(
  {
  sortBy:    { type: String, required: true, maxlength: 10 },
  time:      { type: String, required: true, maxlength: 20 },
  },
  {
    _id: false
  }
)

const Syllable = new Schema(
  {
    syllable:  { type: String, required: true, maxlength: 5 },
    time:      [String]
  },
  {
    _id: false
  }
)

const PreviewLetter = new Schema ({
  letter:         { type: String, required: true, maxlength: 1 },
  time:           [Times],
  upperCase:      [String],
  lowerCase:      [String],
  syllables:      [Syllable],
  timeRePractice: { type: String, required: true, maxlength: 20 }
}, { _id: false}
)

const TabAlphabet = new Schema(
  {
    times:          [Times],
    lettersHeard:   [LettersHeard],
    selection:      { type: String, required: true, maxlength: 1 }
  },
  {
    _id: false
  }
)


const TabLearnedLetters = new Schema(
  {
    times:          [Times],
    sort:           [Sort],
    previewLetters: [PreviewLetter]
  },
  {
    _id: false
  }
)




const LettersMenuSchema = new Schema({
  user_id:      {type: String, required: true, maxlength: 100 },
  startTime:    {type: String, required: true, maxlength: 20  },
  finalTime:    {type: String, required: true, maxlength: 20  },
  date:         {type: String, required: true, maxlength: 20  },
  tab_alphabet: TabAlphabet,
  tab_learned:  TabLearnedLetters,
});


export default mongoose.model('letters_menu_data_user', LettersMenuSchema)