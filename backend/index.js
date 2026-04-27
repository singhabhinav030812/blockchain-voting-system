const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const voterRoutes = require('./routes/voterRoutes');
const blockchainRoutes = require('./routes/blockchainRoutes');

// Initialize the blockchain single instance
const { Block, Blockchain } = require('./blockchain/Blockchain');
global.voteChain = new Blockchain();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/voter', voterRoutes);
app.use('/api/blockchain', blockchainRoutes);

const PORT = 5000;

console.log(`Connected to Local JS Mock Database safely!`);
app.listen(PORT, () => console.log(`Backend Server running on port ${PORT}`));
