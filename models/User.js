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
      specialty: String,
      birthday: Date,
      dni: String,
      candidateTo: [{ type: ObjectId, ref: 'Job' }],
      jobs: [{ type: ObjectId, ref: 'Job' }],
      resume: {
        freelance: Boolean,
        licenseNumber: Number,
        nurseDegree: {
          year: Date,
        },
        experience: [
          {
            company: String,
            job: String,
            currentJob: Boolean,
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
        driverLicense: Boolean,
        car: Boolean,
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
