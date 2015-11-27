// Search handlers
SearchSource.defineSource('actors', function(searchText, options) {
  // Search options, return max 6 sorted by create time
  var options = {sort: {createdOn: -1}, limit: 6};
  if(searchText) {
    var regExp = buildRegExp(searchText);
    var selector = {$or: [
      {name: regExp},
    ]};
    return Actors.find(selector, options).fetch();
  } else {
    // Handle empty search
    console.log(Actors.find({}, options).count());
    return Actors.find({}, options).fetch();
  }
});

// Search handlers
SearchSource.defineSource('movies', function(searchText, options) {
  // Search options, return max 6 sorted by create time
  var options = {sort: {createdOn: -1}, limit: 6};
  if(searchText) {
    var regExp = buildRegExp(searchText);
    var selector = {$or: [
      {movie_name: regExp},
    ]};
    return Movies.find(selector, options).fetch();
  } else {
    // Handle empty search
    console.log(Movies.find({}, options).count());
    return Movies.find({}, options).fetch();
  }
});

// Regex parser
function buildRegExp(searchText) {
  // this is a dumb implementation
  var parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp("(" + parts.join('|') + ")", "ig");
}

// Startup function
Meteor.startup(function () {

  // *** Start Mail setup
  // setup admin mail
  process.env.MAIL_URL = "smtp://admin@timeskii.com:lzjrbjqhqchydffu@smtp.gmail.com:465/";

  // add verification email to create user
  Accounts.config({sendVerificationEmail: true, forbidClientAccountCreation: false}); 

 // Format the email
 //-- Set the from address
 Accounts.emailTemplates.from = 'Admin Cinima';

 //-- Application name
 Accounts.emailTemplates.siteName = 'Cinima';

 //-- Subject line of the email.
 Accounts.emailTemplates.verifyEmail.subject = function(user) {
   return 'Confirm your email address for Cinima';
 };

 //-- Email text
 Accounts.emailTemplates.verifyEmail.text = function(user, url) {
   return 'Hi,\r\n\r\nThank you for registering with us.\r\nPlease click on the following link to verify your email address: \r\n' + url + '\r\n\r\nRegards,\r\nTeam Cinima.';
 };
 // *** End Mail setup

});