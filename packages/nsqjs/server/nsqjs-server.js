/*
nsqjs node.js NSQ client library

https://github.com/dudleycarr/nsqjs

using meteorhacks:npm package:

https://meteorhacks.com/complete-npm-integration-for-meteor
https://github.com/meteorhacks/npm
*/

//global handle to node module
nsq = Npm.require('nsqjs');

Meteor.methods({
    //simple reader example listens and logs messages
    'readerExample' : function (topic, channel, options) {
        var reader = new nsq.Reader(topic, channel, options);
        reader.connect();
        reader.on('message', Meteor.bindEnvironment(function (msg) {
            console.log('received message '+msg.id+': '+msg.body.toString());
            msg.finish();
        }));
    },
    //node.js simple writer example
    'writerExample' : function (nsqdHost, nsqdPort, topic, message) {
        var writer = new nsq.Writer(nsqdHost, nsqdPort);
        writer.connect();
        writer.on('ready', Meteor.bindEnvironment(function () {
            writer.publish(topic, message, Meteor.bindEnvironment(function (err) {
                if (err) {
                    return console.error(err);
                }
                console.log('message sent successfully');
                writer.close();
            }));

        }));
    }
});
