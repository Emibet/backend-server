const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const Job = require('../models/Job');
const User = require('../models/User');
const Company = require('../models/Company');

// GET route => to view all NURSES
router.get('/all', async (req, res, next) => {
  try {
    const nurses = await User.find().populate('candidateTo jobs');
    res.json({ status: 200, nurses });
  } catch (error) {
    next(error);
  }
});

// GET route => to view the NURSE Detail by Id
router.get('/:nurseId/detail', async (req, res, next) => {
  const { nurseId } = req.params;
  try {
    const nurse = await User.findById(nurseId).populate('candidateTo jobs');
    res.json({ status: 200, nurse });
  } catch (error) {
    next(error);
  }
});

// PUT route => to update NURSE PROFILE
router.put('/profile/edit', async (req, res, next) => {
  // const { jobId } = req.params;
  const actualUserId = req.session.currentUser._id;
  try {
    if (!mongoose.Types.ObjectId.isValid(actualUserId)) {
      res.status(400).json({ message: 'Specified NURSE id is not valid' });
      return;
    }
    const nurse = await User.findById(actualUserId);
    if (nurse) {
      const nurseUpdated = await User.findByIdAndUpdate(
        actualUserId,
        req.body,
        { new: true },
      );
      res.json({
        status: 200,
        nurseUpdated,
        message: `Nurse with id: ${actualUserId} updated successfully`,
      });
    } else {
      res.json({
        status: 500,
        message: 'Not Nurse',
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
