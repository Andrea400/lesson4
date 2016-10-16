(function(){
    'use strict';

    angular.module('todoApp')
            .service('taskService', taskService);

    taskService.$inject = ['$mdDialog'];

    function taskService($mdDialog){

        this.showDialog = function (ev, categories){
            return $mdDialog.show({
                controller: DialogController,
                controllerAs: 'dialogctrl',
                bindToController: {
                    item: 'vm.item',
                    categ: 'vm.categories',
                    status: 'vm.status',
                    prior: 'vm.prior',
                    mindate: 'vm.mindate'
                },
                locals: {
                    categ: categories,
                    status: [{key: "NotDone", value: false},
                             {key: "Done", value: true}],
                    prior: ["0","1","2"]
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


    function DialogController ($mdDialog, categ, status, prior)
    {
        var vm = this;
        vm.item;
        vm.categories = categ;
        vm.status = status;
        vm.prior = prior;

        vm.hide = hide;
        vm.cancel = cancel;
        vm.answer = answer;
        vm.mydate = new Date();
        vm.mindate = new Date(
                vm.mydate.getFullYear(),
                vm.mydate.getMonth(),
                vm.mydate.getDate());

        function hide()
        {
            $mdDialog.hide();
        };

        function cancel()
        {
            $mdDialog.cancel();
        };


        function answer(ans)
        {
            console.log("ANS: "+angular.toJson(ans));
            $mdDialog.hide(ans);
        };


    }
})();