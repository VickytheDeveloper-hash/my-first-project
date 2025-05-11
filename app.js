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

//Adding js to help with dynamic blog publishing
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));

const BLOG_DATA_PATH = path.join(__dirname, 'data', 'blogs.json');

app.get('/blog', (req, res) => {
  const blogs = JSON.parse(fs.readFileSync(BLOG_DATA_PATH));
  res.send(`
    <h1>Blog Posts</h1>
    <ul>
      ${blogs.map(b => `<li><a href="/blog/${b.slug}">${b.title}</a> (${b.date})</li>`).join('')}
    </ul>
  `);
});

app.get('/blog/:slug', (req, res) => {
  const blogs = JSON.parse(fs.readFileSync(BLOG_DATA_PATH));
  const blog = blogs.find(b => b.slug === req.params.slug);

  if (!blog) {
    return res.status(404).send('Blog not found');
  }

  res.send(`
    <h1>${blog.title}</h1>
    <img src="${blog.imageUrl}" width="300" />
    <div>${blog.content}</div>
    <p><i>Published on ${blog.date}</i></p>
    <a href="/blog">← Back to blog</a>
  `);
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
