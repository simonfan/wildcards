define(['wildcards'], function(Wildcards) {

/*
	options: {
		delimiter: ':',
		token: '*',
		tokenRegExp: /\*.* /,
		itemAlias: 'item',
		tokenAlias: 'tokens',
		context: undefined
	}
*/

	window.wildcards = Wildcards.build({
		itemAlias: 'func',
		tokenAlias: 'fruits',
		context: {
			a: 'lalala'
		}
	});


	wildcards.card('fruits:yellow:*', function(fruit, arg1, arg2) {
		console.log( this.a + ' ' + fruit)
		console.log('arg1: ' + arg1);
		console.log('arg2: ' + arg2);
	});

	wildcards.card({
		'fruits:*': function(fruits) {
			console.log('ANY! ' + fruits);
		},
		'fruits': function() {
			console.log('aaaaallll fruits');
		},
		'*': function() {
			console.log('absolutey anything')

			return 'aaa';
		}
	});

	var filter = function(item) { console.log(item); return typeof item === 'function' };
	wildcards.exec('fruits:yellow:abacaxi', filter, ['one','two']);
});