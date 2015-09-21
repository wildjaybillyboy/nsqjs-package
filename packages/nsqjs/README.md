###NSQJS package for Meteor

Wrapper for node "NSQJS" module.  Package includes simple 'reader' and 'writer' functionality.  See NSQJS documentation for usage.  Note that non-async calls (ie: reader, writer streams) will need to be wrapped in a future fiber (see Meteor.bindEnvironment in meteor docs).
