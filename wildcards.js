define(['buildable','underscore'], function(Buildable, undef) {

	var wild = {
		card: function(name, obj) {
			if (typeof name === 'object') {
				var _this = this;
				_.each(name, function(obj, name) {
					_this.wild('card', name, obj);
				});

			} else {
				// remove the tokenRegExp part
				var path = (name === this.token.str) ? name : name.replace(this.token.regexp,'');

				// save the card
				this.cards[ path ] = obj;
			}

			return this;
		},

		retrieve: function(str, filter, original) {
			var original = original || str,		// the original string. if not set, defaults to the string passed
				aliases = this.aliases,
				filter = filter || function() { return true },
				res = {};

			res[aliases.item] = this.cards[ str ];
			res[aliases.token] = original.replace(str,'');

			if (this.token.delimiter) {
				res[ aliases.token ] = res[ aliases.token ].split(this.token.delimiter);
			}

			// 1: if the item is not set
			// 2: if the filter is a function AND the filter returns false
			if (typeof res[aliases.item] === 'undefined' || !filter(res) ) {

				////////////////////////////////////
				// remove last part of the string //
				////////////////////////////////////
				str = this.wild('_cutString', str);

				// if there is still a string 
				if (str) {
					// go recursive
					return this.wild('retrieve', str, filter, original);

				} else if (this.cards[ this.token.str ]) {
					//////////////////////////////
					////// LAST RESOURCE /////////
					//////////////////////////////
					// as a last resource, check if there is a 'anything' card
					// which should be named by the tokenRegExp itself
					res[aliases.item] = this.cards[ this.token.str ];
					res[aliases.token] = original;
				}
			}

			return ( res[aliases.item] && filter(res) ) ? res : false;
		},

		// remove the last portion of the string
		_cutString: function(str) {
			str = _.compact( str.split(this.delimiter) );				// remove empty strings and the last
			str = str.slice(0, str.length -1);

			if (str.length > 0) {
				return str.join(this.delimiter) + this.delimiter;
			} else {
				return false;
			}
		},

		exec: function(str, filter, args) {
			var retrieved = this.wild.apply(this, ['retrieve', str, filter]),
				args = _.isArray(args) ? args : [];

			if (retrieved) {
				var aliases = this.aliases,
					token = retrieved[ aliases.token ],
					item = retrieved[ aliases.item ];

				if (token) {
					if (_.isArray(token)) {
						args = token.concat(args);
					} else {
						args.unshift(token);
					}
				}

				return typeof item === 'function' ? item.apply(this.context, args) : retrieved;
			} else {
				return false;
			}
		}
	};


	var Wildcards = Object.create(Buildable);
	Wildcards.extend({

		init: function(options) {
			options = options || {};

			// alerts
			if ((!options.token && options.tokenRegExp) || (options.token && !options.tokenRegExp)) {
				throw new Error('Wildcards: you must set either both tokenRegExp and token or neither one.');
			}

			_.bindAll(this, 'card','wild');

			this.delimiter = options.delimiter || ':';

			this.token = {
				str: (options.token && options.tokenRegExp) ? options.token : '*',
				regexp: (options.token && options.tokenRegExp) ? options.tokenRegExp : /\*.*/,
				delimiter: options.tokenDelimiter || false,
			}

			this.aliases = {
				item: options.itemAlias || 'item',
				token: options.tokenAlias || 'token',
			};

			this.context = options.context;

			// CARDS HASH
			this.cards = {};
		},

		wild: function(method) {
			var args = _.args(arguments, 1);
			return wild[ method ].apply(this, args);
		},

		card: wild.card,
		retrieve: wild.retrieve,
		match: wild.retrieve,
		exec: wild.exec
	});

	return Wildcards;
});