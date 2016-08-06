#Url2PDF#
---
*Grab a URL and convert the HTML to PDF using PhantomJS for better rendering*

## Installation ##
    npm install url2pdf --save

## Usage ##

###Simple

```javascript
    var url2pdf = require("url2pdf");

    url2pdf.renderPdf("http://www.google.com")
    	.then(function(path){
	    	console.log("Rendered pdf @", path);
    	});
```

###In Express route as a download

```javascript
    var url2pdf = require("url2pdf");

    function myRoute(req, res){
        url2pdf.renderPdf(url)
            .then(function (path) {
                res.sendFile(path);
            })
            .catch(function(err){
                res.status(500).json(err);
            })
    }
```


### PDF From HTML String
So you have made your html in Jade etc and now you want to just turn it into a PDF without creating a whole website
just for this purpose? Easy! Just do as below:

```javascript
    var url2pdf = require("url2pdf");
    url2pdf.renderFromHTML("<html><body><h1>HELLO WORLD</h1></body></html>")
    	.then(function(path){
	    	console.log("Rendered pdf @", path);
    	});
```

### Configuration options
You can set the configuration options globally by editing the `url2pdf.opts` object. The default settings are shown below

```javascript
    {
      paperSize: {format: "A4", orientation: 'portrait', margin: '1cm'},
      saveDir: path.join(__dirname, "pdfTemp"), // path for temporary files
      idLength: 30 // file ID length; adjust to avoid conflicts or just get smaller filenames
      loadTimeout: 800, // in ms; time for rendering the page
    };
```

If you want to just edit the settings for one render, you can do this by passing in just the object fields
you want to change as the second argument:

```javascript
    url2pdf.renderPdf("http://www.google.com", {paperSize: {orientation: "landscape"}});
```

#### Cleanup
url2pdf comes with an auto cleanup function that will scan files in your temp directory and delete old ones as necessary.
This is optional and should be used at your own risk (ie don't point the temp directory anywhere stupid!);

To use it call the following function, passing in the age in *seconds* you would like to delete

```javascript
    url2pdf.cleanUp(5); // clean up all files older than 5 seconds
```

#### Fonts/Page Too large?
There is a problem with PhantomJS related to this very long thread:
https://github.com/ariya/phantomjs/issues/12685

This is the hacky workaround for the moment:

```css
    html {
        zoom: 0.55; /*workaround for phantomJS2 rendering pages too large*/
    }
```


### Known bugs
There is a problem with rendering images when using HTML render mode. I'm pretty sure it has to do with the images still
being prepared by PhantomJS when the callback happens but haven't managed to get to the bottom of it yet. Any help
would be much appreciated! See the example.js for demo.

### Tests
Don't really have unit tests. To test it out you can run `node example.js` which is what is used to make sure its all
clicking together. If you are contributing code - at the very least run it to make sure it all seems ok
