const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Candidate = require('../models/Candidate');
const Position = require('../models/Position');
const { Block } = require('../blockchain/Blockchain');
const router = express.Router();

router.get('/positions', protect, async (req, res) => {
  try {
    const positions = await Position.find({});
    res.json(positions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/candidates', protect, async (req, res) => {
  try {
    const candidates = await Candidate.find({});
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cast vote
router.post('/vote', protect, async (req, res) => {
  const { candidateId } = req.body;

  try {
    const user = await User.findById(req.user.id);
    const candidate = await Candidate.findById(candidateId);
    
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    const posId = candidate.positionId;

    if (user.votedPositions && user.votedPositions.includes(posId)) {
      return res.status(400).json({ message: 'You have already voted for this position' });
    }

    const position = await Position.findById(posId);
    const posTitle = position ? position.title : 'Unknown Position';

    // Process vote on Blockchain
    const voteData = {
      voterId: req.user.studentId, 
      candidateId: candidate._id,
      candidateName: candidate.name,
      party: candidate.party,
      position: posTitle
    };

    const newBlock = new Block(
      global.voteChain.chain.length,
      new Date().toISOString(),
      voteData
    );

    global.voteChain.addBlock(newBlock);

    // Update candidate count
    candidate.voteCount += 1;
    await candidate.save();

    // Mark user as voted for this position
    if(!user.votedPositions) user.votedPositions = [];
    user.votedPositions.push(posId);
    await user.save();

    res.status(200).json({ 
      message: 'Vote cast successfully!',
      block: newBlock
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Check user status
router.get('/status', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ votedPositions: user.votedPositions || [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
