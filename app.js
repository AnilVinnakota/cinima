Actors = new Mongo.Collection("actors");

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('imageLimit', 6);
  Template.search.helpers({
    actors:function(){
      if (Session.get("userFilter")){// they set a filter!
        return Actors.find({createdBy:Session.get("userFilter")}, {sort:{createdOn: -1, rating:-1}});         
      }
      else {
        return Actors.find({}, {sort:{createdOn: -1, rating:-1}, limit:Session.get("imageLimit")});         
      }
    },
  });
  Template.search.events({
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
