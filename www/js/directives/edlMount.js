directives.directive('edlMount', [ '$timeout', '$ionicGesture', 'd3', 'MountPlaneService', 'PanelService', function($timeout, ionicGesture, d3, mp, ps) {
  return {
    restrict: "EAC",
    scope: {
      plane: '=',
      position: '=',
      selected: '=', 
      incline:  '='
    },
    transclude: true,
    controller: function ($scope, $element, $attrs) {
      var plane    = $scope.plane;

      plane.removedPanels = []; //TODO: currently stores removed {rowindex, panelId} for export only.
      // this.rotation = 0; //TODO: setup rotation
      // this.planeId = plane.planeId;
      // this.cornerPosition = plane.corner;
      // this.azm = plane.azm;
      // this.position = plane.position; // TODO: currently not used, should get updated as image is rotated
      // this.slope = plane.slope;
      // this.panelRows = plane.rows;
      // this.orientation = plane.orientation;
      // this.length = plane.null;
      // this.height = plane.null;
      // console.log(this.position, this.cornerPosition);
      // this.incline = plane.slope;
      
    },

    link: function (scope, ele, attrs, controller) {
      scope.scalex = 0;
      scope.scaley = 0;

      // $timeout(function() {
      //   elementW = ele.prop('clientWidth');
      //   elementH = ele.prop('clientHeight');
      // },200);

      ionicGesture.on('doubletap', setSelected, ele);
        
      function setSelected(e) {
        scope.plane.isSelected = !scope.plane.isSelected;
        scope.currentSelected = scope.plane;
        scope.$apply();
        // e.stopPropagation();
      }

      ionicGesture.on('drag', movePanel, ele);
      ionicGesture.on('dragstart', setOffset, ele);

      
      function setOffset (e) {
        var offset = {};
        offset.x = e.gesture.center.pageX - scope.plane.corner.lon;
        offset.y = e.gesture.center.pageY - scope.plane.corner.lat;
        ele[0].offset = offset;
      }

      function movePanel(e) {
        // e.stopPropagation();

        scope.plane.corner.lon = e.gesture.center.pageX ;
        scope.plane.corner.lat = e.gesture.center.pageY;
        scope.$apply();

      }


    },
    template: ['<g class="mplane" ng-class="{true:\'isSelected\'}[plane.isSelected]" ion-stop-event ',
                  '',
                  'ng-attr-transform="translate({{plane.corner.lon}},{{plane.corner.lat}})"',
                '>',
                '<g z-index="1" class="panelrow" ng-repeat="row in plane.panelRows" >',
                  '<g edl-panel z-index="10" ng-repeat="panel in row.panels" panel="panel" plane="plane" row="row" ng-attr-incline="incline" ',
                  'ng-class="{0:\'firstrow\'}[row.rowId]" ',
                  'rowindex="row.rowId" scaley="scaley" scale="scalex" >',
                  '</g>',
                '</g>',
              '</g>'].join('')
  };
}]);


directives.directive('draggable', function($document, $timeout) {
  return function(scope, element, attr) {
    var startX = 0, startY = 0, x = 0, y = 0, width =0, elementW = 0, elementH = 0, parentHeight, parentWidth;
    parentHeight = element.parent().prop('clientHeight');
    parentWidth = element.parent().prop('clientWidth');
    $timeout(function() {
      elementW = element.prop('clientWidth');
      elementH = element.prop('clientHeight');
    },200);

    element.on('dragstart', function(event) {
      // Prevent default dragging of selected content
      event.gesture.preventDefault();
      startX = event.gesture.center.pageX - x;
      startY = event.gesture.center.pageY - y;
      $document.on('drag', move);
      $document.on('dragend', release);
    });

    function move(event) {
      y = event.gesture.center.pageY - startY;
      x = event.gesture.center.pageX - startX;
      if (x >= 0 && x <= (parentWidth-elementW)) {
        element.css({
          left:  x + 'px'
        });
      }
      if (y >= 0 && y <= parentHeight-elementH) {
        element.css({
          top:  y + 'px'
        });
      }
    }

    function release() {
      $document.unbind('drag', move);
      $document.unbind('dragend', release);
    }
  };
})
;
