var postSignUp = function(userId,info){
    //Roles.addUsersToRoles(userId, ['corredor','pateador','golpeador'], 'real-madrid.com')
    Roles.addUsersToRoles(userId,['normal-user',info.profile.profession])
}

AccountsTemplates.configure({
    postSignUpHook:postSignUp,
   //forbidClientAccountCreation: true,
});

/*Meteor.publish('usuario',function(){
    var user = Meteor.users.findOne(this.userId)
    return user
})*/