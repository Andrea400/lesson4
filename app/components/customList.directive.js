(function () {
    'use strict';

    angular
        .module('todoApp')
        .directive('customList', customList)
        
    
        

    customList.$inject = ['storageService','$mdDialog','taskService'];

    function customList(storageService, $mdDialog, taskService) {

        return {
            scope: {
                 items: '=',
                //selectedItem: '=',
                filterFunction: '=',
                categoria: '=',
                listaCategorie: '=',
                imputSearch:'=',
                cercaPer:'='
               
            },
            templateUrl: function (element, attribute) {
                return 'app/components/' + attribute.type + '.template.html';
            },

            bindToController: true,
            controller: customListController,
            controllerAs: 'customListCtrl',

          restrict: 'E',

        };
    }


    customListController.$inject = ['storageService','taskService','$mdDialog'];

    //Directive controller
    function customListController( storageService, taskService,  $mdDialog, $scope) {
        var vm = this;
        vm.changePriority = changePriority;
        vm.checkStateChanged = checkStateChanged;
        vm.toggleSelection = toggleSelection;
        vm.editItem = editItem;

        vm.selectedItems = [];
        
        vm.item;
        vm.deleteItem = deleteItem;
        vm.createItem = createItem;
        vm.editItem = editItem;
        vm.showItem = showItem;
        vm.attuareFiltro = true;

        //Changes the priority of the given item
        function changePriority(item) {
            if (item.priority <= 0)
                item.priority++;
            else
                item.priority = -1;

            storageService.updateTask(item);
        }

        //Occurs when the status of an items changes
        function checkStateChanged(item) {
            console.log("custionListCtrl: richiamata checkStateChanged ");
            console.log("custionListCtrl: salvataggio: " + vm.items);
            storageService.updateTask(item);
        }

        //Select or deselect the given item
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
               
       
        //Delete the current selected items, if any
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
            taskService.showDialog(ev,vm.listaCategorie,null, false, true).then(function(i){
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
                if(vm.selectedItems.length == 1){
                taskService.showDialog(ev, vm.listaCategorie, angular.copy(vm.selectedItems[0], tmp),false, true).then(function(i){
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

            //Multimple task edit (only priority and status)
            else
            {
                taskService.showDialog(ev,null,null, true, true).then(function(i)
                {
                    if (i != null)
                    {
                        for (var t in vm.selectedItems)
                        {
                            for (var x in vm.items)
                            {
                                if(vm.items[x].id == vm.selectedItems[t].id)
                                {
                                   if (i.priority)
                                        vm.items[x].priority = i.priority;
                                    
                                    if (i.done != null)
                                        vm.items[x].done = i.done;
                                        
                                    storageService.updateTask(vm.items[x]);
                                }
                            }
                        }
                    }
                });
            }
            }
        }

        function showItem(item)
        {
            if (vm.selectedItems != null) {
                 taskService.showDialog(null, vm.listaCategorie, item, false, false).then(function(i){

                 });
            }

        }

        
    }


})();