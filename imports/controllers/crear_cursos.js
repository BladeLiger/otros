import { Template } from 'meteor/templating';
import { crs } from '../database/models.js';
import '../../imports/templates/crear_cursos.html';

if (Meteor.isClient) {
Template.crearCursos.events({
  'submit form'(event) {
    // Get value from form element
    const target = event.target;
    const nombre = target.nombrecurso.value;
    const sigla = target.sigla.value;
    const descripcion = target.descripcion.value;
    
    const material = false;
    const archivos = [];

    console.log(nombre);
    // Insert a task into the collection
    crs.insert({
        nombre,
        sigla,
        descripcion,
        material,
        archivos,
        createdAt: new Date(), // current time
    });
 
    // Clear form
    target.nombrecurso.value = '';
    target.sigla.value='';
    target.descripcion.value='';
    
    event.preventDefault();
    return false;
  },
});
}