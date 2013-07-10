define(['wildcards'], function(Wildcards) {


	window.wildcards = Wildcards.build({
		token: /%$/,
		context: {
			a: 'lalala'
		}
	});


	wildcards.card('fruits:yellow:%', function(fruit) { console.log( this.a + ' ' + fruit)} );

	wildcards.card({
		'fruits:%': function(fruits) {
			console.log('ANY! ' + fruits);
		},
		'fruits': function() {
			console.log('aaaaallll fruits');
		}
	})
});