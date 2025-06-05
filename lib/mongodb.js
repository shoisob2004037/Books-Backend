import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in the .env file');
        }
        await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        throw error; // Let the caller handle the error
    }
};