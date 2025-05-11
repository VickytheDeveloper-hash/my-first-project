const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Ensure uploads are served
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/uploads', express.static('uploads'));

// Set up multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Blog upload route
app.post('/upload', upload.single('image'), (req, res) => {
  const { title, content } = req.body;
  const imageUrl = '/uploads/' + req.file.filename;

  const generatedHTML = `
    <h1>${title}</h1>
    <img src="${imageUrl}" alt="${title}" />
    <p>${content}</p>
  `;

  res.json({ title, imageUrl, content: generatedHTML });
});

// Serve the frontend form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Blog display routes
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

  if (!blog) return res.status(404).send('Blog not found');

  res.send(`
    <h1>${blog.title}</h1>
    <img src="${blog.imageUrl}" width="300" />
    <div>${blog.content}</div>
    <p><i>Published on ${blog.date}</i></p>
    <a href="/blog">← Back to blog</a>
  `);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
//CSS functionalty
app.use(express.static('public'));
