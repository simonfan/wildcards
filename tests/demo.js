define(['wildcards'], function(Wildcards) {


	window.wildcards = Wildcards.build();

	wildcards.card([
		{
			name: 'place:*',
			callback: function(place) { alert('place ' + place); }
		},
		{
			name: 'time:*',
			callback: function(time) { alert('about time ' + time); }
		}
	]);

	wildcards.card({
		name: '*',
		callback: function(anything) { alert('anything ' + anything) }
	});

});