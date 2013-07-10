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

		retrieve: function(str, original) {
			var _this = this,
				original = original || str,
				aliases = this.aliases,
				res;

			// try to retrieve directly by name
			if (this.cards[ str ]) {
				if (this.cards[ str ]) {
					res = {};

					res[ aliases.item ] = this.cards[ str ];
					res[ aliases.token ] = original.replace(str,'').split(this.delimiter);
				}

			} else {
				// remove the last portion of the string
				str = str.split(this.delimiter);
				str = _.compact(str).slice(0, str.length -1);	// remove empty strings and the last

				if (str.length > 0) {
					// RECURSIVE
					str = str.join(this.delimiter) + this.delimiter;

					return this.wild('retrieve', str, original);

				} else {
					// as a last resource, check if there is a 'anything' card
					// which should be named by the tokenRegExp itself
					if (this.cards[ this.token.str ]) {
						res = {};
						res[ aliases.item ] = this.cards[ this.token.str ];
						res[ aliases.token ] = [original];
					}
				}
			}

			return res;
		},

		exec: function(str) {
			var retrieved = this.wild.apply(this, ['retrieve', str]),
				args = _.args(arguments, 1),
				aliases = this.aliases;

			return (retrieved && typeof retrieved[ aliases.item ] === 'function') ? 
				retrieved[ aliases.item ].apply(this.context, retrieved[ aliases.token ].concat(args)) : retrieved;
		}
	};


	var Wildcards = Object.create(Buildable);
	Wildcards.extend({

		init: function(options) {
			// alerts
			if ((!options.token && options.tokenRegExp) || (options.token && !options.tokenRegExp)) {
				throw new Error('Wildcards: you must set either both tokenRegExp and token or neither one.');
			}

			_.bindAll(this, 'card','wild');

			this.delimiter = options.delimiter || ':';

			this.token = {
				str: (options.token && options.tokenRegExp) ? options.token : '*',
				regexp: (options.token && options.tokenRegExp) ? options.tokenRegExp : /\*.*/,
			}

			this.aliases = {
				item: options.itemAlias || 'item',
				token: options.tokenAlias || 'tokens',
			};

			this.context = options.context;

			this.cards = {};
		},

		wild: function(method) {
			var args = _.args(arguments, 1);
			return wild[ method ].apply(this, args);
		},

		card: wild.card,
		retrieve: wild.retrieve,
		exec: wild.exec
	});

	return Wildcards;
});