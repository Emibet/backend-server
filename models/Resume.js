const mongoose = require('mongoose');

const { Schema } = mongoose;
// const { ObjectId } = Schema.Types;

const resumeSchema = new Schema(
  {
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

    // name: String,
    // surname: String,
    // email: String,
    // location: String,
    // address: String,
    // phone: Number,
    // specialty: String,
    // birthday: Date,
    // dni: String,
    // user: { type: ObjectId, ref: 'User' },
    // resume: { type: ObjectId, ref: 'Resume' },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;
