define(['buildable','underscore'], function(Buildable, undef) {

	var wild = {
		card: function(name, obj) {
			if (typeof name === 'object') {
				var _this = this;
				_.each(name, function(obj, name) {
					_this.wild('card', name, obj);
				});

			} else {
				// remove the token part
				var path = name.replace(this.token,'');

				// save the card
				this.cards[ path ] = obj;
			}

			return this;
		},

		retrieve: function(str, original) {
			var _this = this,
				original = original || str;

			// try to retrieve directly by name
			if (this.cards[ str ]) {
				if (this.cards[ str ]) {
					return {
						item: this.cards[ str ],
						tokens: original.replace(str,'').split(this.delimiter)
					};
				}

			} else {
				// remove the last portion of the string
				str = str.split(this.delimiter);
				str = _.compact(str).slice(0, str.length -1);	// remove empty strings and the last

				if (str.length > 0) {
					str = str.join(this.delimiter) + this.delimiter;

					console.log(str);
					return this.wild('retrieve', str, original);
				} else {
					return undefined;
				}
			}
		},

		exec: function(str) {
			var retrieved = this.wild.apply(this, ['retrieve', str]),
				args = _.args(arguments, 1);

			return (typeof retrieved.item === 'function') ? 
				retrieved.item.apply(this.context, retrieved.tokens.concat(args)) : retrieved;
		}
	};


	var Wildcards = Object.create(Buildable);
	Wildcards.extend({

		init: function(options) {
			_.bindAll(this, 'card');

			this.delimiter = options.delimiter || ':';

			this.token = options.token || /\*.*/;

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