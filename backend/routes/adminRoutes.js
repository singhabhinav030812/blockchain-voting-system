const express = require('express');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const Candidate = require('../models/Candidate');
const Position = require('../models/Position');
const router = express.Router();

// ---- POSITIONS ----
router.get('/positions', protect, async (req, res) => {
  try {
    const positions = await Position.find({});
    res.json(positions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/positions', protect, adminOnly, async (req, res) => {
  try {
    const pos = new Position(req.body);
    await pos.save();
    res.status(201).json(pos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/positions/:id', protect, adminOnly, async (req, res) => {
  try {
    const pos = await Position.findById(req.params.id);
    if(pos) {
       await pos.deleteOne();
       res.json({ message: 'Position removed' });
    } else {
       res.status(404).json({ message: 'Position not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ---- CANDIDATES ----
router.get('/candidates', protect, async (req, res) => {
  try {
    const candidates = await Candidate.find({});
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/candidates', protect, adminOnly, async (req, res) => {
  try {
    const candidate = new Candidate(req.body);
    const createdCandidate = await candidate.save();
    res.status(201).json(createdCandidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/candidates/:id', protect, adminOnly, async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (candidate) {
      await candidate.deleteOne();
      res.json({ message: 'Candidate removed' });
    } else {
      res.status(404).json({ message: 'Candidate not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
