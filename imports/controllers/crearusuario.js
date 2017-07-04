import { Template } from 'meteor/templating';
import { Index, MinimongoEngine } from 'meteor/easy:search'
import '../templates/crearusuario.html';
import {ars} from '../database/models.js';

Template.CrearUsuarios.events({

    'submit form': function(event,template) {
        event.preventDefault();

        const target = event.target;

        const carrera = target.carrera.value;
        const username = target.username.value;
        const apellidoP = target.apellidoP.value;
        const apellidoM = target.apellidoM.value;
        const nombres = target.nombres.value;
        const cel = target.cel.value;
        const direccion = target.direccion.value;

        const password = target.password.value;
        const email = target.email.value;

        const roles = template.findAll( "input[type=checkbox]:checked");
        const estado = 'activo';

        var arrayRoles = _.map(roles, function(item) {
            return item.defaultValue;
        });

        var profile = {
            Carrera :carrera,
            Username:username,
            ApellidoP:apellidoP,
            ApellidoM:apellidoM,
            Nombres:nombres,
            Celular:cel,
            Direccion:direccion,
            estado:estado
        }
         
        Meteor.call('crearUsuario', email,password,profile,arrayRoles)
        template.find("form").reset();
        event.preventDefault();
        return false;
    }
});



Template['Override-EasySearch.Pagination'].replaces('EasySearch.Pagination');

Template.full_usuarios.helpers({
    playesrsIndex: () => PlayersIndex,
    usuarios:()=>{
        console.log(Meteor.users.find({}).fetch()) 
    },
    //////////////
    inputAttributes: function(){
        //console.log('atributes')
        return {'class':'form-control','placeholder':'Buscar usuario'}  
    },
    /*players: function(){
        console.log('players')
        console.log(Meteor.users.find({},{sort:{createdAt:-1}}))
        return Meteor.users.find({},{sort:{createdAt:-1}})
    },
    selectdName:function(){
        var joke = UserIndex.config.mongoCollection.findOne({__originalId:Session.get("selectedUsuario")})
        console.log('joke')
        console.log(joke)
        return joke && joke.emails;
    },*/
    index:function(){
        // console.log('index')
        return UserIndex;
    },
    resultsCount:function(){
       // console.log('resultscount')
       // console.log(UserIndex.getComponentDict().get('count') ) 
        return UserIndex.getComponentDict().get('count');
    },
    /*showMore:function(){
        console.log('showmore')
       return false;
    },*/
    renderTmpl:()=>template.renderTemplate
});

Template.User.helpers({
    selected:function(){
       // console.log(Session.equals("selectedUsuario",this.__originalId)? "selected":'')
        return Session.equals("selectedUsuario",this.__originalId)? "selected":'';
    }
})

Template.User.events({
    'click .usuario':function(e){
        id = "#"+$(e.currentTarget).attr("axis");
        if($(id).hasClass("out")) {
            $(id).addClass("in");
            $(id).removeClass("out");
        } else {
            $(id).addClass("out");
            $(id).removeClass("in");
        }
        Session.set("selectedUsuario",this.__originalId);
    },
    'click .editUser' : function(){
        console.log("entro");
        //var id = toString(this.__originalId)
       // console.log(this.__originalId)
        //console.log(Meteor.users.find({_id:id}).fetch())
       // console.log(Meteor.users.find({_id:'uujn7LDhukt8rEEQP'}).fetch())

        Meteor.call("existeUsuario",this.__originalId, function(err, res) {
        if (err) {
            console.log('Error: ' + err);
        }
        if (!err) {
            Session.set('usuario', res);
        }
        console.log(Session.get('usuario'))
        FlowRouter.subsReady("chat", function() {
         console.log("entra aqui")
        });

    });
    }
})