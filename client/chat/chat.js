import { msg } from '../../imports/database/models.js';
import { fls } from '../../imports/database/models.js';

if(Meteor.isClient){
    Meteor.subscribe('messages',5)
    Meteor.subscribe('files')
    Template.chat.helpers({

        messages:function(){
            return msg.find({},{
                sort:{timestamp:1}
            });
        }
    })

    Template.chat.events({
        'submit .chat-form':function(evt){
            evt.preventDefault();
            var text = evt.target.message.value;
            Meteor.call("insertMessage",text,function(err, res) {
                if (err) {
                    console.log('Error: ' + err);
                }
                if (!err) {
                    console.log('Message insertd');
                }
            });
        }
    })

}


