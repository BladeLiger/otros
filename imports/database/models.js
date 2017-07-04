import { Mongo } from 'meteor/mongo';
import { Index, MinimongoEngine } from 'meteor/easy:search'
export const crs = new Mongo.Collection('cursos');
export const ars = new Mongo.Collection('archivos');
export const msg = new Mongo.Collection('messages')

/*export const fls = new FS.Collection("files", {
                stores: [new FS.Store.FileSystem("files", {path: "public/images  "})]
            });*/
            
export const fls  = new FS.Collection("files", {
    stores: [
        //new FS.Store.FileSystem("original", { path: "../../../../../public/files" }),
        //new FS.Store.FileSystem("thumb", { path: "../../../../../public/files" })
        new FS.Store.FileSystem("original", { path: "../../../public/files" }),
        new FS.Store.FileSystem("thumb", { path: "../../../public/files" })
    ],
    /*filter: {
        maxSize: 1000000, //1Mo
        allow: { contentTypes: ['image/*'] }
    },*/
    onInvalid: function (message) {
        //throw new Meteor.Error(403, message);
    }
});

UserIndex = new EasySearch.Index({
    engine:new EasySearch.MongoDB({
        sort:function(){
            return {createdAt:1}
        },
        selector:function(searchObject,options,aggregation){
            let selector = this.defaultConfiguration().selector(searchObject,options,aggregation),
            categoryFilter = options.search.props.categoryFilter;

            //if(_isString(categoryFilter) && !_.isEmpty(categoryFilter)){
                selector.category = categoryFilter;
            //}
            return selector
            
        }
    }),
    collection:Meteor.users,//Meteor.users,
    fields:['profile.Username','profile.ApellidoP','profile.ApellidoM','profile.Nombres'],
    defaultSearchOptions:{
        limit:8 
    },
    permission:()=>{
        return true
    }
});

//console.log(JokesIndex)
