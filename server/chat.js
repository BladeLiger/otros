    
import { Meteor } from 'meteor/meteor';
import '../imports/database/models.js';
import {msg} from '../imports/database/models.js';
import {msgClases} from '../imports/database/models.js';


    Meteor.methods({
        insertMessage:function(text){
            var user = Meteor.users.findOne(this.userId)
            msg.insert({
                userId:this.userId,
                username:user.profile.Username,
                text:text,
                timestamp:Date.now()
            })
        },

        insertMessageClases:function(text,idclass){
            var user = Meteor.users.findOne(this.userId)
            msgClases.insert({
                userId:this.userId,
                classID:idclass,
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

    Meteor.publish('messagesClases',function(limit){
        return msgClases.find({},{
            limit:limit || 5,
            sort:{timestamp:-1} 
        });
    })