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
        vm.updateTask = updateTask;
        vm.deleteTask = deleteTask;
        vm.getTasks = getTasks;

        vm.storeCategory = storeCategory;
        vm.updateCategory = updateCategory;
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
            alasql('CREATE localStorage DATABASE IF NOT EXISTS dbproject12');
            alasql('ATTACH localStorage DATABASE dbproject12');
            alasql('USE dbproject12');

            alasql('CREATE TABLE IF NOT EXISTS ' + tasks + ' (id INTEGER PRIMARY KEY, title STRING, description STRING, category STRING, done BOOLEAN, priority INT, tags json, estimated INT, date DATE)');
            alasql('CREATE TABLE IF NOT EXISTS ' + categories + ' (id INTEGER PRIMARY KEY, category STRING)');
            var cat = alasql('SELECT * FROM '+categories);
            if (cat == null || cat.length == 0)
                alasql('INSERT INTO ' +categories+ ' VALUES (0, "Default")');
            alasql('CREATE TABLE IF NOT EXISTS ' + notes + ' (id INTEGER PRIMARY KEY, title STRING, description STRING)');
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

        function updateTask(item)
        {
            alasql('UPDATE ' +tasks+ ' SET title=? , description=? , category=? , done=? , priority=? , tags=? , estimated=? , date=? WHERE id=?',[item.title, item.description, item.category,
            item.done, item.priority, item.tags, item.estimated, item.date, item.id]);
            console.log("tasks after update: "+angular.toJson(alasql('SELECT * FROM '+tasks)));
        }

        function deleteTask(item)
        {
            alasql('DELETE FROM ' + tasks + ' WHERE id=?',[item.id]);
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
            alasql('INSERT INTO ' +categories+ ' VALUES (?,?)',[item.id,item.category]);
            console.log("Categories after store: "+angular.toJson(alasql('SELECT * FROM '+categories)));
        }

        function updateCategory(item)
        {
            alasql('UPDATE ' +categories+ ' SET category=? WHERE id=?',[item.category, item.id]);
            console.log("tasks after update: "+angular.toJson(alasql('SELECT * FROM '+categories)));
        }


        function deleteCategory(item)
        {
            alasql('DELETE FROM ' + categories + ' WHERE id=?', [item.id]);
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
            alasql('DELETE FROM ' + notes + ' WHERE id=?', [item.id]);
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