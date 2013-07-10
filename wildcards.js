define(['buildable','underscore'], function(Buildable, undef) {

	// Array of patterns ordered by pattern priority
	var PATTERNS = [
		{
			name: 'fixed:*anything',
			regexp: /^.+:\*$/,
		//	example: 'place:*',

			// function receives the name of the card and returns a 
			// regexp capable of matching it against any string
			buildRegexp: function(name) {
				return new RegExp('^' + name.replace(/\*$/,'') + '.*$' );
			},
			tokens: function(str, card) {
				var separator = card.separator || ':',
					substr = str.split(':')[1],
					tokens = substr.split(separator);
				return tokens;
			}
		},
		{
			name: '*anything',
			regexp: /^\*$/,
		//	example: '*',
			buildRegexp: function(name) {
				return /.+/;
			},
			tokens: function(str, card) {
				var separator = card.separator || ':',
					substr = str.split(':')[1],
					tokens = substr.split(separator);

				return tokens;
			}
		}
	];

	var Wildcards = Object.create(Buildable);
	Wildcards.extend({

		init: function(options) {
			_.bindAll(this, 'card');

			this.cards = {};
		},

		card: function(card) {
			/*
				card: {
					name: string,
					callback: function,
					context: object,
					separator: string
				}
			*/

			if (_.isArray(card)) {
				return _.each(card, this.card);
			} else {
				//////////////////////////////////
				/// 1: try to match a pattern ////
				//////////////////////////////////
				var pattern = _.find(PATTERNS, function(pattern, index) {
					return pattern.regexp.exec(card.name);
				});

				if (!pattern) {
					throw new Error('No pattern for this type of card. Visit documentation for more info.')
				}

				this.cards[ pattern.name ] = this.cards[ pattern.name ] || [];
				this.cards[ pattern.name ].push(
					_.extend(card, { regexp: pattern.buildRegexp(card.name) }) 
				);

				return this;
			}

		},

		match: function(string) {

			var _this = this,
				pattern = false,
				rescard = false;

			// loop according to the order defined in the PATTERNS array
			pattern = _.find(PATTERNS, function(pattern, index) {

				// inside a card pattern group, loop according to the order of addition
				rescard = _.find(_this.cards[ pattern.name ], function( card, index ) {
					return card.regexp.exec(string);
				});

				return rescard;
			});

			if (pattern && rescard) {
				var tokens = pattern.tokens(string, rescard)
				return rescard.callback.apply(rescard.context, tokens);
			}
		},
	});

	return Wildcards;
});