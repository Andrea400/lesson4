(function () {
    'use strict';

    angular
        .module('todoApp')
        .directive('customNote', customNote)
        
    
        

    customNote.$inject = ['storageService','$mdDialog','noteService'];

    function customNote(storageService, $mdDialog, noteService) {

        return {
            scope: {
                items: '=',
                type:'=',
                inputSearch:'=',
                cercaPer:'=',
            },
            templateUrl: function (element, attribute) {
                return 'app/components/' + attribute.type + '.template.html';
            },

            bindToController: true,
            controller: customNoteController,
            controllerAs: 'customNoteCtrl',

            restrict: 'E',

        };
    }


    customNoteController.$inject = ['storageService','noteService','$mdDialog'];

    //Directive controller
    function customNoteController( storageService, noteService,  $mdDialog, $scope) {
        var vm = this;
        vm.deleteItem = deleteItem;
        vm.createItem = createItem;
        vm.editItem = editItem;
        vm.showItem = showItem;
        vm.toggleSelection = toggleSelection;
        vm.selectedItems =[];
      



        function toggleSelection(item) {
           var index = vm.selectedItems.indexOf(item);
           if(index!=-1){
               //l'elemento è già selezionato quindi lo deseleziono
               vm.selectedItems.splice(index,1);
           }else{
            // l'elemento non è ancora selezionato quindi lo seleziono
                vm.selectedItems.push(item);
           }
        }


         function deleteItem(ev) {
            if (vm.selectedItems != null && vm.selectedItems.length > 0) {
                var confirm = $mdDialog.confirm()

                .textContent('The selected notes will be deleted. Are you sure?')
                    .ariaLabel('Delete notes')
                    .targetEvent(ev)
                    .ok('Yes')
                    .cancel('No');

                $mdDialog.show(confirm).then(function(result) {
                    if (result) {
                        for (var i=0; i< vm.selectedItems.length; i++)
                        {
                            for (var x=0; x< vm.items.length; x++)
                            {
                                if(vm.items[x] == vm.selectedItems[i])
                                {                                 
                                    vm.items.splice(x, 1);
                                    storageService.deleteNote(vm.selectedItems[i]);
                                    
                                }
                            }
                        }
                    vm.selectedItems = [];
                    }
                });
            }
        }


        function createItem(ev){
            noteService.showDialog(ev, null, null, true).then(function(i){
                if (i != null )
                {
                    vm.item = i;
                    //per il calcolo dell'id
                    if (vm.items.length > 0)
                    {
                        var val = vm.items[vm.items.length - 1];
                        vm.item.id= val.id +1;
                    }
                    else
                        vm.item.id = 1;

                    vm.item.description = i.description || "";
                    vm.item.tags= i.tags || [];
                    vm.item.date = i.date || new Date();
                        
                    vm.items.push(vm.item);
                    storageService.storeNote(vm.item);
                    
                }
               
            });
            
        }


        function editItem(ev){
            var tmp;

            if (vm.selectedItems != null) {
                if(vm.selectedItems.length == 1){
                noteService.showDialog(ev, angular.copy(vm.selectedItems[0], tmp),false, true).then(function(i){
                if (i != null )
                {
                    var index = vm.items.indexOf(vm.selectedItems[0]);
                        if (index != -1) {
                            vm.items[index].title = i.title;
                            vm.items[index].description = i.description || "";
                            vm.items[index].tags = i.tags || [] ;
                            vm.items[index].color = i.color;
                            vm.items[index].date = i.date || vm.selectedItems[0].date
                           
                                
                            storageService.updateNote(vm.items[index]);
                            vm.selectedItems = [];
                        }
                }
            });
            }
            
            //Multimple note edit (only color)
            else
            {
                noteService.showDialog(ev,null,true, true).then(function(i)
                {
                    if (i != null)
                    {
                        for (var t in vm.selectedItems)
                        {
                            for (var x in vm.items)
                            {
                                if(vm.items[x].id == vm.selectedItems[t].id)
                                {
                                   if (i.color)
                                        vm.items[x].color = i.color;
                                                                           
                                    storageService.updateNote(vm.items[x]);
                                }
                            }
                        }
                    }
                    vm.selectedItems = [];
                });
                
            }
    
            
            }

        }

        function showItem(item)
        {
            if (vm.selectedItems != null) {
                 noteService.showDialog(null, item,false, false).then(function(i){

                 });
            }

        }

    }
})();