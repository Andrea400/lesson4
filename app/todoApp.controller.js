(function(angular) {

    'use strict';
    //var module = angular.module('todoApp', ['ngMaterial']);

    angular.module('todoApp').controller('TodoController', TodoController);

TodoController.$inject = ['storageService','$mdDialog','taskService'];
    //This is the application controller
    function TodoController(storageService, $mdDialog, taskService ) {
        var vm = this;
        vm.search = false; //booleano per "barra Search"
        vm.toggleSearch = toggleSearch; // funzione per Show/hide barra search
        // variabile per view in formato lista o grid
        vm.view = 'list';
        vm.setView = setView;        
          
       
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
        
       
    }


})(window.angular);