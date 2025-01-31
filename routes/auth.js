const express = require('express');
const bcrypt = require('bcrypt');

const { checkUsernameAndPasswordNotEmpty } = require('../middlewares');

const User = require('../models/User');
const Company = require('../models/Company');

const bcryptSalt = 10;

const router = express.Router();

router.get('/me', (req, res, next) => {
  if (req.session.currentUser) {
    res.status(200).json(req.session.currentUser);
  } else {
    res.status(401).json({ code: 'unauthorized' });
  }
});

router.post(
  '/signup',
  checkUsernameAndPasswordNotEmpty,
  async (req, res, next) => {
    const { username, password, company } = res.locals.auth;
    console.log('TCL: company', company);
    try {
      const user = await User.findOne({ username });
      if (user) {
        return res.status(422).json({ code: 'username-not-unique' });
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashedPassword = bcrypt.hashSync(password, salt);

      if (company) {
        const newCompany = await Company.create({ username, hashedPassword });
        req.session.currentUser = newCompany;
        return res.json(newCompany);
      } else {
        const newUser = await User.create({ username, hashedPassword });
        req.session.currentUser = newUser;
        return res.json(newUser);
      }
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/login',
  checkUsernameAndPasswordNotEmpty,
  async (req, res, next) => {
    const { username, password } = res.locals.auth;
    try {
      const user = await User.findOne({ username });
      const company = await Company.findOne({ username });
      if (!user && !company) {
        return res.status(404).json({ code: 'not-found' });
      }
      if (user) {
        if (bcrypt.compareSync(password, user.hashedPassword)) {
          req.session.currentUser = user;
          return res.json(user);
        }
      }
      if (company) {
        if (bcrypt.compareSync(password, company.hashedPassword)) {
          console.log('TCL: company', company);
          req.session.currentUser = company;
          return res.json(company);
        }
      }
      return res.status(404).json({ code: 'not-found' });
    } catch (error) {
      next(error);
    }
  },
);

router.get('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      next(err);
    }
    return res.status(204).send();
  });
});

module.exports = router;
