Meteor.methods({
  addAnimal: function(animal) {
    check(animal.name, String);

    _.extend(animal, {"rank": 0});
    Animals.insert(animal);
  }
});
