if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });

Template.addactor.events({
  'click #add': function(e) {
    e.preventDefault();
    
    $('#animalsModal').modal('show');
  }
});
Template.animals.events({
  'click #add': function(e) {
    e.preventDefault();

    Modal.show('animalsModal');
  }
});

  Template.animalsModalTemplate.events({
  'click #save': function(e) {
    e.preventDefault();
    
    var animal = {
      name: $('#name').val()
    }

    Meteor.call('addAnimal', animal, function(error, result) {
      if (error) {
        alert(error);
      }
    });

    $('#animalsModal').modal('hide');
  }
});

   Template.animals.helpers({
  animals: function() {
    return Animals.find({}, { sort: {rank: 1}});
  }
});

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
