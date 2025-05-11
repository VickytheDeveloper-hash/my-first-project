const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// Set up static files
app.use(express.static('public'));

// Set up multer for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Handle POST request for blog upload
app.post('/upload', upload.single('image'), (req, res) => {
    const { title, content } = req.body;
    const imageUrl = '/uploads/' + req.file.filename; // The relative path to the uploaded image

    // Generate HTML content (You can customize this as needed)
    const generatedHTML = `
        <h1>${title}</h1>
        <img src="${imageUrl}" alt="${title}" />
        <p>${content}</p>
    `;

    // Send back the data (title, image URL, content)
    res.json({
        title: title,
        imageUrl: imageUrl,
        content: generatedHTML
    });
});

// Serve the front-end HTML
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Ensures the server is also affecting the uploads folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))
;

app.use('/uploads', express.static('uploads'));

