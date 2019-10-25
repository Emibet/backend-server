const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const companySchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    contactName: String,
    email: String,
    location: String,
    address: String,
    phone: Number,
    NIF: String,
    description: String,
    jobs: [{ type: ObjectId, ref: 'Job' }],
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
