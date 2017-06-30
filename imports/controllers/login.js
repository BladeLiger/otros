import { Template } from 'meteor/templating';
import '../../imports/templates/main_home.html';
//var myLogoutFunc = function(){
//    FlowRouter.go('/main')
//}
Meteor.subscribe('usuario')

/*Template.main_principal.helpers({

    username: function() {
        var u = Meteor.user().profile.Username;
        //var user = Meteor.users.findOne()
        //console.log(u)
        return
        //return Meteor.user().profile.first_name;
    }
});*/

Template.user.helpers({
  firstName: function() {
    return Meteor.user().profile.Username;
  }
});

Template.main_principal.events({
    'click .logout': function(event){
        event.preventDefault();
        console.log("entro")
        Meteor.logout();
    }
});


Template['override-atPwdFormBtn'].replaces('atPwdFormBtn');
Template['override-atTitle'].replaces('atTitle');
Template['override-atTextInput'].replaces('atTextInput');
//Template['override-atSignupLink'].replaces('atSignupLink');


AccountsTemplates.configure({
    confirmPassword:true,
    //privacyUrl: 'privacy',
   // termsUrl: 'terms-of-use',
 //   onLogoutHook:myLogoutFunc,
});



AccountsTemplates.addFields([
    {
    _id:'Carrera',
    type:'text',
    displayName:'Carrera',
    required: true,
    },{
    _id:'Username',
    type:'text',
    displayName:'username',
    required: true,
    },{
    _id:'Apellidos',
    type:'text',
    displayName:'apellidos',
    required: true,
    },
    {
    _id:'Nombres',
    type:'text',
    displayName:'Nombres',
    required: true,
    },
    {
        _id:'profession',
        type:'select',
        display:'Profession',
        class:'form-control',
        select:[
            {
                text:'Administrador',
                value:'admin',
            },
            {
                text:'Facilitador',
                value:'facilitador',
            },
            {
                text:'Estudiante',
                value:'estudiante',
            },
        ]
    }
]);

/*Accounts.ui.config({
    passwordSignupFields:'USERNAME_AND_EMAIL'
})*/