    
import { Meteor } from 'meteor/meteor';
import '../imports/database/models.js';
import {msg} from '../imports/database/models.js';


    Meteor.methods({
        insertMessage:function(text){
            var user = Meteor.users.findOne(this.userId)
            msg.insert({
                userId:this.userId,
                username:user.profile.Username,
                text:text,
                timestamp:Date.now()
            })
        }
    })

    //msg.remove({})

    Meteor.publish('messages',function(limit){
        return msg.find({},{
            limit:limit || 5,
            sort:{timestamp:-1}
        });
    })