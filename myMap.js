$(function(){
	// 1 = TotalRenewable; 2 = Wind; 3 = Solar; 4 = Geothermal; 5 = Hydro; 6 = Biomass; 7 = Nuclear;
	var datasets = ["lib/data/TotalRenewable.json","lib/data/RenewableMinusEthanol.json","lib/data/Wind.json","lib/data/Solar.json","lib/data/Geothermal.json","lib/data/Hydro.json","lib/data/Biomass.json","lib/data/Nuclear.json"]
	// Index for what dataset we're using
	var count = 0;
	var totalEnergyUsage = {};
	var adata = {};
	

	$.ajax({
  url: "lib/data/TotalEnergy.json",
  dataType: 'json',
  async: false,
  data: {},
  success: function(filedata) {
		var firstLoop = 0;
		arrayOfObjects = filedata.allData;
		for (var i = 0; i < arrayOfObjects.length; i++) {
			var object = arrayOfObjects[i];
			if (firstLoop == 0) {
				
				for (var k=0; k<arrayOfObjects[i].data.length; k++) {
					yearData = arrayOfObjects[i].data[k];
					totalEnergyUsage[yearData[0]] = {};
					totalEnergyUsage[yearData[0]].areas = {};
				}
				firstLoop = 1;
			}
			for (var j = 0; j<arrayOfObjects[i].data.length; j++) {
				yearData = arrayOfObjects[i].data[j];
				//alert(data.toSource());
				totalEnergyUsage[yearData[0]].areas[arrayOfObjects[i].state] = {
					"value": yearData[1],
					"tooltip": {                     "content": yearData[0]+"<br /> Energy Usage: "+yearData[1]}
				};
			}
		}
  }
});

	function initMap (aDataset) {
		//alert(datasets[aDataset]);
		loadThis = datasets[aDataset];
			$.ajax({
  url: loadThis,
  dataType: 'json',
  async: false,
  data: {},
  success: function(filedata) {
		var firstLoop = 0;
		arrayOfObjects = filedata.allData;
		for (var i = 0; i < arrayOfObjects.length; i++) {
			var object = arrayOfObjects[i];
			if (firstLoop == 0) {
				
				for (var k=0; k<arrayOfObjects[i].data.length; k++) {
					yearData = arrayOfObjects[i].data[k];
					adata[yearData[0]] = {};
					adata[yearData[0]].areas = {};
				}
				firstLoop = 1;
			}
			for (var j = 0; j<arrayOfObjects[i].data.length; j++) {
				yearData = arrayOfObjects[i].data[j];
				totalData = totalEnergyUsage[yearData[0]].areas[arrayOfObjects[i].state].value;
				adata[yearData[0]].areas[arrayOfObjects[i].state] = {
					"value": (yearData[1]/totalData)*100,
					"tooltip": {                     "content": filedata.name+"<br /> "+yearData[0]+"<br /> Energy Source Usage: "+yearData[1]+ " " +arrayOfObjects[i].units + "<br /> Percentage: " + Math.round((((yearData[1]/totalData)*100)*100))/100}
				};
			}
		}
  }
});
	};
			initMap(count);
	
document.onkeydown = checkKey;

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '38') {
        // up arrow
        if ( count < 8) {
        count++;
        initMap(count);
        $(".maparea").trigger('update', [adata[2009], {}, {}, {animDuration : 300}]);
	}
    }
    else if (e.keyCode == '40') {
        // down arrow
                if ( count > 0) {
        count--;
        initMap(count);
        $(".maparea").trigger('update', [adata[2009], {}, {}, {animDuration : 300}]);
	}
    }
}

	// Knob initialisation (for selecting a year)
	$(".knob").knob({
		release : function (value) {
			$(".maparea").trigger('update', [adata[value], {}, {}, {animDuration : 300}]);
		}
	});

	// Example #7
	//$maparea = $(".maparea");
	$(".maparea").mapael({
		map : {
			name : "usa_states",
			defaultArea: {
				attrs : {
					fill: "#000",
					stroke : "#ffffff",
					"stroke-width" : 0.3
				}
			},
		},
			legend : {
			area : {
				display : true,
				title :"Country population", 
				marginBottom : 7,
				slices : [
					{
						max :5, 
						attrs : {
							fill : "#839cfc"
						},
						label :"Less than 5 percent"
					},
					{
						min :5, 
						max :10, 
						attrs : {
							fill : "#6e8bfc"
						},
						label :"Between 5 and 10 percent"
					},
					{
						min :10, 
						max :15, 
						attrs : {
							fill : "#587afc"
						},
						label :"Between 10 and 15 percent"
					},
					{
						min :15, 
						max :20, 
						attrs : {
							fill : "#4368fc"
						},
						label :"Between 15 and 20 percent"
					},
					{
						min :20, 
						max :25, 
						attrs : {
							fill : "#2e57fc"
						},
						label :"Between 20 and 25 percent"
					},
					{
						min :25, 
						max :30, 
						attrs : {
							fill : "#1846fc"
						},
						label :"Between 25 and 30 percent"
					},
					{
						min :30, 
						attrs : {
							fill : "#0335fc"
						},
						label :"More than 30 percent"
					}
				]
			}
			},
					areas: adata[2009]['areas'] 
					});
});
