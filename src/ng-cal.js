
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

angular.module('Calendar', []).directive("myCal",function(){
    return {
      restrict: 'E',
      templateUrl: 'src/cal-template.html',
      controller: function($scope){
        $scope.dir = "Hola";
        $scope.console = {'log': console.log};

        $scope.fecha = new Calendario();
        $scope.today = new Calendario();
        $scope.selected = new Calendario().nextDay();


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
          return day.getTime() == $scope.selected.getTime();
        }
        $scope.select = function(day){
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
