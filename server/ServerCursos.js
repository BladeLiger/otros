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
    },

    materialesCurso: function(sigla){
        var query = [
            {
                $project: {
                    nombre: 1,
                    sigla: 1,
                    archivos:1,
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
                    archivos: { $min: { $size: "$archivos" } }
                }
            },
            {
                $sort: {
                    fecha:1
                }
            }
        ]
        return crs.aggregate(query);
    },

    materialesXcurso: function(sigla){
        /*var current = crs.findOne({sigla: sigla});
        var query = [
            {
                $project: {
                    nombre: 1,
                    sigla: 1,
                    archivos:1,
                    createdAt: 1,
                }
            }, 
            {   
                $match:{_id :current._id}
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
                    material:{
                        $last:"$archivos"
                    },
                    archivos: { $min: { $size: "$archivos" } }
                }
            },
            {
                $sort: {
                    fecha:1
                }
            }
        ]
        return crs.aggregate(query);*/

        var query = [
            {
                $project: {
                    nombreMaterial: 1,
                    siglaMaterial: 1,
                    descripcionMaterial:1,
                    data: 1,
                }
            }, 
            {   
                $match:{siglaMaterial :sigla}
            },
            {
                $group: {
                    _id: "$_id",
                    nombre: {
                        $last: "$nombreMaterial",
                    },
                    descripcion: {
                        $last: "$descripcionMaterial"
                    },
                    sigla: {
                        $last: "$siglaMaterial"
                    },
                    material:{
                        $last:"$data"
                    }
                }
            },
            {
                $sort: {
                    sigla:1
                }
            }
        ]
        return ars.aggregate(query);

    },
    GetDecodeArchivos:function(sigla){
        //return archivo
        //base64data = new Buffer(data).toString('base64');
       // var base64 = bufferToBase64(data)
       // return base64data;
       var archivo = []
       var query = [
            {
                $project: {
                    nombreMaterial: 1,
                    siglaMaterial: 1,
                    descripcionMaterial:1,
                    data: 1,
                }
            }, 
            {   
                $match:{siglaMaterial :sigla}
            },
            {
                $group: {
                    _id: "$_id",
                    nombre: {
                        $last: "$nombreMaterial",
                    },
                    descripcion: {
                        $last: "$descripcionMaterial"
                    },
                    sigla: {
                        $last: "$siglaMaterial"
                    },
                    material:{
                        $last:"$data"
                    }
                }
            },
            {
                $sort: {
                    sigla:1
                }
            }
        ]
        M =  ars.aggregate(query);
        for(var i = 0; i<M.length;i++ ){
            archivo.push(new Buffer(M[i]['material']['buffer']).toString('base64'))
        }
        return archivo
    }
});

Meteor.publish('crs', function() {
  return crs.find();
});
