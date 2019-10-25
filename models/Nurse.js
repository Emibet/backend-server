const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const nurseSchema = new Schema(
  {
    name: String,
    surname: String,
    email: String,
    location: String,
    address: String,
    phone: Number,
    specialty: String,
    birthday: Date,
    dni: String,
    user: { type: ObjectId, ref: 'User' },
    resume: { type: ObjectId, ref: 'Resume' },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

const Nurse = mongoose.model('Nurse', nurseSchema);

module.exports = Nurse;
