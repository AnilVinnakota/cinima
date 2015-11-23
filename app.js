Actors = new Mongo.Collection("actors");

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.tagger.events({
    'click .js-form': function(event) {
      $("#actor_add_form").modal('show');
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
     return false;
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
            if (Actors.find().count() == 0){
                for (var i=1;i<23;i++){
                        Actors.insert(
                                {
                                        img_src:"img_"+i+".jpg",
                                        img_alt:"image number "+i
                                }
                        );
                }// end of for insert images
                // count the images!
                console.log("startup.js says: "+Actors.find().count());
        }// end of if have no images
  });
}