(function() {
    'use strict';

    angular
        .module('todoApp')
        .service('storageService', storageService);

    storageService.$inject = ['$window'];
    
    function storageService($window) {
        
        var vm = this;
        vm.set = set;
        vm.get = get;
        vm.initDB = initDB;
        
        vm.storeTask = storeTask;
        vm.deleteTask = deleteTask;
        vm.getTasks = getTasks;

        vm.storeCategory = storeCategory;
        vm.deleteCategory = deleteCategory;
        vm.getCategories = getCategories;

        vm.storeNote = storeNote;
        vm.deleteNote = deleteNote;
        vm.getNotes = getNotes;

        var tasks = "tasks";
        var notes = "notes";
        var categories = "categories";

        initDB();

        function initDB()
        {
            console.log("Initializing DB");
            alasql('CREATE localStorage DATABASE IF NOT EXISTS dbproject');
            alasql('ATTACH localStorage DATABASE dbproject');
            alasql('USE dbproject');

            alasql('CREATE TABLE IF NOT EXISTS ' + tasks + ' (title STRING, description STRING, category STRING, done BOOLEAN, priority INT, tags json, estimated INT, date date)');
            alasql('CREATE TABLE IF NOT EXISTS ' + categories + ' (name STRING)');
            alasql('CREATE TABLE IF NOT EXISTS ' + notes + ' (title STRING, description STRING)');
        }


        function getTasks() {
            var elem = alasql('SELECT * FROM '+tasks);
            if (elem != null){
                return elem;
            }
            return null;
        }

        function storeTask(item)
        {
            alasql('INSERT INTO ' +tasks+ ' VALUES ?',[item]);
            console.log("tasks after store: "+angular.toJson(alasql('SELECT * FROM '+tasks)));
        }

        function deleteTask(item)
        {
            alasql('DELETE FROM ' + tasks + ' WHERE title=?',[item.title]);
            console.log("tasks after drop: "+angular.toJson(alasql('SELECT * FROM ' + tasks)));
        }
        
        function getCategories() {
            var elem = alasql('SELECT * FROM '+categories);
            if (elem != null){
                return elem;
            }
            return null;
        }

        function storeCategory(item)
        {
            alasql('INSERT INTO ' +categories+ ' VALUES ?',[item]);
            console.log("Categories after store: "+angular.toJson(alasql('SELECT * FROM '+categories)));
        }

        function deleteCategory(item)
        {
            alasql('DELETE FROM ' + categories + ' WHERE name=?', [item.name]);
            console.log("Categories after drop: "+angular.toJson(alasql('SELECT * FROM ' + categories)));
        }


        function getNotes() {
            var elem = alasql('SELECT * FROM '+notes);
            if (elem != null){
                return elem;
            }
            return null;
        }

        function storeNote(item)
        {
            alasql('INSERT INTO ' +notes+ ' VALUES ?',[item]);
            console.log("Notes after store: "+angular.toJson(alasql('SELECT * FROM '+notes)));
        }

        function deleteNote(item)
        {
            alasql('DELETE FROM ' + notes + ' WHERE title=?', [item.title]);
            console.log("Notes after drop: "+angular.toJson(alasql('SELECT * FROM ' + notes)));
        }

        //Loads value from the session storage
        function get() {
            var json = $window.localStorage.getItem("taskStorage");
            if (json != null) {
                return angular.fromJson(json);
            }
            return null;
        }

        //Saves the value to the session storage
        function set(value) {
            console.log("ServiceStorage : set " + value);
            $window.localStorage.setItem("taskStorage", angular.toJson(value));
            console.log("ServiceStorage : salvataggio effettuato");
        }
        
    }
})();