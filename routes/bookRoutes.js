import express from 'express';
import cloudinary from '../lib/cloudinary.js';
import Book from '../models/Book.js';
import protectRoute from '../middleware/auth.js';

const router = express.Router();

router.post("/", protectRoute, async (req, res) => {
    try {
        const { title, caption, rating, image } = req.body;
        if(!title || !caption || !rating || !image) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const uploadResponse = await cloudinary.uploader.upload(image, {
            folder: "React Native Books Recommendation"
        });
        const imageUrl = uploadResponse.secure_url;

        const newBook = new Book({
            title,
            caption,
            image: imageUrl,
            rating,
            user: req.user._id
        });

        await newBook.save(); // This was missing!
        
        const populatedBook = await Book.findById(newBook._id).populate('user', 'username profileImage');
        
        res.status(201).json({
            message: "Book recommendation created successfully",
            book: populatedBook
        });
    } catch (error) {
        console.error("Error creating book:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Also fix the GET route:
router.get("/", protectRoute, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10; 
        const skip = (page - 1) * limit;
        
        const books = await Book.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('user', 'username profileImage');
            
        if (!books || books.length === 0) {     
            return res.status(200).json({ 
                books: [],
                currentPage: page,
                totalPages: 0,
                totalBooks: 0
            });
        }
        
        const totalBooks = await Book.countDocuments();
        const totalPages = Math.ceil(totalBooks / limit);
        
        res.status(200).json({
            books,
            currentPage: page,
            totalPages,
            totalBooks
        });
    } catch (error) {
        console.log("Error fetching books:", error);
        res.status(500).json({ message: "Server error" });
    }
});
export default router;