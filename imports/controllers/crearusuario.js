import { Template } from 'meteor/templating';
import '../templates/crearusuario.html';

    Template.CrearUsuarios.events({
    
    'submit form': function(event) {
        event.preventDefault();
        var newUserData = {
          
          profile: {
            nombres: $('[id="nombres"]').val(),
            //apellidoP: $('[id="apellidoP"]').val(),
            //apellidoM: $('[id="apellidoM"]').val(),
            //cel: $('[id="cel"]').val(),
            //direccion: $('[id="direccion"]').val(),
           // username: $('[id="username"]').val(),
           // carrera: $('[id="carrera"]').val(),
          },
          email: $('[id="email"]').val(),
          password: $('[id="password"]').val(),
          
          rol:['admin']
        };
        
        Meteor.call('insertUser', newUserData);
        //Meteor.loginWithPassword(newUserData.email, newUserData.password);
    }
    });
