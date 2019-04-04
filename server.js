var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));


app.engine("handlebars", exphbs({
  defaultLayout: "main"

}));

app.set("view engine", "handlebars");
// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/newsdb", { useNewUrlParser: true });

// Routes

// A GET route for scraping the echoJS website
app.get("/", function (req, res) {
  db.Article
  .find({})
  .then(function(dbArticle) {
    var hbsObject = {
      articles: dbArticle
    };
    res.render("index", hbsObject);
  })
  .catch(function(err) {
    res.json(err);
  });
});

// app.get("/all", function(req,res) {
//   db.Article
//   .find({})
//   .then(function(dbArticle){
//     res.render("index", { dbArticle })
//     res.json(dbArticle)
//   })
//   .catch(function(err){
//     res.json(err)
//   });
// });


// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("http://www.kansascity.com/latest-news").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $(".card").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children(".package")
        .children("h3")
        .text()
        .trim();
      result.link = $(this)
        .children(".package")
        .children("h3")
        .children("a")
        .attr("href");

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });

    // Send a message to the client
    res.send("Scrape Complete");
  });
});

app.post("/save/:id", function(req,res) {
  db.Article
  .findOneAndUpdate({ _id: req.params.id }, { saved: true })
  .then(function(dbArticle) {
    res.json(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  });
});

app.post("/unsave/:id", function(req,res) {
  db.Article
  .findOneAndUpdate({ _id: req.params.id }, { saved: false })
  .then(function(dbArticle) {
    res.json(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  });
});

app.get("/saved", function(req, res) {
  db.Article
  .find({ saved: true })
  .then(function(dbArticle) {
    var hbsObject = {
      articles: dbArticle
    };
    res.render("saved", hbsObject);
  })
  .catch(function(err) {
    res.json(err);
  });
});

app.get("/getNotes/:id", function (req, res) {
  db.Article
  .findOne({ _id: req.params.id })
  .populate("note")
  .then(function(dbArticle) {
    res.json(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  });
});

app.post("/createNote/:id", function (req, res) {
  db.Note
  .create(req.body)
  .then(function(dbNote) {
    return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true});
  })
  .then(function(dbArticle) {
    res.json(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
