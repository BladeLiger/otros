import { Index, MinimongoEngine } from 'meteor/easy:search'
import { Meteor } from 'meteor/meteor';
import '../imports/database/models.js';
import {ars} from '../imports/database/models.js';

var postSignUp = function(userId,info){
    //Roles.addUsersToRoles(userId, ['corredor','pateador','golpeador'], 'real-madrid.com')
    Roles.addUsersToRoles(userId,'admin')
}

AccountsTemplates.configure({
    postSignUpHook:postSignUp,
   //forbidClientAccountCreation: true,
});

Meteor.methods({
    crearUsuario : function(email,password,profile,arrayRoles){
    
        var id;

        id = Accounts.createUser({
            email: email,
            password: password,
            profile: profile,
        });

        console.log(id)

        if (arrayRoles.length > 0) {
            // Need _id of existing user record so this call must come
            // after `Accounts.createUser` or `Accounts.onCreate`
            Roles.addUsersToRoles(id, arrayRoles);
        }

        console.log("creado correctamente")
    },

    existeUsuario : function(id){
        //return !!Meteor.users.findOne({_id: id});// return true or false
         return Meteor.users.findOne({_id: id});
    }
})


/*Meteor.publish('usuario',function(){
    var user = Meteor.users.findOne(this.userId)
    return user
})*/