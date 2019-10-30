const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const Job = require('../models/Job');
const User = require('../models/User');
const Company = require('../models/Company');

// GET route => to view all COMPANIES
router.get('/all', async (req, res, next) => {
  try {
    const companies = await Company.find().populate('jobs');
    res.json({ status: 200, companies });
  } catch (error) {
    next(error);
  }
});

// GET route => to view the COMPANY Detail by Id
router.get('/:companyId/detail', async (req, res, next) => {
  const { companyId } = req.params;
  try {
    const company = await Company.findById(companyId).populate('jobs');
    res.json({ status: 200, company });
  } catch (error) {
    next(error);
  }
});

// PUT route => to update COMPANY PROFILE
router.put('/profile/edit', async (req, res, next) => {
  // const { jobId } = req.params;
  const actualUserId = req.session.currentUser._id;
  try {
    if (!mongoose.Types.ObjectId.isValid(actualUserId)) {
      res.status(400).json({ message: 'Specified Company id is not valid' });
      return;
    }
    const company = await Company.findById(actualUserId);
    if (company) {
      const companyUpdated = await Company.findByIdAndUpdate(
        actualUserId,
        req.body,
        { new: true },
      );
      res.json({
        status: 200,
        companyUpdated,
        message: `Company with id: ${actualUserId} updated successfully`,
      });
    } else {
      res.json({
        status: 500,
        message: 'Not Company',
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
