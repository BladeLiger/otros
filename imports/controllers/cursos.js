
import { Template } from 'meteor/templating';
import { crs } from '../database/models.js';
import { crsMaster } from '../database/models.js';
import {ars} from '../database/models.js';
import {fls} from '../database/models.js';
import {msgClases} from '../../imports/database/models.js';
import '../templates/cursos.html';



if (Meteor.isClient) {
    Meteor.subscribe('files')
    Meteor.subscribe('archivos')
    Meteor.subscribe('crs');
    Meteor.subscribe('cursosMaster')
    Meteor.subscribe('messagesClases',5)


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

    //todos los cursos que que haya creado el usuario admin facilitador
    Template.cursosDBMaster.helpers({
        FullcursosUser: () =>{
            var iduser = Meteor.user()._id;
            //console.log(crsMaster.find({iduser:iduser}).fetch())
            return crsMaster.find({iduser:iduser}).fetch()
        }
    })
    //todos los cursos para todos los usuarios
    Template.FullCursosFull.helpers({
        FullcursosFull: () =>{
            //console.log(crsMaster.find({iduser:iduser}).fetch())
            return crsMaster.find({}).fetch()
        }
    })
    //
    //Template.ver_curso.helpers({
    Template.ver_cursoMaster.helpers({
        Vercurso: () => {
            var appId = FlowRouter.getParam("sigla");
            var iduser = Meteor.user()._id
            var curso = crsMaster.findOne({
                sigla: appId,
                iduser:iduser
            });
            //console.log(curso)
            return curso;
        }
    });

    Template.ver_curso_clase_archivos.helpers({
        Verclase: () => {
            var appId = FlowRouter.getParam("identi");
            var clase = crs.findOne({
                _id: appId,
            });
            //console.log(curso)
            return clase;
        },
        VideoClase:()=>{
            var appId = FlowRouter.getParam("identi");
            var FilesRecord = [];
            var files =  crs.find({_id:appId},{
                sort:{_id:1}
            });
            files = files.fetch()
            //console.log(files) 
            //console.log(files[0])
            for(var i=0; i< files.length; i++){
                FilesRecord.push(files[i].file.getFileRecord())
            }
            // var files = ars.findOne({name:"curso-1"})
            //files = files.fetch()
            console.log(FilesRecord)
            return FilesRecord;
            //return files.file.getFileRecord()
        },
        filesClase:()=>{
            var appId = FlowRouter.getParam("identi");
            var FilesRecord = [];
            var files =  ars.find({idclase:appId},{
                sort:{_id:1}
            });
            files = files.fetch()
            //console.log(files) 
            //console.log(files[0])
            for(var i=0; i< files.length; i++){
                FilesRecord.push(files[i].file.getFileRecord())
            }
           // var files = ars.findOne({name:"curso-1"})
            //files = files.fetch()
            console.log(FilesRecord)
            console.log(ars.find({}).fetch())
            return FilesRecord;
            //return files.file.getFileRecord()
        },

    });

    Template.ver_curso_clase_archivos.events({
        'submit #formArchivos': function(event,template) { // also tried just 'submit', both work for me!
            console.log('Submitting form!');

            const target = event.target;
            const nombre = target.nombreArchivo.value;
            const descripcion = target.descripcionArchivo.value;
            const archivo = target.archivo.files;
            
            const id = target.rca.value;
            const typeFile = "otro"
            
            //console.log(nombre)
            var files = archivo;
            //console.log("entro")
            //console.log(files)
            
            for (var i = 0, ln = files.length; i < ln; i++) {
                var fileObj = fls.insert(files[i]); 
                //fls.insert(files[i], function (err, fileObj) {
                // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
                //console.log(files[i])
                //console.log(fileObj)
                // });
                ars.insert({
                    nombreArchivo:nombre,
                    descripcionArchivo:descripcion,
                    
                    idclase:id,
                    type:typeFile,
                    
                    file:fileObj,
                    createdAt:new Date()
                });
            
            }

            /*if (!video) return;
            for(var i=0; i<video.length  ;i++){
                file = video[i]
                console.log(file)
                var reader = new FileReader(); //create a reader according to HTML5 File API
                reader.onload = function(event){  
                var buffer = new Uint8Array(reader.result) // convert to binary
                Meteor.call('saveFile', buffer,nombre,descripcion,sigla);
                }
                reader.readAsArrayBuffer(file); //read the file as arraybuffer
            }*/
            console.log("guardado")
            $('#myModal').hide()
            template.find("form").reset();
            event.preventDefault();
            event.stopPropagation();
            return false;
        },
    })

    Template.chatclaseCurso.helpers({
        Verclase: () => {
            var appId = FlowRouter.getParam("identi");
            var clase = crs.findOne({
                _id: appId,
            });
            //console.log(curso)
            return clase;
        }, 
        messagesClases:function(){
            console.log("entro")
            var appId = FlowRouter.getParam("identi");
            return msgClases.find({classID:appId},{ 
                sort:{timestamp:1}
            });
        }
    })
    Template.chatclaseCurso.events({
        'submit .chat-form':function(evt){ 
            evt.preventDefault();
            var text = evt.target.message.value;
            var rca = evt.target.rca.value;
            console.log(text)
            Meteor.call("insertMessageClases",text,rca,function(err, res) {
                if (err) {
                    console.log('Error: ' + err);
                }
                if (!err) {
                    console.log('Message insertd');
                }
            });
            
            evt.target.message.value=""
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
    })
    //Template.ver_curso.events({
    Template.ver_cursoMaster.events({
        'click .crear' (event) {
            console.log("sss")
        },
        'submit form': function(event,template) { // also tried just 'submit', both work for me!
            console.log('Submitting form!');

            const target = event.target;
            const nombre = target.nombreMaterial.value;
            const descripcion = target.descripcionMaterial.value;
            const video = target.videoMaterial.files;
            const sigla = target.sigla.value;
            const id = target.rca.value;
            const typeFile = "video"
            const identificador = sigla+""+id
            //console.log(nombre)
            var files = video;
            //console.log("entro")
            //console.log(files)
            
            for (var i = 0, ln = files.length; i < ln; i++) {
                var fileObj = fls.insert(files[i]); 
                //fls.insert(files[i], function (err, fileObj) {
                // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
                //console.log(files[i])
                //console.log(fileObj)
                // });
                crs.insert({
                    nombreClase:nombre,
                    descripcionClase:descripcion,
                    sigla: sigla,
                    idcurso:id,
                    type:typeFile,
                    identi:identificador,
                    file:fileObj,
                    createdAt:new Date()
                });
            
            }

            /*if (!video) return;
            for(var i=0; i<video.length  ;i++){
                file = video[i]
                console.log(file)
                var reader = new FileReader(); //create a reader according to HTML5 File API
                reader.onload = function(event){  
                var buffer = new Uint8Array(reader.result) // convert to binary
                Meteor.call('saveFile', buffer,nombre,descripcion,sigla);
                }
                reader.readAsArrayBuffer(file); //read the file as arraybuffer
            }*/
            console.log("guardado")
            $('#myModal').hide()
            template.find("form").reset();  
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
    
   
        /*'change .file-upload-input': function(event, template) {
            var appId = FlowRouter.getParam("sigla");
            var files = event.target.files;
            console.log("entro")
            console.log(files)
            for (var i = 0, ln = files.length; i < ln; i++) {
            var fileObj = fls.insert(files[i]);
            //fls.insert(files[i], function (err, fileObj) {
               // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
               //console.log(files[i])
               //console.log(fileObj)
               // });
            ars.insert({
                name: appId,
                file:fileObj,
            });
            
            }
        }*/

    })
    //Template.ver_curso.onCreated(function () {
    Template.ver_cursoMaster.onCreated(function () {
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

    
    //Template.ver_curso.helpers({
    Template.ver_cursoMaster.helpers({
        VerMaterialCurso: () => {
            console.log(Session.get('GetDecodeArchivos'))
            return Session.get('GetDecodeArchivos');
        },
        /*filesCurso:()=>{
            var appId = FlowRouter.getParam("sigla");
            var FilesRecord = [];
            var files =  ars.find({name:appId},{
                sort:{_id:1}
            });
            files = files.fetch()
            //console.log(files) 
            //console.log(files[0])
            for(var i=0; i< files.length; i++){
                FilesRecord.push(files[i].file.getFileRecord())
            }
           // var files = ars.findOne({name:"curso-1"})
            //files = files.fetch()
            console.log(FilesRecord)
            console.log(ars.find({}).fetch())
            return FilesRecord;
            //return files.file.getFileRecord()
        },*/
        allClases:()=>{
            var appId = FlowRouter.getParam("sigla");
            //console.log(crs.find({}).fetch())
            return crs.find({sigla:appId}).fetch()
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