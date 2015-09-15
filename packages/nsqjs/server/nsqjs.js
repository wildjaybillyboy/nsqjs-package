/*
nsqjs node.js NSQ client library

https://github.com/dudleycarr/nsqjs

using meteorhacks:npm package:

https://meteorhacks.com/complete-npm-integration-for-meteor
https://github.com/meteorhacks/npm
*/

// Messages collection to cache messages in the NSQ queue
Messages = new Mongo.Collection('messages');
//global reader/writer nsqjs objects
reader = {};
writer = {};

if (Meteor.isServer) {
    //reader example from nsqjs docs
    /*
    var nsq = require('nsqjs');
    */
    nsq = Meteor.npmRequire('nsqjs');

    Meteor.startup (function () {
        /*
        var reader = new nsq.Reader('sample_topic', 'test_channel', {
            lookupdHTTPAddresses: '127.0.0.1:4161'
        });
        */
        reader = new nsq.Reader('sample_topic', 'test_channel', {lookupdHTTPAddresses:'127.0.0.1:4161'});

        /*
        reader.connect();
        */
        response = Meteor.call('connectReader');

        //using Meteor.bindEnvironment for node.js stream implementation (reader.on):
        //https://nodejs.org/api/stream.html
        /*
        reader.on('message', function (msg) {
            console.log('Received message [%s]: %s', msg.id, msg.body.toString());
            msg.finish();
        });
        */
        reader.on('message', Meteor.bindEnvironment(function (msg) {
            Messages.insert({messageId:msg.id,messageBody:msg.body.toString()});
            console.log('received message '+msg.id+': '+msg.body.toString());
            response = Meteor.call('finishMessage',msg);
        }));
    });

    //publish collection to client
    Meteor.publish('messages', function () {
        return Messages.find();
    });

    //async methods
    var wrapRConnect = Async.wrap(reader.connect);
    var wrapWConnect = Async.wrap(writer.connect);
    var wrapFinish = Async.wrap(this, 'finish');
    var wrapPublish = Async.wrap(writer.publish);

    Meteor.methods({
        //node.js reader.connect()
        'connectReader' : function () {
            var response = wrapRConnect();
            return response;
        },
        //node.js msg.finish()
        'finishMessage' : function (msg) {
            var response = msg.wrapFinish();
            return response;
        },
        //node.js writer.connect()
        'connectWriter' : function () {
            var response = wrapWConnect();
            return response;
        },
        //node.js writer.publish()
        'wrapPublish' : function () {
            var response = wrapPublish();
            return response;
        },
        //node.js simple writer example
        'writeMessage' : function (nsqdHost, nsqdPort, topic, message) {
            console.log('writeMessage start');
            writer = new nsq.Writer(nsqdHost, nsqdPort);
            response = connectWriter();
            writer.on('ready', Meteor.bindEnvironment(function () {
                wrappedPublish = Async.wrap(writer.publish, topic, message);
                response = (topic, message);
                console.log('writer publish');
                writer.close();
            }));
            writer.on('closed', Meteor.bindEnvironment(function (err) {
                if (err) {
                    Messages.insert({text:err});
                } else {
                    Messages.insert({text:'writer closed'});
                }
            }));
            console.log('writeMessage end');
            return true;
        }

    });
}
