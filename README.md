gulp-framework
============
#####Lucid Fusion's gulp automation framework designed for Node 4 with full support for ExpressionEngine and WordPress.
This is a temporary repo that will soon be replacing SlabJS as version 1.0.  **This is a complete rewrite.** A significant amount of bloat, bugs, and other issues with SlabJS have been removed as a result.

#####How to use this
If you haven't already, do yourself a favor and install **nvm** and use it to install **Node 4**:

1. `curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.29.0/install.sh | bash`
2. `nvm install node && nvm alias default node`

**To install the framework**:

1. [Download](https://github.com/lucidfusion/gulp-framework/archive/master.zip) the contents of this repo to a new project folder
2. `cd yourAwesomeProject`
3. `npm install`
4. `gulp setup` to automatically set up your web root and install compass, bootstrap, & font awesome
5. *Optional:* configure a proxy domain in `./config.js` if using MAMP Pro or similar.
6. `gulp` to launch the BrowserSync server

By default your source folder will be `./src` and your web root will be served from `./httpdocs`.  You can change these (and more) in `./config.js`.

#####What's included
* ES6 with Babel and sourcemaps
* Browserify (ES6 import your JS right on to the front-end)
* BrowserSync
* Sass + Compass (libSass, not sloooooow Ruby Sass)
* UglifyJS (for production)
* MinifyCSS (for production)
* Imagemin (png, jpg, and gif lossless compression)
* Bootstrap latest (3.3.5)
* Font Awesome latest (4.4.0)

#####New features
* **Full ES6 support.** With babel for use in your front-end JS using Browserify.
* **Automatic image compression.**  As images are added to your source directory, they are automatically compressed and piped to your web assets folder.

#####Significant improvements
* npm installs should no longer hang or fail with build errors.
* Adding files to certain folders will no longer break the BrowserSync server and require a restart.
* Strange bugs with tasks running out of order are gone.  For simplicity, the gulp tasks are now in one relatively simple file instead of being spread over 20 different task files in a gulp folder.
* Full compatibility with ExpressionEngine, Wordpress, and any other CMS without symlink hacks.  Just modify the super simple **config.js**.

#####Removals
* Handlebars (and any other templating language) has been removed.  If we feel we actually will use this in the future we'll bring it back.  For now it's unnecessary bloat.
* Google Analytics and Google Fonts injection has been removed.  If this actually helped you please let me know and we can add it back in.  The implementation of this directly conflicted with CMS or other back-end systems that use headers and footers and it didn't save much time for static sites anyway.
* Automatic SVG font generation has been removed, not because it wasn't wanted, but because it wasn't working very well.  When we have time to make it work well we can bring it back.