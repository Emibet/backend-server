const express = require('express');

const router = express.Router();

const Job = require('../models/Job');
const User = require('../models/User');
const Company = require('../models/Company');

router.post('/:username/new', async (req, res, next) => {
  const { username } = req.params;
  const {
    title,
    location,
    contractType,
    salaryMin,
    salaryMax,
    experienceMin,
    workDay,
    study,
    // author,
    requirementMin,
    urgent,
  } = req.body;

  try {
    const company = await Company.find({ username });
    console.log(company[0].username);
    const job = await Job.create({
      title,
      location,
      contractType,
      salaryMin,
      salaryMax,
      experienceMin,
      workDay,
      study,
      author: company[0]._id,
      requirementMin,
      urgent,
    });

    const companyUpdate = await Company.findOneAndUpdate(
      { _id: company[0]._id },
      { $push: { jobs: job._id } },
      { upsert: true },
    );
    res.json({
      status: 200,
      job,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/all', async (req, res, next) => {
  try {
    const jobs = await Job.find().populate('author employee');
    res.json(jobs);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
