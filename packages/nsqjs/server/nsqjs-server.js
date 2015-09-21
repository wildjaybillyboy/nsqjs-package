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

//publish collection to client
try {
    Meteor.publish('messages', function () {
        return Messages.find();
    });
} catch (e) {
    console.error(e);
}

Meteor.methods({
    'initReader' : function (topic, channel, options) {
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

        reader = new nsq.Reader(topic, channel, options);
        reader.connect();
        reader.on('message', Meteor.bindEnvironment(function (msg) {
            Messages.insert({messageId:msg.id,messageBody:msg.body.toString()});
            console.log('received message '+msg.id+': '+msg.body.toString());
            msg.finish();
        }));
    },
    //node.js simple writer example
    'writeMessage' : function (nsqdHost, nsqdPort, topic, message) {
        /*
        nsqjs Writer example

        var nsq = require('nsqjs');
        var w = new nsq.Writer('127.0.0.1', 4150);
        w.connect();
        w.on('ready', function () {
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

        writer = new nsq.Writer(nsqdHost, nsqdPort);
        writer.connect();
        writer.on('ready', Meteor.bindEnvironment(function () {
            writer.publish(topic, message, Meteor.bindEnvironment(function (err) {
                if (err) {
                    console.error(err);
                } else {
                    console.log('writer published to nsq topic ',topic,' message ',message);
                }
            }));
        }));
        return true;
    }
});
