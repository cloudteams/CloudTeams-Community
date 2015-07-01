/**
 * Created by Aggelos.
 *
 */

	/* for account delete */
	$("#deleteaccountForm").submit(function(event) {
		event.preventDefault();
		var pass = document.forms["deleteaccountForm"]["password"].value;
		Loading();
		$.ajax({
			type: "post",
			data: {password:pass, settingAction:'deleteaccount', csrfmiddlewaretoken: getCookie('csrftoken')},
			cache: false,
			url: BASE_URL + "settings/",
			dataType: "text",
			error: function (xhr, status, error) {
				Done();
				$('#deleteaccountmsg').text(xhr.responseText);
			},
			success: function (response) {
				window.location.replace(BASE_URL + "login/");
			}
		});
	});

	/* for info edit */
	$("#editinfoForm").submit(function(event) {
		$('#editfailmsg').text('');
		event.preventDefault();
		Loading();
		var data = {
			username: document.forms["editinfoForm"]["username"].value,
			firstname: document.forms["editinfoForm"]["firstname"].value,
			lastname: document.forms["editinfoForm"]["lastname"].value,
			email: document.forms["editinfoForm"]["email"].value,
			birthday: document.forms["editinfoForm"]["birthday"].value,
			gender: document.forms["editinfoForm"]["gender"].value,
			settingAction: 'editinfo',
			csrfmiddlewaretoken: getCookie('csrftoken')
		};
		$.ajax({
			type: "post",
			data: data,
			cache: false,
			url: BASE_URL + "settings/",
			dataType: "json",
			error: function (xhr, status, error) {
				Done();
				$('#editinfomsg').text(xhr.responseText);
			},
			success: function (response) {
				$('#Tblusername').text(response.username);
				$('#Tblfirstname').text(response.fname);
				$('#Tbllastname').text(response.lname);
				$('#Tblemail').text(response.email);
				$('#Tblbirth').text(response.birthday);
				$('#Tblgender').text(response.gender);
				$('#successmsg').text('Information updated successfully!');
				$('#username').text(response.username);
				Done();
				$('#editinfo').modal('hide');

			}
		});
	});

	/* for password change*/
	$("#passchangeForm").submit(function(event) {
		event.preventDefault();
		var data = {
			old_password: document.forms["passchangeForm"]["old_password"].value,
			new_password: document.forms["passchangeForm"]["new_password"].value,
			new_password_repeat: document.forms["passchangeForm"]["new_password_repeat"].value,
			settingAction: 'passchange',
			csrfmiddlewaretoken: getCookie('csrftoken')
		};
		$.ajax({
			type: "post",
			data: data,
			cache: false,
			url: BASE_URL + "settings/",
			dataType: "text",
			error: function (xhr, status, error) {
				Done();
				$('#passchangemsg').text(xhr.responseText);
			},
			success: function (response) {
				Loading();
				$('#successmsg').text('Password changed successfully!');
				$('#changepassword').modal('hide');
				setTimeout(function(){
					window.location = BASE_URL + "login/";
					Done();
				}, 3000);
			}
		});
	});


	$('#changepassword').on("hidden", function () {
		$('#passchangemsg').text('');
		document.getElementById("passchangeForm").reset();
	});
	$('#deleteaccount').on("hidden", function () {
		$('#deleteaccountmsg').text('');
		document.getElementById("deleteaccountForm").reset();
	});
	  $('#editinfo').on("hidden", function () {
		$('#editinfomsg').text('');

	});
	$('.modal').on("shown", function () {
		$('#successmsg').html("&nbsp;");
	});

	function synchronizeProvider(provider){
			LoadingWithBackdrop();
			$.ajax({
				type: "post",
				data: {csrfmiddlewaretoken: getCookie('csrftoken')},
				cache: false,
				url: BASE_URL + "settings/sync/" +  provider +'/',
				dataType: "text",
				error: function (xhr, status, error) {
					alert(xhr.responseText);
					DoneWithBackdrop();
				},
				success: function (response) {
					DoneWithBackdrop();
					alert(response);

				}
			});

		}



		var map; // reference to Gmaps, can't be done without global/custom scope variable
        var marker; // reference to marker. Can't get reference to marker(s) from a map object => need for global var
        var map2;
        var marker2;
		function initialize() {
            marker = new google.maps.Marker({
                position: {lat:0, lng:0},
                draggable: true
            });

			var mapOptions = {
			  center: { lat: 37.9908372, lng: 23.7383394},
			  zoom: 9
			};
			map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
            google.maps.event.addListener(marker, 'dragend', function(event){

  				marker.setMap(null);
				marker.position = event.latLng;
                map.setCenter(marker.position);
                marker.setMap(map);

                var geoLocations = (marker.getPosition().toString()).replace('(','').replace(' ','').replace(')','');
            	$.ajax({
					type: "get",
					cache: false,
					url: "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + geoLocations,
					dataType: "json",
					error: function (xhr, status, error) {
						alert("Couldn't fetch this Address. Try again!")
					},
					success: function (response) {
						$('#places-input').val(response.results[0].formatted_address)
					}
				});
			});

            var input = (document.getElementById('places-input'));
  			map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
            var searchBox = new google.maps.places.SearchBox((input));
            var defaultBounds = new google.maps.LatLngBounds(
				new google.maps.LatLng(-33.8902, 151.1759),
				new google.maps.LatLng(-33.8474, 151.2631));
			map.fitBounds(defaultBounds);

            google.maps.event.addListener(searchBox, 'places_changed', function() {
				var place = searchBox.getPlaces()[0]; // We dont want more than 1 markers
				if (place.length == 0) {
				  return;
				}

                marker.setMap(null); // Nullify the previous marker
				// For only the 1st place, get the icon, place name, and location.
				var bounds = new google.maps.LatLngBounds();
				var image = {
					url: place.icon,
					size: new google.maps.Size(71, 71),
					origin: new google.maps.Point(0, 0),
					anchor: new google.maps.Point(17, 34),
					scaledSize: new google.maps.Size(25, 25)
				};

				// Move the marker to the new Location
                marker.position = place.geometry.location;
                marker.setMap(map);
                marker.setAnimation(google.maps.Animation.DROP);

				bounds.extend(place.geometry.location);

                map.fitBounds(bounds);
                map.setZoom(16);
			});

            google.maps.event.addListener(map, 'bounds_changed', function() {
				var bounds = map.getBounds();
				searchBox.setBounds(bounds);
            });
            // Do the same for the 2nd map - Its virtually a copy of the above code.
			marker2 = new google.maps.Marker({
				position: event.latLng,
				draggable: true
			});
			map2 = new google.maps.Map(document.getElementById('map-canvas-2'), mapOptions);
			google.maps.event.addListener(marker2, 'dragend', function(event){

				marker2.setMap(null);
				marker2.position = event.latLng;
				map2.setCenter(marker.position);
				marker2.setMap(map2);

				var geoLocations = (marker2.getPosition().toString()).replace('(','').replace(' ','').replace(')','');
				$.ajax({
					type: "get",
					cache: false,
					url: "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + geoLocations,
					dataType: "json",
					error: function (xhr, status, error) {
						alert("Couldn't fetch this Address. Try again!")
					},
					success: function (response) {
						$('#places-input-2').val(response.results[0].formatted_address)
					}
				});
			});
			var input2 = (document.getElementById('places-input-2'));
			map2.controls[google.maps.ControlPosition.TOP_LEFT].push(input2);
			var searchBox2 = new google.maps.places.SearchBox((input2));
			map2.fitBounds(defaultBounds);
            google.maps.event.addListener(searchBox2, 'places_changed', function() {
				var place = searchBox2.getPlaces()[0]; // We dont want more than 1 markers
				if (place.length == 0) {
				  return;
				}

                marker2.setMap(null); // Nullify the previous marker
				// For only the 1st place, get the icon, place name, and location.
				var bounds = new google.maps.LatLngBounds();
				var image = {
					url: place.icon,
					size: new google.maps.Size(71, 71),
					origin: new google.maps.Point(0, 0),
					anchor: new google.maps.Point(17, 34),
					scaledSize: new google.maps.Size(25, 25)
				};

				// Move the marker to the new Location
                marker2.position = place.geometry.location;
                marker2.setMap(map2);
                marker2.setAnimation(google.maps.Animation.DROP);

				bounds.extend(place.geometry.location);

                map2.fitBounds(bounds);
                map2.setZoom(16);
			});
            google.maps.event.addListener(map2, 'bounds_changed', function() {
				var bounds = map2.getBounds();
				searchBox2.setBounds(bounds);
            });
		}
		google.maps.event.addDomListener(window, 'load', initialize);

        $('#submitAddPlace').click(function(event){
            Loading();
            var address = $('#places-input').val();
            var lat = marker.getPosition().lat();
            var lng = marker.getPosition().lng();
            var place_name = document.forms["addPlaceForm"]["placename"].value;
            $.ajax({
				type: "post",
				data: {'setting':"addPlace", 'address': address, 'lat':lat, 'lng':lng, 'place_name': place_name, 'csrfmiddlewaretoken': getCookie('csrftoken')},
				cache: false,
				url: BASE_URL + "settings/places/",
				dataType: "text",
				error: function (xhr, status, error) {
					Done();
                    if (xhr.responseText == "Empty") {
                        alert("Place name can't be empty. Try again.")
                    }
                    else {
                        alert("Place names have to be unique. Try again")
                    }
				},
				success: function (response) {
					table.ajax.reload();
                    $('#addPlaceModal').modal('hide');
                    $('.btn-setting').blur();
                    Done();

                }
			});

        });

        $('#addPlaceModal').one('shown', function () {
			google.maps.event.trigger(map, "resize");
            map.setCenter({ lat: 37.9908372, lng: 23.7383394});
            map.setZoom(9);

		});

        $('#editPlaceModal').one('shown', function () {
            var pos = marker2.getPosition();
			google.maps.event.trigger(map2, "resize");
            marker2.setPosition(pos);
			marker2.setMap(map2);
			map2.setCenter(pos);
			map2.setZoom(16);
		});

        $('#addPlaceModal').on('hidden',function(){
            document.getElementById("addPlaceForm").reset();
            map.setCenter({ lat: 37.9908372, lng: 23.7383394});
            map.setZoom(9);
            marker.setMap(null);
        });

        var table = $('#PlacesTable').DataTable( {
					"sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span12'i><'span12 center'p>>",
					"sPaginationType": "bootstrap",
        			"autoWidth": false,
					"oLanguage": {
						"sLengthMenu": "_MENU_  Records per page"
					},
					"ajax": BASE_URL + "settings/placestojson/",
					"columns":  [
						{ "data": "place_name" },
						{ "data": "place_address" },
						{ "data": "lat" },
                        { "data": "lng" },
                        { "data": "id"}
					],
					"columnDefs": [{
                    "targets": [2],
                    "visible": false
                    },
                    {
                    "targets": [3],
                    "visible": false
                    },
                    {
					"targets": 4,
					"createdCell": function (td, cellData, rowData, row, col) {

						// Add edit button with modal trigger
						$(td).empty();
						$(td).className = "center";
						var buttonEdit = document.createElement('a');
						buttonEdit.className = "btn btn-info btn-setting";
						buttonEdit.href = "#";
						$(buttonEdit).attr("data-target", "#editPlaceModal");
						$(buttonEdit).attr("data-toggle", "modal");
						var iconEdit = document.createElement('i');
						iconEdit.className = "halflings-icon edit white";
						buttonEdit.appendChild(iconEdit);
                        if ($(window).width() >= 533) {
                            $(buttonEdit).css('margin-right', '0.2em');
                        }
						$(td).append(buttonEdit);
						$(buttonEdit).on('click', function(){
                            marker2.setMap(null);
    						marker2.setPosition({lat:rowData.lat, lng:rowData.lng});
                            marker2.setMap(map2);
                            map2.setCenter({lat:rowData.lat,lng:rowData.lng});
                            map2.setZoom(16);
                            $('#places-input-2').val(rowData.place_address);
                            document.forms["editPlaceForm"]["placename"].value = rowData.place_name;
                            // Disable all other instances, and apply function only for the currently shown modal
							$('#editPlaceModalConfirm').off().on('click', function() {
								updatePlaceAndReload(rowData.id);
							});
						});

                        $(window).on('resize',function(){
							if ($(this).width() <533 ) {
								$(buttonEdit).css('margin-right','0');
							}
							else {
								$(buttonEdit).css('margin-right','0.2em');
							}
						});

						//Add Delete Button with modal trigger
						var buttonDelete = document.createElement('a');
						buttonDelete.className = "btn btn-danger btn-setting";
						buttonDelete.href = "#";
						$(buttonDelete).attr("data-target", "#deletePlaceModal");
						$(buttonDelete).attr("data-toggle", "modal");
						var iconTrash = document.createElement('i');
						iconTrash.className = "halflings-icon trash white";
						buttonDelete.appendChild(iconTrash);
						$(td).append(buttonDelete);
						$(buttonDelete).on('click', function(){
							// Dynamically change the 'deleteModal Content'
							$('#deletePlaceModal .modal-body p').text('Are you sure you want to delete place: ' +
								'"' + rowData.place_name + '" ?');
							//So that only the LAST goal clicked will be deleted
                            // Disable all other instances, and apply function only for the currently shown modal
							$('#deletePlaceModalConfirm').off().on('click', function() {
								deletePlaceAndReload(rowData.id);
							});
						})
					}
					}]
		});

        function deletePlaceAndReload(place_id) {
		Loading();
		$.ajax({
				type: "post",
				data: {'setting': "deletePlace", 'place_id' :place_id, 'csrfmiddlewaretoken': getCookie('csrftoken')},
				cache: false,
				url: BASE_URL + "settings/places/",
				dataType: "text",
				error: function (xhr, status, error) {
                    alert(xhr.responseText);
                    window.location.reload()
				},
				success: function (responseData) {
                    table.ajax.reload();
					$('#deletePlaceModal').modal('hide');
					Done();
				}
			});
   		}

        function updatePlaceAndReload(place_id) {
		Loading();
		var address = $('#places-input-2').val();
        var lat = marker2.getPosition().lat();
        var lng = marker2.getPosition().lng();
		var place_name = document.forms["editPlaceForm"]["placename"].value;
		$.ajax({
				type: "post",
				data: {'setting': "editPlace", 'place_id':place_id, 'address': address, 'lat':lat, 'lng':lng, 'place_name': place_name, 'csrfmiddlewaretoken': getCookie('csrftoken')},
				cache: false,
				url: BASE_URL + 'settings/places/',
				dataType: "text",
				error: function (xhr, status, error) {
                    alert(xhr.responseText);
                    window.location.reload()
				},
				success: function (responseData) {
                    table.ajax.reload();
					$('#editPlaceModal').modal('hide');
					Done();
				}
			});
   		}

        function appFunctionHandler(provider) {
            if ($('.'+ provider +' .connected-app-button').text() == "SynchronizeDisconnect") {
               LoadingWithBackdrop();
               $.ajax({
					type: "post",
                    data: {csrfmiddlewaretoken: getCookie('csrftoken')},
					cache: false,
					url:  SERVER_URL + '/disconnect/' + provider,
					dataType: "text",
					error: function (xhr, status, error) {
						alert("Couldn't disconnect, try again")
					},
					success: function (response) {
						window.location.reload();
					}
				});
            }
            else {
                var url = (SERVER_URL + "/login/" +  provider);
                window.open( url, 'newwindow', 'width=500, height=500')
            }
        }

