define(['wildcards'], function(Wildcards) {


	window.wildcards = Wildcards.build({
		token: /%$/,
		context: {
			a: 'lalala'
		}
	});


	wildcards.card('fruits:yellow:%', function(fruit, arg1, arg2) {
		console.log( this.a + ' ' + fruit)
		console.log('arg1: ' + arg1);
		console.log('arg2: ' + arg2);
	});

	wildcards.card({
		'fruits:%': function(fruits) {
			console.log('ANY! ' + fruits);
		},
		'fruits': function() {
			console.log('aaaaallll fruits');
		}
	})
});