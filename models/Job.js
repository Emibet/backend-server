const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const jobSchema = new Schema(
  {
    title: String,
    description: String,
    location: String,
    contractType: String,
    salaryMin: Number,
    salaryMax: Number,
    experienceMin: String,
    workDay: String,
    study: String,
    author: { type: ObjectId, ref: 'Company' },
    requirementMin: String,
    urgent: { type: Boolean, default: false },
    employee: { type: ObjectId, ref: 'User' },
    done: { type: Boolean, default: false },
    applicants: [
      {
        type: ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
