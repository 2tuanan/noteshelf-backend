const express = require('express');
const app = express();
require('dotenv').config();
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { dbConnect } = require('./utils/db');
const { errorHandler } = require('./middlewares/errorHandler');
const aiRoutes = require('./routes/aiRoutes');
const exportRoutes = require('./routes/exportRoutes');

app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3066'],
    credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api', require('./routes/authRoutes'))
app.use('/api', require('./routes/noteRoutes'))
app.use('/api/ai', aiRoutes)
app.use('/api/export', exportRoutes)
app.use('/api', require('./routes/adminRoutes'))

app.get('/', (req, res) => res.send('Backend!'));
app.use(errorHandler);
const port = process.env.PORT
dbConnect();
app.listen(port, () => console.log(`Server is running on port ${port}`));