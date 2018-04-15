# ng-cal

Fancy AngularJS calendar with material design.

## Requeriments

- AngularJS >= 1.6.5 - https://ajax.googleapis.com/ajax/libs/angularjs/1.6.5/angular.min.js

- Angular Animate >= 1.6.5 - https://ajax.googleapis.com/ajax/libs/angularjs/1.6.5/angular-animate.js

- Bootstrap 3 - https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css

- Roboto font - https://fonts.googleapis.com/css?family=Roboto

## Usage

- Download the [latest version]()

- Insert in your html:

```
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

<link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">

<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.5/angular.min.js"></script>

<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.5/angular-animate.js"></script>

<script src="script/js/ng-cal/ng-cal.js"></script>
```

- Add ng-cal to your Angular app:

```
<script>
  var app = angular.module("your-app", ['Calendar']);
</script>
```

- Create the element:

```      
<ng-cal on-accept="alert(date)" on-cancel="alert('Nope')"></ng-cal>
```

### Accept/Cancel callbacks

You can add `on-accept` and `on-cancel` callback to the calendar directive.

The `on-accept` callback, will receive a parameter called `date`, with the selected date:

```
<ng-cal on-accept="console.log(date)"></ng-cal>
```

### From source

Change templateUrl with template: ``

- Add stylesheet