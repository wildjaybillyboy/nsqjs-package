/*
nsqjs node.js NSQ client library

https://github.com/dudleycarr/nsqjs

using meteorhacks:npm package:

https://meteorhacks.com/complete-npm-integration-for-meteor
https://github.com/meteorhacks/npm
*/

//global reader/writer nsqjs objects
reader = {};
writer = {};

nsq = Meteor.npmRequire('nsqjs');

Meteor.startup (function () {
    //publish collection to client
    Meteor.publish("messages", function () {
        return Messages.find();
    });

    /*
    nsqjs Reader example
    var reader = new nsq.Reader('sample_topic', 'test_channel', {
        lookupdHTTPAddresses: '127.0.0.1:4161'
    });
    reader.connect();
    reader.on('message', function (msg) {
        console.log('Received message [%s]: %s', msg.id, msg.body.toString());
        msg.finish();
    });
    */
    reader = new nsq.Reader('sample_topic', 'test_channel', {lookupdPollInterval:60,lookupdHTTPAddresses:'127.0.0.1:4161'});
    reader.connect();
//    var wrapConnect = Async.wrap(reader.connect);
//    var result = wrapConnect.connect();
//    console.log(result);
    reader.on('message', Meteor.bindEnvironment(function (msg) {
        Messages.insert({messageId:msg.id,messageBody:msg.body.toString()});
        console.log('received message '+msg.id+': '+msg.body.toString());
//        msg.wrapFinish = Async.wrap(this, 'finish');
        msg.finish();
    }));
    console.log('finished server startup');
    try {
        console.log('message count: ',Messages.find().count(),' ',Messages.findOne()._id);
        console.log('message: ',Messages.findOne('kGDgciSQdgWuqr9Jy').text);
    } catch (e) {
        console.error(e);
    }
//    console.log('message count: ',Messages.find().count(),' ',Messages.findOne().messageBody);
});

Meteor.methods({
    //node.js simple writer example
    'writeMessage' : function (nsqdHost, nsqdPort, topic, message) {
        /*
        nsqjs Writer example

        var nsq = require('nsqjs');
        var w = new nsq.Writer('127.0.0.1', 4150);
        w.connect();
        w.on('ready', function () {
          w.publish('sample_topic', 'it really tied the room together');
          w.publish('sample_topic', [
            'Uh, excuse me. Mark it zero. Next frame.',
            'Smokey, this is not \'Nam. This is bowling. There are rules.'
          ]);
          w.publish('sample_topic', 'Wu?', function (err) {
            if (err) { return console.error(err.message); }
            console.log('Message sent successfully');
            w.close();
          });
        });
        w.on('closed', function () {
          console.log('Writer closed');
        });
        */

        console.log('writeMessage start');
        writer = new nsq.Writer(nsqdHost, nsqdPort);
//        var wrapWConnect = Async.wrap(writer.connect);
        writer.connect();
        writer.on('ready', Meteor.bindEnvironment(function () {
            console.log('writeMessage writer ready');
//            wrappedPublish = Async.wrap(writer.publish);
//            var response = wrappedPublish(topic, message, Meteor.bindEnvironment(function (err) {
//                if (err) {
//                    console.error('error in wrappedPublish');
//                    return console.error(err.message);
//                }
            writer.publish(topic, message, Meteor.bindEnvironment(function (err) {
                console.log('writer publish message sent successfully topic ',topic,' message ',message);
            }));
                console.log('writer publish message sent successfully topic ',topic,' message ',message);
//                var wrapClose = Async.wrap(writer.close);
//            }));
        }));
/*        writer.on('closed', Meteor.bindEnvironment(function (err) {
            if (err) {
                Messages.insert({text:err});
            } else {
                Messages.insert({text:'writer closed'});
            }
        }));
*/        console.log('writeMessage end');
        return true;
    }
});
