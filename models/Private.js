const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const privateSchema = new Schema(
  {
    name: String,
    surname: String,
    email: String,
    location: String,
    address: String,
    phone: Number,
    dni: String,
    user: { type: ObjectId, ref: 'User' },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

const Private = mongoose.model('Private', privateSchema);

module.exports = Private;
