
class Calendario extends Date {
  get months() {
    return {
      'ES': ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      'EN': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }
  }

  get days() {
    return {
      'ES': ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
      'EN': ['Mon', 'Tue', 'Wed', 'Thu', 'Fry', 'Sat', 'Sun']
    }
  }
  get day() {
    return this.getUTCDate();
  }

  get month() {
    return this.getUTCMonth();
  }

  get year() {
     return this.getUTCFullYear();
  }

  get week_day() {
     return (this.getUTCDay() + 6) % 7 ;
  }

  set day(v)  {
    this.setUTCDate(v);
  }

  set month(v) {
    this.setUTCMonth(v);
  }

  set year(v) {
     this.setUTCFullYear(v);
  }


  nextDay() {
    this.day = this.day + 1;
    return this;
  }

  prevDay() {
    this.day = this.day - 1;
    return this;
  }

  nextMonth() {
    this.month = this.month + 1;
  }

  prevMonth() {
    this.month = this.month - 1;
  }

  nextYear() {
    this.year = this.year + 1;
  }

  prevYear() {
    this.year = this.year - 1;
  }

  month_text(LANG) {
    if(typeof(LANG) == 'undefined')
      LANG = 'ES';
    return this.months[LANG][this.month];
  }

  week_day_text(LANG) {
    if(typeof(LANG) == 'undefined')
      LANG = 'ES';
    return this.days[LANG][this.week_day];
  }

  get array() {
    var aux = new Calendario(this);

    while( aux.day > 1 ){
      aux.prevDay();
    }

    // > 1 because monday is 0
    while( aux.week_day > 0 ){
      aux.prevDay();
    }

    // "Padding" para evitar que se acumulen muchas
    // semanas del mes siguiente al final de la tabla
    if ( aux.day == 1 )
      for(var i = 0; i < 7; i++)
        aux.prevDay();


    var result = [];
    for(let i = 0; i <= 5; i++){
      var rows = [];
      for(let j = 0; j < 7; j++){
        rows.push(new Calendario(aux));
        aux.nextDay();
      }
      result.push(rows);
    }

    return result;
  }
};

// https://www.reddit.com/r/angularjs/comments/2wfq45/passing_functions_to_directives_vs/
// https://coderwall.com/p/lfkaea/angular-js-passing-reference-to-directive
angular.module('Calendar', ['ngAnimate']).directive("ngCal",function(){
    return {
      restrict: 'E',
      scope: {
        'acceptCallback': '&onAccept',
        'cancelCallback': '&onCancel',
      },
      template: `
      <div class="calendar">
          <link rel="stylesheet" href="src/stylesheet.css">
          <div class="selection" ng-show="selected">
              <div id="year">{{ selected.year }}</div>
              <div id="date">{{selected.week_day_text()}}., {{selected.day}} {{selected.month_text() | lowercase}}</div>
          </div>
          <div class="wrapper" style="height: 25px; display: inline-block;"></div>
          <div class="menu">
            <div class="control">
              <div class="change-month prev boton" ng-click="prevMonth()">&lt;</div><!--
              --><div style="width: 150px;" >
                {{ fecha.month_text() }} {{ fecha.year }}</div><!--
              --><div class="change-month next boton" style="width: 30px;" ng-click="nextMonth()">&gt;</div>
            </div>
          </div>

          <div class="grid">
            <div class="header">
                <div class="week">
                <!-- The structure of this block is for avoid the white spaces introduced by the browser-->
                <!-- https://css-tricks.com/fighting-the-space-between-inline-block-elements/ -->
                    <div class="day">
                    L</div><div class="day">
                    M</div><div class="day">
                    X</div><div class="day">
                    J</div><div class="day">
                    V</div><div class="day">
                    S</div><div class="day">
                    D</div>
                  <!-- <div class="day" ng-repeat="d in ['L','M','X','J','V','S','D']">{{ d }}</div> -->
                </div>
              </div>
              <div class="body">
                <div class="week" ng-repeat="week in calendario">
                <div class="day"
                ng-class="{
                  'unable': (day.month != fecha.month),
                  'today': (day.day == today.day && day.month == today.month && day.year == today.year),
                  'selected': isSelected(day)
                }"
                ng-click="select(this)"
                ng-repeat="day in week">
                  {{ day.day }}
                </div>
              </div>
            </div>
          </div>
          <div class="confirmation">
            <div class="option boton" ng-disabled="!selected" ng-class="{'disabled': !selected}" ng-click="aceptar()">Aceptar</div>
            <div class="option boton" ng-click="cancelar()">Cancelar</div>
          </div>
      </div>
      `,
      controller: function($scope){

        $scope.fecha = new Calendario();
        $scope.today = new Calendario();
        $scope.selected = undefined;

        $scope.aceptar = function(){

          if(!$scope.selected)
            return;

          if($scope.acceptCallback) {
            $scope.acceptCallback({
              date: $scope.selected
            });
          }
        }

        // TODO Add cancel callback
        $scope.cancelar = function(){
          $scope.selected = undefined;
          $scope.fecha = new Calendario();
          $scope.calendario = $scope.fecha.array;
          if($scope.cancelCallback)
            $scope.cancelCallback();
        }


        $scope.calendario = $scope.fecha.array;
        $scope.nextMonth = function(){
          $scope.fecha.nextMonth();
          $scope.calendario = $scope.fecha.array;
        }
        $scope.prevMonth = function(){
          $scope.fecha.prevMonth();
          $scope.calendario = $scope.fecha.array;
        }

        $scope.isSelected = function(day){
          if($scope.selected)
            return day.getTime() == $scope.selected.getTime();
          else
            return false;
        }

        $scope.select = function(day) {
          var selected = new Calendario(day.day);

          if(selected.month > $scope.fecha.month){
            if(selected.year >= $scope.fecha.year){
              $scope.nextMonth();
            } else {
              $scope.prevMonth();
            }
          } else if (selected.month < $scope.fecha.month){
            if(selected.year <= $scope.fecha.year)
              $scope.prevMonth();
            else
              $scope.nextMonth();
          }

          $scope.selected = new Calendario(selected);
        }
      }
    };
});
