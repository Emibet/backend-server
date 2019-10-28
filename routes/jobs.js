const express = require('express');

const router = express.Router();

const Job = require('../models/Job');
const User = require('../models/User');

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
    const user = await User.find({ username });
    console.log(user[0].username);
    const job = await Job.create({
      title,
      location,
      contractType,
      salaryMin,
      salaryMax,
      experienceMin,
      workDay,
      study,
      author: user[0]._id,
      requirementMin,
      urgent,
    });
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
