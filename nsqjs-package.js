if (Meteor.isClient) {
  Template.hello.helpers({
    messages: function () {
      return Messages.find();
    }
  });

  Template.hello.events({
    'click button': function () {
      Meteor.call('writeMessage', '127.0.0.1', 4150, 'sample_topic', 'sample_message');
    }
  });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        Meteor.call('initReader', 'sample_topic', 'test_channel', {
            lookupdPollInterval:60,
            lookupdHTTPAddresses:'127.0.0.1:4161'
        });
    });
}
