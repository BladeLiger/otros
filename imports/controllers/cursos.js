
import { Template } from 'meteor/templating';
import { crs } from '../database/models.js';
import {ars} from '../database/models.js';
import '../templates/cursos.html';



if (Meteor.isClient) {

    Meteor.call("fullcursos", function(err, res) {
        if (err) {
            console.log('Error: ' + err);
        }
        if (!err) {
            Session.set('cursos', res);
        }
    });


    Template.cursosDB.helpers({
        Fullcursos: () => {
            return Session.get('cursos');
        },
    });

    Template.ver_curso.helpers({
        Vercurso: () => {
            var appId = FlowRouter.getParam("sigla");
            Meteor.subscribe('crs');
            var curso = crs.findOne({
                sigla: appId
            });
            return curso;
        }
    });

    Template.ver_curso.events({
        'click .crear' (event) {
            console.log("sss")
        },
        'submit form': function(event,template) { // also tried just 'submit', both work for me!
            console.log('Submitting form!');

            const target = event.target;
            const nombre = target.nombreMaterial.value;
            const descripcion = target.descripcionMaterial.value;
            const archivos = target.archivosMaterial.files;
            const sigla = target.sigla.value;

            console.log("entro")
            console.log(nombre)
            console.log(archivos[0])
            console.log(archivos.length )

            if (!archivos) return;
            for(var i=0; i<archivos.length  ;i++){
                file = archivos[i]
                var reader = new FileReader(); //create a reader according to HTML5 File API
                reader.onload = function(event){  
                           
                var buffer = new Uint8Array(reader.result) // convert to binary
                console.log(buffer) 
                Meteor.call('saveFile', buffer,nombre,descripcion,sigla);
                }
                reader.readAsArrayBuffer(file); //read the file as arraybuffer
            }
            console.log("guardado")
            event.preventDefault();
            event.stopPropagation();
            return false;
        },

        /*'change input': function(event, template) {
     
        var file = event.target.files[0]; //assuming 1 file only
        console.log(file) 
        if (!file) return;

        var reader = new FileReader(); //create a reader according to HTML5 File API

        reader.onload = function(event){          
        var buffer = new Uint8Array(reader.result) // convert to binary
        Meteor.call('saveFile', buffer);
        }

        reader.readAsArrayBuffer(file); //read the file as arraybuffer
        }*/

    })

    Template.ver_curso.helpers({
        VerMaterialCurso: () => {
            var appId = FlowRouter.getParam("sigla");
            Meteor.call("materialesXcurso",appId,{}, function(err, res) {
                if (err) {
                    console.log('Error: ' + err);
                }
                if (!err) {
                    Session.set('materialesXcurso', res);
                }
            });
            console.log(Session.get('materialesXcurso'))
            return Session.get('materialesXcurso');

        },
        ExisteMaterial:(archivos) =>{
            console.log(archivos)
            if(archivos > 0){
                return true;
            }else{
                return false
            }
        },
        archivoCurso: (data) => { 
            archivo = data.buffer;
            
            var r = new TextDecoder("utf-8").decode(data.buffer); 

            //var r = new Uint8Array(atob(archivo).split("").map(function(c) {
          //  return c.charCodeAt(0); }));
            //var base64 = bufferToBase64(data.buffer)
            //var base64data = new buffer(data.buffer).toString('base64');
            
            /*Meteor.call("DecodeArchivos",data.buffer, function(err, res) {
                if (err) {
                    console.log('Error: ' + err);
                }
                if (!err) {
                    
                    Session.set('DecodeArchivos', res);
                    
                }
            });
            console.log(Session.get('DecodeArchivos'))*/
           //console.log(r)
           //return r
            //return Session.get('DecodeArchivos'); 

        }
    })

    Template.ver_material_curso.helpers({
        VerMaterialCurso: () => {
            var appId = FlowRouter.getParam("sigla");
            Meteor.call("materialesXcurso",appId,{}, function(err, res) {
                if (err) {
                    console.log('Error: ' + err);
                }
                if (!err) {
                    Session.set('MaterialesXcursos', res);
                }
            });
            console.log(Session.get('MaterialesXcursos'))
            return Session.get('MaterialesXcursos');

        }
    })
}