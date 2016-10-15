(function(angular) {

    'use strict';
    //var module = angular.module('todoApp', ['ngMaterial']);

    angular.module('todoApp').controller('TodoController', TodoController);

TodoController.$inject = ['storageService','$mdDialog','taskService'];
    //This is the application controller
    function TodoController(storageService, $mdDialog, taskService ) {
        var vm = this;

        vm.selectedItem = null;
        vm.items = storageService.get() || [];
        vm.notDone = notDone;
        vm.done = done;
        vm.all = all;
        vm.deleteItem = deleteItem;
        vm.createItem = createItem;
        vm.addTask = addTask;
        vm.search = false; //booleano per "barra Search"
        vm.toggleSearch = toggleSearch; // funzione per Show/hide barra search
        // variabile per view in formato lista o grid
        vm.view = 'list';
        vm.setView = setView;
        vm.addTaskForm = addTaskForm;
       
        // lista tabs(categorie)
        
        vm.selectedCategory=null;
        vm.listaCategorie=[
                         "Sport", 
                         "Teatro",
                         "Studio",
        ]
       
       

        function notDone(item) {
            return item.done == false;
        }

        function done(item) {
            return item.done == true;
        }

        function all(item) {
            return true;
        }

        //Delete the current selected item, if any
        function deleteItem(ev) {

            if (vm.selectedItem != null) {
                var confirm = $mdDialog.confirm()

                .textContent('The task "' + vm.selectedItem.title + '" will be deleted. Are you sure?')
                    .ariaLabel('Delete task')
                    .targetEvent(ev)
                    .ok('Yes')
                    .cancel('No');

                $mdDialog.show(confirm).then(function(result) {
                    if (result) {
                        var index = vm.items.indexOf(vm.selectedItem);
                        if (index != -1) {
                            vm.items.splice(index, 1);
                            storageService.set(vm.items);
                        }
                    }
                });
            }
        }

        //Creates a new item with the given parameters
        function createItem(title, priority, done, date) {
            vm.items.push({
                title: title,
                done: done || false,
                priority: priority || 0,
                date: date || Date.now()
            });
            storageService.set(vm.items);
        }


        //Add a new task to the items list 
        function addTask(ev) {
            var confirm = $mdDialog.prompt()
                .title('Add new task')
                .placeholder('Your task title...')
                .ariaLabel('Your task title...')
                .targetEvent(ev)
                .ok('Add')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function(result) {
                if (result)
                    vm.createItem(result);
            });
        }
        // rende visivile/invisibile la barra-Search quando si preme l'apposita icona
        function toggleSearch(){
           
           if(vm.search) 
                vm.search=false;
           else 
                vm.search=true;
        }

        
        function toggleMenu(){
            
               if(vm.viewBar)
                     vm.viewBar=false;
                else
                    vm.viewBar=true;
           
        }

        //funzione per settare view (o list o grid)
        function setView()
        {
            if(vm.view== 'list')
                vm.view= 'apps';
            else
                vm.view= 'list';
        }
        
       function addTaskForm()
       {
           console.log("sto passando il vettore : " +vm.items);
           taskService.createItem(vm.items);
       }
       
    }


})(window.angular);