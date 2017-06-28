import { Meteor } from 'meteor/meteor';
import '../imports/database/models.js';
import {crs} from '../imports/database/models.js';

Meteor.startup(() => {
  // code to run on server at startup
});


/*Meteor.methods({
  insertUser:function(newUserData){
    return Accounts.createUser(newUserData);
  },
});
*/