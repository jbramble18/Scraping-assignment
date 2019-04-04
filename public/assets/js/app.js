$(document).on("click", "#scrape", function () {
  $(".load").html();
  $.get("/scrape", function (req, res) {
      console.log(res);
    })
    .then(function (data) {
      window.location.href = "/";
    });
});

$(document).on("click", ".home", function () {
  $.get("/", function (req, res) {
    console.log(res);
  }).then(function (data) {
    window.location.href = "/";
  });
});

$(document).on("click", ".save", function (event) {
  $(this).parent().remove();
  var articleId = $(this).attr("data-id");
  $.ajax({
      url: "/save/" + articleId,
      type: "POST"
    })
    .done(function (data) {
      $(".article").filter("[data-id='" + articleId + "']").remove();
    });
});

$(document).on("click", ".delete", function () {
  $(this).parent().remove();
  var articleId = $(this).attr("data-id");

  $.ajax({
      url: "/unsave/" + articleId,
      type: "POST"
    })
    .done(function (data) {
      $(".article").filter("[data-id='" + articleId + "']").remove();
    });
});

$(document).on("click", "#saved", function() {
  $.get("/saved", function (req, res) {
    console.log(res);
  })
  .then(function(data) {
    window.location.href = "/saved";
  });
});

$(document).on("click", ".addNote", function (event) {
  event.preventDefault();

  $("#notes").empty();
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/getNotes/" + thisId
  }).then(function (data) {
    console.log(data);
    $("#notes").append("<h2>" + data.title + "</h2>");
    $("#notes").append("<h3 id = 'notestitle'></h3>");
    $("#notes").append("<p id = 'notesbody'></p>");
    $("#notes").append("<div class='form-group'><label for='title'>Title: </label><input id='titleinput' class='form-control' name='title'></div>");
    $("#notes").append("<div class='form-group'><label for='body'>Note: </label><input id='bodyinput' class='form-control' name='body'></div>");
    $("#notes").append("<button class='btn btn-default' data-id='" + data._id + "' id='savenote'>Save Note</button>");

    if (data.note) {
      $("#notestitle").text(data.note.title);
      $("#notesbody").text(data.note.body);
    }
  });
  $('#noteModal').modal();
});

$(document).on("click", "#savenote", function() {
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/createNote/" + thidId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
  .then(function(data) {
    console.log(data);
    $("#notes").empty();
  });

  $("#titleinput").val("");
  $("#bodyinput").val("");
  $("#noteModal").modal("hide");
});



// // Whenever someone clicks a p tag
// $(document).on("click", "p", function() {
//   // Empty the notes from the note section
//   $("#notes").empty();
//   // Save the id from the p tag
//   var thisId = $(this).attr("data-id");

//   // Now make an ajax call for the Article
//   $.ajax({
//     method: "GET",
//     url: "/articles/" + thisId
//   })
//     // With that done, add the note information to the page
//     .then(function(data) {
//       console.log(data);
//       // The title of the article
//       $("#notes").append("<h2>" + data.title + "</h2>");
//       // An input to enter a new title
//       $("#notes").append("<input id='titleinput' name='title' >");
//       // A textarea to add a new note body
//       $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
//       // A button to submit a new note, with the id of the article saved to it
//       $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

//       // If there's a note in the article
//       if (data.note) {
//         // Place the title of the note in the title input
//         $("#titleinput").val(data.note.title);
//         // Place the body of the note in the body textarea
//         $("#bodyinput").val(data.note.body);
//       }
//     });
// });

// // When you click the savenote button
// $(document).on("click", "#savenote", function() {
//   // Grab the id associated with the article from the submit button
//   var thisId = $(this).attr("data-id");

//   // Run a POST request to change the note, using what's entered in the inputs
//   $.ajax({
//     method: "POST",
//     url: "/articles/" + thisId,
//     data: {
//       // Value taken from title input
//       title: $("#titleinput").val(),
//       // Value taken from note textarea
//       body: $("#bodyinput").val()
//     }
//   })
//     // With that done
//     .then(function(data) {
//       // Log the response
//       console.log(data);
//       // Empty the notes section
//       $("#notes").empty();
//     });

//   // Also, remove the values entered in the input and textarea for note entry
//   $("#titleinput").val("");
//   $("#bodyinput").val("");
// });

// $(".delete").on("click", function () {
//   var thisId = $(this).attr("data-id");
//   $.ajax({
//     method: "POST",
//     url: "/articles/delete/" + thisId
//   }).done(function(data) {
//     window.location = "/saved"
//   })
// });

// $(".deleteNote").on("click", function () {
//   var noteId = $(this).attr("data-note-id");
//   var articleId = $(this).attr("data-artcile-id");
//   $.ajax({
//     method: "DELETE",
//     url: "/notes/delete/" + noteId + "/" + articleId
//   }).done(function(data) {
//     console.log(data)
//     $(".modalNote").modal("hide");
//     window.location = "/saved"
//   })
// });