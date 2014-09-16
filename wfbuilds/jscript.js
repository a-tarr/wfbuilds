$( init );

function init() {
	$.getJSON('ajax/test.json', function(data) {
	var items = [];
		$.each(data, function(key, val) {
			//i hate editing this
			items.push('<span class="mod" val="' + val.power + '" equipped="' + val.equipped + 
						'"style="background-image:url(' + val.image + ')""></span>');
		});

		$('<div/>', {
			'class': 'modList',
			html: items.join('')
		}).appendTo('.modListContainer');

		$('.mod').draggable( {
  			cursor: 'none',
  			revert: 'invalid',
  			opacity: 0.5,
  			helper: 'clone',
 		});

		$('.modbox').droppable( {
			drop: handleDropLoadout,
			out: function() {
				$(this).css('backgroundColor', 'inherit'); 
			},
		 	over: function() { 
		 		$(this).css('backgroundColor', '#404040'); 
		 	} 
		});

		$('.modList').droppable( {
			drop: handleDropList
		})

	});

}

var totalPower = 0;

function handleDropLoadout(event, ui) {
	var draggable = ui.draggable;
	var power = Number(ui.draggable.attr("val"));

	//checks if there is already a mod in that slot
	if ($(this).children().length == 0) {
		//checks if the mod has been in the loadout before and 
		//refuses to add to totalPower if true
		if (!ui.draggable.hasClass("inModList")) {
			totalPower+=power;		
		}
		ui.draggable.appendTo($(this));
		ui.draggable.addClass("inModList");
		ui.draggable.position( { of: $(this), my: 'top left', at: 'top left' } );
	} 

	$("#modValue").text("Total mod value: " + totalPower);
}

function handleDropList(event, ui) {
	var draggable = ui.draggable;
	var power = Number(ui.draggable.attr("val"));

	ui.draggable.appendTo($(this));

	//if the incoming mod comes from the loadout, subtract its value 
	//from the totalPower
	if (ui.draggable.hasClass("inModList")) {
		totalPower-=power;
		$("#modValue").text("Total mod value: " + totalPower);
	}

	ui.draggable.removeClass("inModList");
}
