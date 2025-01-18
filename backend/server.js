const express = require('express');
const cors = require('cors');
const simulationRoutes = require('./routes/simulationRoutes');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/simulation', simulationRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
