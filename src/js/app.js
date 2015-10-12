import $ from 'jquery';
import { sayHello, sayGoodbye } from './example';

const missing = undefined;
let names = [missing, 'Kym'];

$(document).ready(function() {
	$('#es6').html(`
	<p><b>ES6 with babel, browserify, sourcemaps, etc. is working including</b>:</p>
	<ol>
		<li>new module import syntax (import <name> from <file>)</li>
		<li>new module export syntax (export <type> <name>)</li>
		<li>destructuring { } variables</li>
		<li>new variable declarations (let, const)</li>
		<li>.map() function</li>
		<li>arrow => functions</li>
		<li>default function parameter</li>
		<li>\`backticks\`</li>
	</ol>
	<p>Now time for some random hellos and goodbyes from a custom module in <i>./src/js/example.js</i>:</p>
	`);

	names.map((name) => sayHello(name));
	names.map((name) => sayGoodbye(name));
});


/* In ES5 this would look like:

var $ = require('jquery');
var example = require('./example');

var missing = undefined;
var names = [missing, 'Kym'];

$(document).ready(function() {
	var html  = '<p>A bunch of shit on different lines.</p>';
		html += '<ol>';
		html += '	<li>new module import syntax (import <name> from <file>)</li>';
		// ...you get the idea
		html += '</ol>';
		html += '<p>Now time for some random hellos and goodbyes from a custom module:</p>';
	$('#es6').html(html);

	names.forEach(function(name) {
		example.sayHello(name);
	});
	names.forEach(function(name) {
		example.sayGoodbye(name);
	});
});

*/