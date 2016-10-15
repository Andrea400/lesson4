(function(){
    'use strict';

    angular.module('todoApp')
            .service('taskService', taskService);

    taskService.$inject = ['$mdPanel','storageService'];

    function taskService($mdPanel, storageService){

        var vm = this;
        vm.tPanel = $mdPanel;
        vm.item;
        vm.createItem = createItem;
       
        vm.prova = prova;
        vm.pippo;
        
        
        prova();

        function prova()
        {
            console.log("Sono attivo");
            console.log("tpanel " + vm.tPanel);
            console.log("item " + vm.item);
            console.log("pippo " + vm.pippo);
        
        }

        
       
        
        function createItem(pippo2){    
            console.log("sono il servizio ho ricevuto il vettore " + pippo2);
            
            taskCtrl.suca(pippo2);

            vm.position = vm.tPanel.newPanelPosition()
            .absolute()
            .center();

            vm.config = {
            attachTo: angular.element(document.body),
            controller: TaskController,
            controllerAs: 'taskCtrl',
            disableParentScroll: vm.disableParentScroll,
            templateUrl: 'app/panel.tmpl.html',
            hasBackdrop: true,
            position: vm.position,
            trapFocus: true,
            zIndex: 2,
            clickOutsideToClose: true,
            escapeToClose: true,
            focusOnOpen: true
        };
            
            vm.tPanel.open(vm.config);
            console.log("Pippo: "+angular.toJson(vm.pippo));
        
        }

        


        /*vm.fineInserimento = function(){
            console.log("Closing panel");
            tPanel.close();
        }*/
    }


     TaskController.$inject = ['storageService'];

    //Directive controller
    function TaskController(storageService) {
        var vm = this;
        vm.pippo;
         vm.confirm = confirm;
         vm.suca=suca;

         function confirm()
        {
            console.log("PRIMA:");
           
            
            //vm.tasksList.push(vm.item);
           
            
        }

        function suca(pippa)
        {
            vm.pippo=pippa;
            console.log("vettore: " + vm.pippo);

        }
      
    }

})();