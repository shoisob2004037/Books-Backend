import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    profileImage: {
        type: String,
        default: ""
    }
}, {
    timestamps: true 
});

UserSchema.pre("save", async function(next) {
    try {
        if (!this.isModified("password")) {
            return next();
        }
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error); // Pass any bcrypt errors to Mongoose
    }
});

const User = mongoose.model('User', UserSchema); // Singular model name

export default User;