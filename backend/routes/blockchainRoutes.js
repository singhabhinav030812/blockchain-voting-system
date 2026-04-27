const express = require('express');
const router = express.Router();

router.get('/chain', (req, res) => {
  res.json({
    chain: global.voteChain.chain,
    isValid: global.voteChain.isChainValid()
  });
});

module.exports = router;
