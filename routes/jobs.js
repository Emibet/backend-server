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
    req.session.currentUser = companyUpdate;
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
    const jobs = await Job.find().populate('author employee applicants.user');
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
      'author employee applicants.user',
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
      // 'author employee applicants', // ORIGINAL
      'author employee applicants.user', // CHANGE IN MODEL
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

// PUT route => to put a USER in applicants ARRAY
router.put('/:jobId/:userId/add', async (req, res, next) => {
  const { jobId, userId } = req.params;
  // console.log('TCL: req.body APPLY JOB', req.body);
  try {
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      res.status(400).json({ message: 'Specified job id is not valid' });
      return;
    }
    const job = await Job.findByIdAndUpdate(
      jobId,
      { $push: { applicants: { user: userId, status: 'Pending' } } },
      { new: true },
    ).populate('applicants.user employee');
    console.log('TCL: job', job);
    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { 'nurse.candidateTo': jobId } },
      { new: true },
    );
    // .populate('nurse.candidateTo'); // Be carefull...!!!
    console.log('TCL: user', user);
    req.session.currentUser = user;

    // console.log('TCL: userID, jobID: ', jobId);
    res.json({
      status: 200,
      job,
      user,
      message: `Job with id: ${jobId} updated successfully`,
    });
  } catch (error) {
    next(error);
  }
});

// PUT route => to quit a USER in applicants ARRAY
router.put('/:jobId/:userId/cancel', async (req, res, next) => {
  const { jobId, userId } = req.params;
  // console.log('TCL: req.body CANCEL APPLY JOB', req.body);
  try {
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      res.status(400).json({ message: 'Specified job id is not valid' });
      return;
    }
    const job = await Job.findByIdAndUpdate(
      jobId,
      { $pull: { applicants: { user: userId } } },
      { new: true },
    ).populate('applicants.user employee');
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { 'nurse.candidateTo': jobId } },
      { new: true },
    );
    req.session.currentUser = user;

    // console.log('TCL: user', user);
    // console.log('TCL: userID, jobID: ', jobId);
    res.json({
      status: 200,
      job,
      user,
      message: `Job with id: ${jobId} updated successfully`,
    });
  } catch (error) {
    next(error);
  }
});

// PUT route => to assign a USER to JOB
router.put('/:jobId/:nurseId/:applicationId/assign', async (req, res, next) => {
  const { jobId, nurseId, applicationId } = req.params;
  console.log('TCL: req.params APPLY JOB', req.params);
  try {
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      res.status(400).json({ message: 'Specified job id is not valid' });
      return;
    }
    let job = await Job.findByIdAndUpdate(
      jobId,
      { $set: { employee: nurseId } },
      { new: true },
    ).populate('applicants.user employee');
    console.log('TCL: job 1 Update employee', job);

    // job = await Job.findByIdAndUpdate(
    //   jobId,
    //   {
    //     $set: {
    //       applicants: [
    //         {
    //           user: nurseId,
    //           status: 'Accepted',
    //         },
    //       ],
    //     },
    //   },
    //   { new: true },
    // ).populate('applicants.user employee');

    job = await Job.findOneAndUpdate(
      { _id: jobId, 'applicants._id': applicationId },
      {
        $set: {
          'applicants.$.status': 'Accepted',
        },
      },
      { new: true },
    ).populate('applicants.user employee');

    // job = await Job.findOneAndUpdate(
    //   { id: jobId, 'applicants.user': nurseId },
    //   {
    //     $set: {
    //       'applicants.status': 'Accepted',
    //     },
    //   },
    //   { new: true },
    // ).populate('applicants.user employee');

    // job = await Job.findOne({
    //   id: jobId,
    //   // 'applicants._id': applicationId,
    // }).then(function(doc) {
    //   console.log(doc);
    // });
    console.log('TCL: job 2 Update applicants', job);

    // let nurse = await User.findByIdAndUpdate(
    //   nurseId,
    //   { $pull: { 'nurse.candidateTo': jobId } },
    //   { new: true },
    // );

    nurse = await User.findByIdAndUpdate(
      nurseId,
      { $push: { 'nurse.jobs': jobId } },
      { new: true },
    );
    // .populate('nurse.candidateTo'); // Be carefull...!!!
    console.log('TCL: user NURSE', nurse);
    // req.session.currentUser = user;

    // console.log('TCL: userID, jobID: ', jobId);
    res.json({
      status: 200,
      job,
      nurse,
      message: `Job with id: ${jobId} updated successfully`,
    });
  } catch (error) {
    next(error);
  }
});

// PUT route => to CANCEL  assign a USER to JOB
router.put('/:jobId/:nurseId/cancelAssign', async (req, res, next) => {
  const { jobId, nurseId } = req.params;
  // console.log('TCL: req.body APPLY JOB', req.body);
  try {
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      res.status(400).json({ message: 'Specified job id is not valid' });
      return;
    }
    let job = await Job.findByIdAndUpdate(
      jobId,
      { $unset: { employee: nurseId } },
      { new: true },
    ).populate('applicants.user employee');

    // job = await await Job.findByIdAndUpdate(
    //   jobId,
    //   { $push: { applicants: nurseId } },
    //   { new: true },
    // ).populate('applicants employee');

    job = await Job.findOneAndUpdate(
      { _id: jobId, 'applicants.user': nurseId },
      {
        $set: {
          'applicants.$.status': 'Pending',
        },
      },
      { new: true },
    ).populate('applicants.user employee');

    let nurse = await User.findByIdAndUpdate(
      nurseId,
      { $push: { 'nurse.candidateTo': jobId } },
      { new: true },
    );

    nurse = await User.findByIdAndUpdate(
      nurseId,
      { $pull: { 'nurse.jobs': jobId } },
      { new: true },
    );
    // .populate('nurse.candidateTo'); // Be carefull...!!!
    console.log('TCL: user', nurse);
    // req.session.currentUser = user;

    // console.log('TCL: userID, jobID: ', jobId);
    res.json({
      status: 200,
      job,
      nurse,
      message: `Job with id: ${jobId} updated successfully`,
    });
  } catch (error) {
    next(error);
  }
});

// PUT route => to DECLINE the Job petition
router.put('/:jobId/:nurseId/declineAssign', async (req, res, next) => {
  const { jobId, nurseId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      res.status(400).json({ message: 'Specified job id is not valid' });
      return;
    }

    const job = await Job.findOneAndUpdate(
      { _id: jobId, 'applicants.user': nurseId },
      {
        $set: {
          'applicants.$.status': 'Declined',
        },
      },
      { new: true },
    ).populate('applicants.user employee');
    console.log('TCL: job', job);

    res.json({
      status: 200,
      job,
      message: `Job with id: ${jobId} updated successfully`,
    });
  } catch (error) {
    next(error);
  }
});

// PUT route => to DECLINE the Job petition
router.put('/:jobId/:nurseId/pendingAssign', async (req, res, next) => {
  const { jobId, nurseId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      res.status(400).json({ message: 'Specified job id is not valid' });
      return;
    }

    const job = await Job.findOneAndUpdate(
      { _id: jobId, 'applicants.user': nurseId },
      {
        $set: {
          'applicants.$.status': 'Pending',
        },
      },
      { new: true },
    ).populate('applicants.user employee');

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
