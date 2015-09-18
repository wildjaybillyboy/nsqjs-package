Meteor.startup (function() {
    Meteor.subscribe("messages");

    try {
        console.log('client messages count ',Messages.find().count());
    } catch (e) {
        console.error(e);
    }
});
