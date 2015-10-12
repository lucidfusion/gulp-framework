import $ from 'jquery';

export function sayHello(name = 'Ben') {
	$('#hellos').append(`<p>Hello ${name}!</p>`);
}

export function sayGoodbye(name = 'Sam') {
	$('#goodbyes').append(`<p>Goodbye ${name}!</p>`);
}

/* In ES5 this would look like:

var $ = require('jquery');

module.exports = {

	sayHello: function(name) {

		if (name === undefined) {
			name = 'Ben';
		}

		$('#hellos').append('Hello ' + name + '!');
	
	},
	
	sayGoodbye: function(name) {

		if (name === undefined) {
			name = 'Sam';
		}

		$('#goodbyes').append('Goodbye ' + name + '!');
	
	}

}

*/