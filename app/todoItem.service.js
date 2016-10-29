(function(){
    'use strict';

    angular.module('todoApp')
            .service('taskService', taskService);

    taskService.$inject = ['$mdDialog'];

    function taskService($mdDialog){

        this.showDialog = function (ev, categories, item, multiple, edit){
            return $mdDialog.show({
                controller: DialogController,
                controllerAs: 'dialogctrl',
                bindToController: {
                    item: 'vm.item',
                    categ: 'vm.categories',
                    status: 'vm.status',
                    prior: 'vm.prior',
                    mindate: 'vm.mindate',
                    multiple: 'vm.multiple',
                    edit: 'vm.edit'
                },
                locals: {
                    item: item,
                    categ: categories,
                    status: [{key: "Not Done", value: false},
                             {key: "Done", value: true}],
                    
                    prior: [{key: "Low", value: "-1"},
                            {key: "Medium", value: "0"},
                            {key: "High", value: "1"}],
                    multiple: multiple, 
                    edit: edit
                },
                templateUrl: 'app/panel.tmpl.html',
                clickOutsideToClose:true,
                targetEvent: ev
            })
            .then(function(answer){
                console.log("ANSwer: "+angular.toJson(answer));
                return answer;
            }, function (){
                console.log("Close modal");
            
            });
        };

    }


    

    function DialogController ($mdDialog, categ, status, prior, item, multiple, edit)
    {
        var vm = this;
        vm.item = item;
        vm.categories = categ;
        vm.status = status;
        vm.prior = prior;
        vm.multiple = multiple;  
        vm.edit = edit;      

        vm.getMinDate = getMinDate;
        vm.operation = getOperation();
        vm.hide = hide;
        vm.cancel = cancel;
        vm.answer = answer;
        vm.mydate = new Date();
        
        vm.mindate = getMinDate();
        vm.item2 = angular.copy(item) || {};
           
        function getMinDate()
        {
            if(vm.item == null)
                return (new Date(
                vm.mydate.getFullYear(),
                vm.mydate.getMonth(),
                vm.mydate.getDate()));

            else
                return new Date(vm.item.date);

        }
        
        function getOperation()
        {
            if (multiple && edit)
                return "Multiple Tasks edit";
            if (edit && multiple == false && vm.item != null)
                return "Single Task edit";
            if (vm.item == null)
                return "Task Creation";
            return "Task Details";
        }

        function hide()
        {
            $mdDialog.hide();
        };

        function cancel()
        {
            console.log ("Multimple: "+vm.multiple);
            $mdDialog.cancel();
        };


        function answer(ans)
        {
            console.log("ANS: "+angular.toJson(ans));
            $mdDialog.hide(ans);
        };


    }
})();