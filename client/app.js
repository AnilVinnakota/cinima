/// Default 6 images
Session.setDefault('imageLimit', 8);

/// Start fresh with no actor and movie
Session.setDefault('actor','');
Session.setDefault('movie','');
Session.setDefault('y_id','');


// Search options
var options = {
  //keepHistory: 1000 * 60 * 5,
  localSearch: false
};

// Actor search fields
var actor_fields = ['name'];
// Actor search class
ActorSearch = new SearchSource('actors', actor_fields, options);

// Actor search fields
var movie_fields = ['movie_name'];
// Actor search class
MovieSearch = new SearchSource('movies', movie_fields, options);

// Movie helpers
Template.movies.helpers({
  // Search all movies
  movies:function(){
    return Movies.find({},{sort:{createdOn: -1, rating:-1}, limit:Session.get("imageLimit")});
  },
  casts:function(){
    if (Session.get("actor")) {
      return Casts.find({actor:Session.get("actor")})
    }
  },
    // Movies dynamic search
  getMovies: function() {
    return MovieSearch.getData({
                transform: function(matchText, regExp) {
                  return matchText.replace(regExp, "$&")
                },
                sort: {createdOn: -1}
    });
  },
});

// Movie events
Template.movies.events({
  // Add movie button
  'click .js-m-form': function(event) {
    $("#movie_add_form").modal('show');
  },
  // Select movie
  'click .js-m-image':function(event){


  },
  // Delete movie
  'click .js-del-m':function(event){
    var image_id = this._id;
       // use jquery to hide the image component
       // then remove it at the end of the animation
    $("#"+image_id).hide('slow', function(){
      Movies.remove({"_id":image_id});
    })  
  },
  'click .js-m-select':function(event){
   // Session.set('movie',this._id);
    Session.set('movie',this.movie_name);
    Session.set('y_id',this.y_id);
    Session.set('movie_id', this._id);
    Session.set('m_img',this.thumb);
    Session.set('actor','');
    Session.set('a_img','');
    Session.set('cid','');
    player.loadVideoById(Session.get("y_id",5,"large"));

    $('html, body').animate({
        scrollTop: $("#section3").offset().top
    }, 2000);

  },
    // Handle key press in search bar
  "keyup #m-search-box": _.throttle(function(e) {
    var text = $(e.target).val().trim();
    console.log('searching text:' + text);
    MovieSearch.search(text);
    }, 200),
});

Template.movies.rendered = function() {
   $( "#m-search-box" ).trigger( "keyup" );
};

// Actor helpers
Template.actors.helpers({
  // Actors dynamic search
  getActors: function() {
    return ActorSearch.getData({
                transform: function(matchText, regExp) {
                  return matchText.replace(regExp, "$&")
                },
                sort: {createdOn: -1}
    });
  },
  
  isLoading: function() {
    return ActorSearch.getStatus().loading;
  },

  // Actors full search
  actors:function(){
      if (Session.get("userFilter")){// they set a filter!
        return Actors.find({createdBy:Session.get("userFilter")}, {sort:{createdOn: -1, rating:-1}});         
      }
      else {
        return Actors.find({}, {sort:{createdOn: -1, rating:-1}, limit:Session.get("imageLimit")});         
      }
  },
});

// Actors events
Template.actors.events({
  // Handle key press in search bar
  "keyup #search-box": _.throttle(function(e) {
    var text = $(e.target).val().trim();
    console.log('searching text:' + text);
    ActorSearch.search(text);
    }, 200),
  // Actor select
  'click .js-image':function(event){
  }, 
  // Actor add
  'click .js-form': function(event) {
      $("#actor_add_form").modal('show');
  },
  // Actor delete
  'click .js-del-image':function(event){
    var image_id = this._id;
    // use jquery to hide the image component
    // then remove it at the end of the animation
    $("#"+image_id).hide('slow', function(){
      Actors.remove({"_id":image_id});
    })  
  },
  'click .js-a-select':function(event){
    Session.set('actor_id',this._id);
    Session.set('actor',this.name);
    Session.set('a_img',this.img_src);
    $('html, body').animate({
        scrollTop: $("#section3").offset().top
    }, 2000);
    //Session.set('cid', Casts.insert({
    cid = Casts.insert({

            actor:Session.get("actor_id"), 
            movie:Session.get("movie_id"), 
            createdOn:new Date(),
            createdBy:Meteor.user()._id});
    Session.set("cid",cid);
    console.log(Session.get("cid"));
    $("#a_stop").hide();
    $("#a_start").show();
  },
});

Template.actors.rendered = function () {
  $( "#search-box" ).trigger( "keyup" );
};

// Actor add form
Template.actor_add_form.events({
    'submit .js-add-image':function(event){
      var img_src, name;
      img_src = event.target.img_src.value;
      name = event.target.img_alt.value;
      console.log("src: "+img_src+" alt:"+img_alt);
      if (Meteor.user()){
        Actors.insert({
          img_src:img_src, 
          name:name, 
          createdOn:new Date(),
          createdBy:Meteor.user()._id
        });
      }
      $("#actor_add_form").modal('hide');
      event.target.img_src.value = '';
      event.target.img_alt.value = '';
      $( "#search-box" ).trigger( "keyup" );
      return false;
    }
});

// Movie add form
Template.movie_add_form.events({
  'submit .js-add-movie':function(event){
    var movie_src, movie_name;
    movie_src = event.target.movie_src.value;
    movie_name = event.target.movie_name.value;
    var y_id = movie_src.match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/).pop();
    if (y_id.length == 11) {
       thumb = 'https://img.youtube.com/vi/'+y_id+'/0.jpg';
    }  else {
      console.log("yid: "+y_id);
    }
    if (Meteor.user()){
      Movies.insert({
        movie_src:movie_src, 
        movie_name:movie_name,
        y_id:y_id,
        createdOn:new Date(),
        createdBy:Meteor.user()._id,
        thumb:thumb});
      $("#movie_add_form").modal('hide');
      event.target.movie_src.value = '';
      event.target.movie_name.value = '';
      $( "#m-search-box" ).trigger( "keyup" );
      return false;
    }
  }
});

Template.body.events({
  'click .nav a':function(){
   // $('.navbar-toggle').click(); //bootstrap 3.x by Richard
  }
});

onYouTubeIframeAPIReady = function () {

    // New Video Player, the first argument is the id of the div.
    // Make sure it's a global variable.
    player = new YT.Player("player", {

        height: "500", 
        width: "725", 

        // videoId is the "v" in URL (ex: http://www.youtube.com/watch?v=LdH1hSWGFGU, videoId = "LdH1hSWGFGU")
        videoId: Session.get("y_id"), 

        // Events like ready, state change, 
        events: {

            onReady: function (event) {

                // Play video when player ready.
               // event.target.playVideo();
            }
        }

    });

};

YT.load();
Template.app.helpers({
  mov: function() {
    return Session.get("movie");
  },
  mov_img: function(){
    return Session.get("m_img");
  },
  actor: function() {
    return Session.get("actor");
  },
  a_img: function(){
    return Session.get("a_img");
  },
  start_time: function() {
    return Session.get("a_start");
  },
});
Template.app.events({
  'click .js-m-play':function(){
    player.loadVideoById(Session.get("y_id",5,"large"));
  },
  'click .js-a-start':function(){
    $("#a_start").hide();
    $("#a_stop").show();
    Session.set("a_start", player.getCurrentTime())
    console.log(Session.get("a_start"));
  },
  'click .js-a-stop':function(){
    $("#a_stop").hide();
    $("#a_start").show();
    Clips.insert({cid:Session.get("cid"),
                 start:Session.get("a_start"),
                 end:player.getCurrentTime()});
  },

});
Template.app.rendered = function () {
 // player.stopVideo();
  //player.stopVideo();
      $("#a_stop").hide();
    $("#a_start").show();
};
