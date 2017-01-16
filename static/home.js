app.controller('homeController', function($scope, $http, $timeout, $mdDialog, $q){
	
	$http.get("/testingService")
  	.then(function(response){ 
  		$scope.details = response.data; 
  	});

  	//get list of timezones
  	$http.get('/timezones')
	.success(function (data, status, headers, config) {
		$timeout(function(){

			$('.loaderDiv').css('display','none');
			$('.displayTime').css('display','inline-flex');

			console.log(data);
			$scope.tmZns = data;

		})
	})
	.error(function (data, status, header, config) {
		$timeout(function(){
			$mdDialog.show(
		      $mdDialog.alert()
		        .clickOutsideToClose(true)
		        .title('Something went wrong.')
		        .textContent('Error occured while getting the list of timezones. Please refresh your page.')
		        .ariaLabel('Alert Dialog Demo')
		        .ok('Got it!')
		    );
		})
	});

	//call a function to get recetnly added date
	getRecentDate();

  	//submit date function
  	$scope.submitDate = function()
  	{
  		$('#submitDate').attr('disabled','disabled');

 
  		var data = {
			"customDate" : $scope.myDate
		}

		$scope.myDate = undefined;

		var config = {
			headers : {
			'Content-Type': 'application/json'
			}
		}


  		$http.post('/addDate', data, config)
		.success(function (data, status, headers, config) {
			$timeout(function(){

  				$('#submitDate').removeAttr('disabled');

				$mdDialog.show(
			      $mdDialog.alert()
			        .clickOutsideToClose(true)
			        .title('Date added successfully.')
			        .ariaLabel('Alert Dialog Demo')
			        .ok('Okay')
			    );
				getRecentDate();
			})
		})
		.error(function (data, status, header, config) {

			$timeout(function(){

  				$('#submitDate').removeAttr('disabled');

				$mdDialog.show(
			      $mdDialog.alert()
			        .clickOutsideToClose(true)
			        .title('Something went wrong.')
			        .textContent('Error occured while storing the date. Please try again.')
			        .ariaLabel('Alert Dialog Demo')
			        .ok('Got it!')
			    );
			})
		});
  	}

  	//get recent date function 
  	function getRecentDate()
  	{
  		$http.get('/recentDate')
		.success(function (data, status, headers, config) {
			$timeout(function(){
				$scope.recDate = data[0].dateEntered;
				$scope.recDateUnix = moment($scope.recDate).unix();

				if($scope.tmZnsVal == undefined)
				{
					$scope.disDate = moment($scope.recDate).format('MMMM Do YYYY, h:mm:ss a');			
				}
				else
				{
        			$scope.disDate = moment($scope.recDate).utcOffset($scope.tmZnsVal).format('MMMM Do YYYY, h:mm:ss a');
				}
			})
		})
		.error(function (data, status, header, config) {
			$timeout(function(){
				$mdDialog.show(
			      $mdDialog.alert()
			        .clickOutsideToClose(true)
			        .title('Something went wrong.')
			        .textContent('Error occured while getting the list of timezones. Please refresh your page.')
			        .ariaLabel('Alert Dialog Demo')
			        .ok('Got it!')
			    );
			})
		});
  	}

  	//check if user has changed timezone
  	$scope.$watch('tmZnsVal', function() {
        if($scope.tmZnsVal != undefined)
        {
        	$scope.disDate = moment($scope.recDate).utcOffset($scope.tmZnsVal).format('MMMM Do YYYY, h:mm:ss a');
        	// $scope.disDate = moment.tz($scope.recDate, "America/Los_Angeles").format('MMMM Do YYYY, h:mm:ss a'); 
        }
    });
});

