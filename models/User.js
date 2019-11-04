const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    // type: {
    //   superAdmin: { type: Boolean, default: false },
    //   nurse: { type: Boolean, default: false },
    //   company: { type: Boolean, default: false },
    // },
    nurse: {
      name: String,
      surname: String,
      email: String,
      location: String,
      address: String,
      phone: Number,
      speciality: String,
      birthday: Date,
      dni: String,
      candidateTo: [{ type: ObjectId, ref: 'Job' }],
      jobs: [{ type: ObjectId, ref: 'Job' }],
      driverLicense: { type: Boolean, default: false },
      car: { type: Boolean, default: false },
      resume: {
        freelance: { type: Boolean, default: false },
        licenseNumber: Number,
        nurseDegree: {
          year: Date,
        },
        experience: [
          {
            company: String,
            job: String,
            currentJob: { type: Boolean, default: false },
            startDate: Date,
            endDate: Date,
            jobDescription: String,
          },
        ],
        studies: [
          {
            title: String,
            startDate: Date,
            endDate: Date,
            academy: String,
          },
        ],
        languages: [
          {
            name: String,
            speak: {
              type: String,
              enum: ['Basic', 'Intermediate', 'Advance', 'Native'],
              default: 'Basic',
            },
            write: {
              type: String,
              enum: ['Basic', 'Intermediate', 'Advance', 'Native'],
              default: 'Basic',
            },
            read: {
              type: String,
              enum: ['Basic', 'Intermediate', 'Advance', 'Native'],
              default: 'Basic',
            },
          },
        ],
      },
    },
    avatar: String,
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

const User = mongoose.model('User', userSchema);

module.exports = User;
