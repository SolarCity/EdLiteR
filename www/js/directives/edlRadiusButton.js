function edlRadiusButton($ionicGesture) {
  return {
    restrict: "E",
    template: [
      '<label ">',
        '<div class="item range range-positive">',
          '<input type="range"',
            'id="obstructionRangeInput"',
            'min="5"',
            'max="200"',
            'ng-change="focus.set(\'radius\', plan.radius)"',
            'ng-model="plan.radius"',
          '>',
        '</div>',
      '</label>',
    ].join(' '),
  };
}
directives.directive('edlRadiusButton', edlRadiusButton);
