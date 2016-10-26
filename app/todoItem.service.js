(function(){
    'use strict';

    angular.module('todoApp')
            .service('taskService', taskService);

    taskService.$inject = ['$mdDialog'];

    function taskService($mdDialog){

        this.showDialog = function (ev, categories, item, multiple){
            return $mdDialog.show({
                controller: DialogController,
                controllerAs: 'dialogctrl',
                bindToController: {
                    item: 'vm.item',
                    categ: 'vm.categories',
                    status: 'vm.status',
                    prior: 'vm.prior',
                    mindate: 'vm.mindate',
                    multiple: 'vm.multiple'
                },
                locals: {
                    item: item,
                    categ: categories,
                    status: [{key: "NotDone", value: false},
                             {key: "Done", value: true}],
                    prior: ["-1", "0", "1"],
                    multiple: multiple
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


    

    function DialogController ($mdDialog, categ, status, prior, item, multiple)
    {
        var vm = this;
        vm.item = item;
        vm.categories = categ;
        vm.status = status;
        vm.prior = prior;
        vm.multiple = multiple;

        vm.getMinDate = getMinDate;
        vm.hide = hide;
        vm.cancel = cancel;
        vm.answer = answer;
        vm.mydate = new Date();
        
        vm.mindate = getMinDate();
    
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