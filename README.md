# [HEVEL](website-url)
Module Routine for Frontend files, integrating [Headstart](http://headstart.io/) with [Laravel](http://laravel.com/) (strait forward),
creating Laravel structure from frontend exporting.


## What this do

* Creates the 'routes.php' file with all the template name's, and place this file inside '/app' folder (after this, you must correctly rename the file);
* Moves all the files to '/public' folder;
* Moves partials, layout folder's' and files to '/app/views';
* Read all files contents and change the {{< layout/header }} to @include('layout/header');
* Rename all '.html' files to '.blade.php';


### Preparing the Templates

Move this inject parts to your individual pages.

```
<!-- inject:css --><!-- endinject -->

<!-- inject:js --><!-- endinject -->
```

Can't have targeted individual pages like this
{{#equal templateName 'your-page.html'}}, because the 'assemble_templates' is gona be false for production.

After this, test your frontend to see if works fine!


### Changing the 'config.json' file

My 'config.json', minifyHTML to false, w3c to false, assemble_templates to false, combineMediaQueries to false.
```
{
	"browser": "Google Chrome",
	"editor": "Sublime Text",
	"minifyHTML": false,
	"htmlminOptions" : {
        "removeComments":                true,
        "collapseWhitespace":            false,
        "preserveLineBreaks":			 false,
        "conservativeCollapse":			 false, 
        "collapseBooleanAttributes":     false,
        "removeAttributeQuotes":         false,
        "useShortDoctype":               false,
        "removeScriptTypeAttributes":    false,
        "removeStyleLinkTypeAttributes": false,
        "minifyJS":                      true,
        "minifyCSS":                     true
    },
	"combineMediaQueries": false,
	"hint": true,
	"w3c": false,
	"export_assets": "export",
	"export_templates": "export",
	"export_misc": "export",
	"assemble_templates": false,
	"template_asset_prefix": "",
	"revisionCaching":false
}
```

### Make the production of all pages and assets.

headstart build --production


### Final structure after export production
```
export
	------assets
			-----css
			-----images
			-----js
			-----...others
	------partials
	------layout
	index.html
	...other html files and misc
```
	
Copy contents from 'export' folder to 'hevel_files' folder inside your hevel installation!

Run the hevel module, and verify the 'laravel_export', after this, copy the contents of 'laravel_export' to your laravel project.
