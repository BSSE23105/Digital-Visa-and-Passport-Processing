const mongoose = require('mongoose');

const passportSchema = new mongoose.Schema({
  firstName:    { type: String, required: true },
  lastName:     { type: String, required: true },
  dateOfBirth:  { type: Date,   required: true },
  gender:       { type: String, enum: ['M','F','O'], required: true },
  passportType: { type: String, enum: ['regular','diplomatic','emergency'], required: true },
  email:        { type: String, required: true },
  phone:        { type: String, required: true },
  address:      { type: String, required: true },
  status:       { type: String, enum: ['Pending','Approved','Rejected'], default: 'Pending' }
}, { timestamps: true }); 

module.exports = mongoose.model('PassportApplication', passportSchema);
