
if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
  },
    messageId : function () {
        return Session.get('messageId');
    },
    messageBody : function () {
        return Session.get('messageBody');
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
      Meteor.call('writeMessage', '127.0.0.1', 4150, 'sample_topic', 'sample_message');
    }
  });
}
