Actors = new Mongo.Collection("actors");
Movies = new Mongo.Collection("movies");
Casts = new Mongo.Collection("casts");
Clips = new Mongo.Collection("clips");

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('imageLimit', 6);
  Session.setDefault('actor','');
  Template.movies.helpers({
    movies:function(){
      if (Session.get("actor")) {
        return Movies.find();
      }
    },
    casts:function(){
      if (Session.get("actor")) {
        return Casts.find({actor:Session.get("actor")})
      }
    },
  });
  Template.movies.events({
    'click .js-m-form': function(event) {
      $("#movie_add_form").modal('show');
    },
    'click .js-m-image':function(event){
    //$(event.target).css("width", "50px");
      console.log("mv:"+this._id);
      Session.set('movie',this._id);
                Casts.insert({
            actor:Session.get("actor"), 
            movie:Session.get("movie"), 
            createdOn:new Date(),
            createdBy:Meteor.user()._id
          });
    },
    'click .js-del-m':function(event){
       var image_id = this._id;
       // use jquery to hide the image component
       // then remove it at the end of the animation
       $("#"+image_id).hide('slow', function(){
        Movies.remove({"_id":image_id});
       })  
    },
  });

  Template.actors.helpers({
    actors:function(){
      if (Session.get("userFilter")){// they set a filter!
        return Actors.find({createdBy:Session.get("userFilter")}, {sort:{createdOn: -1, rating:-1}});         
      }
      else {
        return Actors.find({}, {sort:{createdOn: -1, rating:-1}, limit:Session.get("imageLimit")});         
      }
    },
  });
  Template.actors.events({
    'click .js-image':function(event){
        //$(event.target).css("width", "50px");
        console.log(this._id);
        Session.set('actor',this._id);
    }, 
    'click .js-form': function(event) {
      $("#actor_add_form").modal('show');
    },
    'click .js-del-image':function(event){
       var image_id = this._id;
       // use jquery to hide the image component
       // then remove it at the end of the animation
       $("#"+image_id).hide('slow', function(){
        Actors.remove({"_id":image_id});
       })  
    },
  });
  Template.actor_add_form.events({
    'submit .js-add-image':function(event){
      var img_src, img_alt;

        img_src = event.target.img_src.value;
        img_alt = event.target.img_alt.value;
        console.log("src: "+img_src+" alt:"+img_alt);
        if (Meteor.user()){
          Actors.insert({
            img_src:img_src, 
            img_alt:img_alt, 
            createdOn:new Date(),
            createdBy:Meteor.user()._id
          });
        }
        $("#actor_add_form").modal('hide');
          event.target.img_src.value = '';
          event.target.img_alt.value = '';
     return false;
    }
  });
    Template.movie_add_form.events({
    'submit .js-add-movie':function(event){
      var movie_src, movie_name;
        movie_src = event.target.movie_src.value;
        movie_name = event.target.movie_name.value;
      var y_id = movie_src.match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/).pop();
      if (y_id.length == 11) {
       console.log('img.youtube.com/vi/'+y_id+'/0.jpg')
       thumb = 'https://img.youtube.com/vi/'+y_id+'/0.jpg';
      }  else {
        console.log("yid: "+y_id);
      }
        console.log("src: "+movie_src+" alt:"+movie_name);
        if (Meteor.user()){
          Movies.insert({
            movie_src:movie_src, 
            movie_name:movie_name, 
            createdOn:new Date(),
            createdBy:Meteor.user()._id,
            thumb:thumb});
          $("#movie_add_form").modal('hide');
          event.target.movie_src.value = '';
          event.target.movie_name.value = '';
          return false;
        }
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // setup admin mail
    process.env.MAIL_URL = "smtp://admin@timeskii.com:lzjrbjqhqchydffu@smtp.gmail.com:465/";

    // add verification email to create user
    Accounts.config({sendVerificationEmail: true, forbidClientAccountCreation: false}); 

   // 2. Format the email
   //-- Set the from address
   Accounts.emailTemplates.from = 'Admin ';

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
  });
}
