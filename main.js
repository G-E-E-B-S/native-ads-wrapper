'use strict';

module.exports = {
  load () {
    // execute when package loaded
    Editor.log("Ads package loaded");
  },

  unload () {
    // execute when package unloaded
    Editor.log("Ads package unloaded");
  },

  // register your ipc messages here
  messages: {
    'say-hello' () {
      Editor.log('Hello World!');
    }
  },
};