
import { Template } from 'meteor/templating';
import { crs } from '../database/models.js';
import {ars} from '../database/models.js';
import {fls} from '../database/models.js';
import '../templates/cursos.html';



if (Meteor.isClient) {
    Meteor.subscribe('files')
    Meteor.subscribe('archivos')
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
                console.log(file)
                var reader = new FileReader(); //create a reader according to HTML5 File API
                reader.onload = function(event){  
                var buffer = new Uint8Array(reader.result) // convert to binary
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
    
   
        'change .file-upload-input': function(event, template) {
            var appId = FlowRouter.getParam("sigla");
            var files = event.target.files;
            console.log("entro")
            console.log(files)
            for (var i = 0, ln = files.length; i < ln; i++) {
            var fileObj = fls.insert(files[i]);
            /*fls.insert(files[i], function (err, fileObj) {
               // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
               console.log(files[i])
               console.log(fileObj)
                });*/
            ars.insert({
                name: appId,
                file:fileObj,
            });
            
            }
        }

    })

    Template.ver_curso.onCreated(function () {
        var appId = FlowRouter.getParam("sigla");
        Meteor.call("GetDecodeArchivos",appId, function(err, res) {
                if (err) {
                    console.log('Error: ' + err);
                }
                if (!err) {
                    Session.set('GetDecodeArchivos', res);
                }
        });
    });

    

    Template.ver_curso.helpers({
        VerMaterialCurso: () => {
            console.log(Session.get('GetDecodeArchivos'))
            return Session.get('GetDecodeArchivos');
        },
        filesCurso:()=>{
            var appId = FlowRouter.getParam("sigla");
            var FilesRecord = [];
            var files =  ars.find({name:appId},{
                sort:{_id:1}
            });
            files = files.fetch()
            console.log(files) 
            console.log(files[0])
            for(var i=0; i< files.length; i++){
                FilesRecord.push(files[i].file.getFileRecord())
            }
           // var files = ars.findOne({name:"curso-1"})
            //files = files.fetch()
            console.log(FilesRecord)
            return FilesRecord;
            //return files.file.getFileRecord()
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
            console.log("archivoCurso")
        }
    })
}