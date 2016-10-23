(function () {
    'use strict';

    angular
        .module('todoApp')
        .directive('customNote', customNote)
        
    
        

    customNote.$inject = ['storageService','$mdDialog','taskService'];

    function customNote(storageService, $mdDialog, taskService) {

        return {
            scope: {
            },
            templateUrl: function (element, attribute) {
                return 'app/components/customNote.template.html';
            },

            bindToController: true,
            controller: customNoteController,
            controllerAs: 'customNoteCtrl',

            restrict: 'E',

        };
    }


    customNoteController.$inject = ['storageService','taskService','$mdDialog'];

    //Directive controller
    function customNoteController( storageService, taskService,  $mdDialog, $scope) {
        var vm = this;
        vm.deleteItem = deleteItem;
        vm.createItem = createItem;
        vm.editItem = editItem;
        vm.toggleSelection = toggleSelection;
        vm.selectedItems =[];
        vm.items =[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,156];



        function toggleSelection(item) {
           var index = vm.selectedItems.indexOf(item);
           if(index!=-1){
               //l'elemento è già selezionato quindi lo deseleziono
               vm.selectedItems.splice(index,1);
           }else{
            // l'elemento non è ancora selezionato quindi lo seleziono
                vm.selectedItems.push(item);
           }
            console.log("elementi selezionati dopo: " + angular.toJson(vm.selectedItems));
        }


         function deleteItem(ev) {
            if (vm.selectedItems != null && vm.selectedItems.length > 0) {
                var confirm = $mdDialog.confirm()

                .textContent('The selected tasks will be deleted. Are you sure?')
                    .ariaLabel('Delete tasks')
                    .targetEvent(ev)
                    .ok('Yes')
                    .cancel('No');

                $mdDialog.show(confirm).then(function(result) {
                    if (result) {
                        for (var i=0; i< vm.selectedItems.length; i++)
                        {
                            for (var x=0; x< vm.items.length; x++)
                            {
                                if(vm.items[x].id == vm.selectedItems[i].id)
                                {                                 
                                    vm.items.splice(x, 1);
                                    storageService.deleteTask(vm.selectedItems[i]);
                                }
                            }
                        }
                    vm.selectedItems = [];
                    }
                });
            }
        }


        function createItem(ev){
            taskService.showDialog(ev,vm.listaCategorie).then(function(i){
                if (i != null )
                {
                    vm.item = i;
                    if (vm.items.length > 0)
                    {
                        var val = vm.items[vm.items.length - 1];
                        vm.item.id= val.id +1;
                    }
                    else
                        vm.item.id = 1;

                    if(vm.item.date == null)
                        vm.item.date = new Date();
                    vm.items.push(vm.item);
                    storageService.storeTask(vm.item);
                }
            });
            
        }


        function editItem(ev){
            var tmp;

            if (vm.selectedItems != null) {
                taskService.showDialog(ev, vm.listaCategorie, angular.copy(vm.selectedItems[0], tmp)).then(function(i){
                if (i != null )
                {
                    var index = vm.items.indexOf(vm.selectedItems[0]);
                        if (index != -1) {
                            vm.items[index].title = i.title;
                            vm.items[index].description = i.description;
                            vm.items[index].priority = i.priority;
                            vm.items[index].tags = i.tags;
                            vm.items[index].category = i.category;
                            vm.items[index].done = i.done;
                            vm.items[index].estimated = i.estimated;
                            if (i.date != null)
                                vm.items[index].date = i.date;
                            else
                                vm.items[index].date = vm.selectedItems[0].date;
                                
                            storageService.updateTask(vm.items[index]);
                            vm.selectedItems = [];
                        }
                }
            });
            }
        }

        
    




    }
})();