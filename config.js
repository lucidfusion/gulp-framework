var config = {
	server: {},
	src: {},
	concat: {},
	web: {}
};

// Browsersync server settings
config.server.port 			= 3000;
config.server.proxy			= ''; // Optional: set this to a local domain vhost you created in MAMP Pro.  For example: 'local.domain.com'

// Source directories
config.src.root 		= 'src';
config.src.js			= config.src.root + '/js';
config.src.sass			= config.src.root + '/sass';
config.src.templates	= config.src.root + '/templates';
config.src.images		= config.src.root + '/images';

// Concatenated filenames
config.concat.js	 	= 'app.js';
config.concat.css		= 'app.css';

// Output (web) directories
config.web.root			= 'httpdocs';
config.web.assets		= config.web.root + '/assets'; // For Wordpress change to: config.web.root + '/wp-content/themes/yourawesometheme';
config.web.js			= config.web.assets + '/js';
config.web.css			= config.web.assets + '/css';
config.web.fonts		= config.web.assets + '/fonts';
config.web.images		= config.web.assets + '/images';
config.web.templates	= ''; // For Wordpress, change to: config.web.assets + '/';

// Automatically compress images?
config.compress = false;

module.exports = config;