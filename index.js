import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import { connectDB } from './lib/mongodb.js';
import cors from 'cors';


dotenv.config();

const app = express();
const PORT = 4000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.send('Welcome to the API');
});
app.get('/thik', (req, res) => {
    res.send('Thik Ache Shob');
});
app.get('/thikthak', (req, res) => {
    res.send('ThikThak Ache Shob');
});

app.use("/api/auth", authRoutes);
app.use("/api/book", bookRoutes);


app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`); 
    try {
        await connectDB();
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1); 
    }
});