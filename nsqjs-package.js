if (Meteor.isClient) {
  Template.hello.events({
    'click button': function () {
      Meteor.call('writerExample', '127.0.0.1', 4150, 'sample_topic', 'sample_message');
    }
  });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        Meteor.call('readerExample', 'sample_topic', 'test_channel', {
            lookupdPollInterval:60,
            lookupdHTTPAddresses:'127.0.0.1:4161'
        });
    });
}
