Meteor.startup (function() {
    Meteor.subscribe('Messages');

    console.log('client messages count ',Messages.find().count());
});
