const express = require('express')
const app = express()

const postBank = require("./postBank")


const morgan = require('morgan');
const { find } = require('./postBank');
app.use(morgan('dev'));


app.use(express.json());


app.use(express.static('public'));


app.get("/", (req, res) => {
  const posts = postBank.list()
  const html = `<!DOCTYPE html>
  <html>
  <head>
      <title>Wizard News</title>
      <link rel="stylesheet" href="/index.css" />
  </head>
  <body>
      <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
      ${posts
        .map(
          (post) => `
         <div class='news-item'>
         <p>
         <span class="news-position">${post.id}. ▲</span><a href="/posts/${post.id}">${post.title}</a>
         <small>(by ${post.name})</small>
         </p>
         <small class="news-info">
         ${post.upvotes} upvotes | ${post.date}
         </small>
         </div>`
        )
        .join("")}
      </div>
  </body>
  </html>`
  console.log("A request to the  path has been made.");

  res.send(html);

})
app.get("/posts/:id", (req, res) => {
  const { id } = req.params;
  const post = postBank.find(id)

  if (!post.id) {
    res.status(404)
  } else {
    const html = `<!DOCTYPE html>
    <html>
    <head>
        <title>Wizard News</title>
        <link rel="stylesheet" href="/index.css" />
    </head>
    <body>
      <div class="news-list">
        <header><img src="/logo.png"/>Wizard News</header>
        <div class='news-item'>
        <p>${post.title} <small>(by ${post.name})</small></p>
        <p>${post.content}</p>
        </div></div>
        `; 
        res.send(html);
  }
});

app.get("*", (req, res) => {
      
  res.status(404).send(` <!DOCTYPE html>
    <html>
    <head>
      <title>Wizard News</title>
      <link rel="stylesheet" href="/style.css" />
    </head>
    <body>
      <header><img src="/logo.png"/>Wizard News</header>
      <div class="not-found">
        <p>Accio Page! Page Not Found.. :(</p>
      </div>
    </body>
    </html> `);
});








const { PORT = 1337 } = process.env;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
