const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const Job = require('../models/Job');
const User = require('../models/User');
const Company = require('../models/Company');

// POST route => to create a new Job
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

// GET route => to view all JOBS
router.get('/all', async (req, res, next) => {
  try {
    const jobs = await Job.find().populate('author employee');
    res.json({ status: 200, jobs });
  } catch (error) {
    next(error);
  }
});

// GET route => to view all JOBS Posted by a specific Company
router.get('/:username/all', async (req, res, next) => {
  const { username } = req.params;
  try {
    const company = await Company.find({ username });
    const jobs = await Job.find({ author: company[0]._id }).populate(
      'author employee',
    );
    res.json({ status: 200, jobs });
  } catch (error) {
    next(error);
  }
});

// GET route => to view the JOB Detail by Id
router.get('/:jobId/detail', async (req, res, next) => {
  const { jobId } = req.params;
  try {
    const job = await Job.findById(jobId).populate(
      'author employee applicants',
    );
    res.json({ status: 200, job });
  } catch (error) {
    next(error);
  }
});

// PUT route => to update a specidifc JOB
router.put('/:jobId', async (req, res, next) => {
  const { jobId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      res.status(400).json({ message: 'Specified job id is not valid' });
      return;
    }
    const job = await Job.findByIdAndUpdate(jobId, req.body, { new: true });
    res.json({
      status: 200,
      job,
      message: `Job with id: ${jobId} updated successfully`,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE route => to delete a specific JOB
router.delete('/:jobId', async (req, res, next) => {
  const { jobId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      res.status(400).json({ message: 'Specified job id is not valid' });
      return;
    }
    const removedJob = await Job.findByIdAndRemove(jobId);
    const companyJob = removedJob.author;
    const updatedCompany = await Company.findByIdAndUpdate(companyJob, {
      $pull: { jobs: jobId },
    });
    res.json({
      status: 200,
      removedJob,
      updatedCompany,
      message: `Job with id: ${jobId} is removed successfully`,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
