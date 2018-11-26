import mongoose, { Schema } from 'mongoose'

const Historial = new Schema(
  {

    time:         {type: String, required: true, maxlength: 20 },
    letter:       {type: String, required: true, maxlength: 1 },
    state:        {type: Boolean, required: true }
  },
  { _id: false }
)

const Couples = new Schema(
  {
    firstLetter:   {type: String, required: true, maxlength: 1 },
    secondLetter:  {type: String, required: true, maxlength: 1 },
  },
  { _id: false }
)

const MemoryGame = new Schema(
  {
    startTime:    {type: String, required: true, maxlength: 20 },
    finalTime:    {type: String, required: true, maxlength: 20 },
    pattern:      {type: [String], required: true },
    couples:      [Couples],
    historial:    [Historial]
  },
  { _id: false }
)

const CardExample = new Schema(
  {
    startTime:    {type: [String], required: true, maxlength: 20},
    finalTime:    {type: [String], required: true, maxlength: 20},
    listenLetter: {type: [String], required: true},
    listenMsg:    {type: [String], required: true}
  },
  { _id: false }
)




const LettersDetailSchema = new Schema({
  user_id:      {type: String, required: true, maxlength: 100},
  startTime:    {type: String, required: true, maxlength: 20 },
  finalTime:    {type: String, required: true, maxlength: 20 },
  date:         {type: String, required: true, maxlength: 20 },
  letter:       {type: String, required: true, maxlength: 1},
  cardExample:  CardExample,
  memoryGame:   MemoryGame,
});


export default mongoose.model('letters_detail_data_user', LettersDetailSchema)





