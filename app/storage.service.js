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
        vm.updateNote = updateNote;

        var tasks = "tasks";
        var notes = "notes";
        var categories = "categories";

        initDB();

        function initDB()
        {
            alasql('CREATE localStorage DATABASE IF NOT EXISTS disnote');
            alasql('ATTACH localStorage DATABASE disnote');
            alasql('USE disnote');

            alasql('CREATE TABLE IF NOT EXISTS ' + tasks + ' (id INTEGER PRIMARY KEY, title STRING, description STRING, category STRING, done BOOLEAN, priority INT, tags json, estimated INT, date DATE)');
            alasql('CREATE TABLE IF NOT EXISTS ' + categories + ' (id INTEGER PRIMARY KEY, category STRING)');
            var cat = alasql('SELECT * FROM '+categories);
            if (cat == null || cat.length == 0)
                alasql('INSERT INTO ' +categories+ ' VALUES (0, "Default")');
            alasql('CREATE TABLE IF NOT EXISTS ' + notes + ' (id INTEGER PRIMARY KEY, title STRING, description STRING, color STRING, tags json, date DATE)');
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
        }

        function updateTask(item)
        {
            alasql('UPDATE ' +tasks+ ' SET title=? , description=? , category=? , done=? , priority=? , tags=? , estimated=? , date=? WHERE id=?',[item.title, item.description, item.category,
            item.done, item.priority, item.tags, item.estimated, item.date, item.id]);
        }

        function deleteTask(item)
        {
            alasql('DELETE FROM ' + tasks + ' WHERE id=?',[item.id]);
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
        }

        function updateCategory(item)
        {
            alasql('UPDATE ' +categories+ ' SET category=? WHERE id=?',[item.category, item.id]);
        }


        function deleteCategory(item)
        {
            alasql('DELETE FROM ' + categories + ' WHERE id=?', [item.id]);
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
        }

        function deleteNote(item)
        {
            alasql('DELETE FROM ' + notes + ' WHERE id=?', [item.id]);
        }

        function updateNote(item)
        {
            alasql('UPDATE ' +notes+ ' SET title=?, description=? , color=? , tags=? , date=? WHERE id=?',[item.title, item.description, item.color,
            item.tags, item.date, item.id]);
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
            $window.localStorage.setItem("taskStorage", angular.toJson(value));
        }
        
    }
})();