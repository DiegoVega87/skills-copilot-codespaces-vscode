function skillsMember(){
    return {
        restrict: 'E',
        templateUrl: 'modules/skills/views/member.html',
        controller: 'skillsMemberController',
        controllerAs: 'vm',
        bindTocController: true,
        scope: {
            member: '='
        }  
    };
}