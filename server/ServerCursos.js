import { Meteor } from 'meteor/meteor';
import '../imports/database/models.js';
import {crs} from '../imports/database/models.js';
import {ars} from '../imports/database/models.js';

Meteor.methods({
  fullcursos:function(){
        var res = [{
                $project: {
                    nombre: 1,
                    curso: 1,
                    sigla: 1,
                    createdAt: 1,
                }
            }, 
            {
                $group: {
                    _id: "$nombre",
                    nombre: {
                        $last: "$nombre",
                    },
                    fecha: {
                        $last: "$createdAt"
                    },
                    sigla: {
                        $last: "$sigla"
                    },
                }
            },
            {
                $sort: {
                    fecha:1
                }
            }
        ]
        return crs.aggregate(res);
  },
  /*file_upload: function (fileInfo, fileData) {
      console.log("received file " + fileInfo.name + " data: " + fileData);
        FS.Utility.eachFile(event, function(fileData) {
            ars.insert(file, function (err, fileObj) {
                
            });
        });   
  }  */
    saveFile: function(buffer,nombre,descripcion,CursoSigla){
        ars.insert({
            siglaMaterial:CursoSigla,
            nombreMaterial:nombre,
            descripcionMaterial:descripcion,
            data:buffer
        })

        var current = crs.findOne({sigla: CursoSigla});

        var index = current._id;
        console.log(nombre)
        console.log(descripcion)

        console.log(CursoSigla)
        //console.log(ars.update({_ID :"CursoSigla"},{$set:{material : "true"}})) 
        //crs.update({_id :current._id}, {$set: { material: true }});

        crs.update({_id :current._id},{$push:{archivos:{nombreMaterial:nombre,descripcionMaterial:descripcion,data:buffer}}}, function(error, affectedDocs) {
            if (error) {
                console.log(new Meteor.Error(500, error.message));
            } else {
                console.log( "Update Successful");
            }
        });
    }  
});

Meteor.publish('crs', function() {
  return crs.find();
});