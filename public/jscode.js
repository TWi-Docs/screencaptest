var URLval;
var capName = "default";
let openedWindow;

function fn1(){

//    console.log("SCREEN AVAIL HEIGHT: " + window.screen.availHeight);
//    console.log("SCREEN AVAIL WIDTH: " + window.screen.availWidth);
//    console.log("SCREEN HEIGHT: " + window.screen.Height);
//    console.log("SCREEN WIDTH: " + window.screen.Width);

    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    console.log("VIEWPORT WIDTH: " + vw);
    console.log("VIEWPORT HEIGHT: " + vh);

	// Get the value the user typed in the Input box
	capName = document.getElementById("text1").value;
	console.log("capName: " + capName);

	// Get the value the user typed in the Input box
	URLval = document.getElementById("text2").value;
	console.log("URLval: " + URLval);

	// Open that URL in a new tab
    // openedWindow = openInNewTab(URLval);
    openedWindow = window.open(URLval, '_blank');

	// Get a handle to the canvas and overlay
	let canvas = document.getElementById('canvas');
	let overlay = document.getElementById('overlay');

	// Request media
	navigator.mediaDevices.getDisplayMedia().then(stream => 
	{
		// Grab frame from stream
		let track = stream.getVideoTracks()[0];
		let capture = new ImageCapture(track);
		capture.grabFrame().then(bitmap => 
		{
			// Stop sharing
			track.stop();
			
			// Draw the bitmap to canvas
			canvas.width = bitmap.width;
			overlay.width = bitmap.width;
			canvas.height = bitmap.height;
			overlay.height = bitmap.height;
			canvas.getContext('2d').drawImage(bitmap, 0, 0);
			
			// Grab blob from canvas - We don't want to do anything with the blob
			canvas.toBlob(blob => {
				// Do things with blob here
				console.log('output blob:', blob);
			});
		});
	})
	.catch(e => console.log(e));

}

// Open URL in new tab
function openInNewTab(href) {
	Object.assign(document.createElement('a'), {
	  target: '_blank',
	  rel: 'noopener noreferrer',
	  href: href,
	}).click();
}




// Enable the user to draw a rectangle around the region on interest
// these vars will hold the starting and ending mouse positions
var startX;
var startY;
var endX;
var endY;
// var offsetX = 0;
// var offsetY = 0;

// get references to the overlay and context
var overlay = document.getElementById("overlay");
var ctx = overlay.getContext("2d");

// style the context
ctx.strokeStyle = "red";
ctx.lineWidth = 1;

// calculate where the canvas is on the window
// (used to help calculate mouseX/mouseY)
var $overlay = $("#overlay");
var overlayOffset = $overlay.offset();
// var offsetX = overlayOffset.left;
// var offsetY = overlayOffset.top;
// console.log('OVERLAY_OFFSET_Y IS: ' + offsetY)
// var docOffsetY = $(document).scrollTop();
// console.log('DOCUMENT_OFFSET_Y IS: ' + docOffsetY)

// this flag is true when the user is dragging the mouse
var isDown = false;

var startX;
var startY;
var recHeight;
var recWidth;

function handleMouseDown(e) {
    e.preventDefault();
    e.stopPropagation();

    // save the starting x/y of the rectangle
    startX = parseInt(e.pageX);
    startY = parseInt(e.pageY); // use "- offsetY" here if the overlay is offset 
    // console.log('OVERLAY_OFFSET_Y IS: ' + offsetY)

    // set a flag indicating the drag has begun
    isDown = true;

    // console.log(document.URL)
    console.log("startX is: " + startX)
    console.log("startY is: " + startY)
}

function handleMouseUp(e) {
    e.preventDefault();
    e.stopPropagation();

    // get the lower-right coords of the rect
    endX = parseInt(e.pageX);
    endY = parseInt(e.pageY);

    // calculate the width and height of the required rect
    recWidth = endX - startX
    console.log("rect width is: " + recWidth)
    recHeight = endY - startY
    console.log("rect height is: " + recHeight)

    ctx.beginPath();
    ctx.lineWidth = "1";
//    ctx.fillStyle = "green";
    ctx.strokeStyle = "red";
    ctx.rect(startX, startY, recWidth, recHeight);
    ctx.stroke();
    
    // the drag is over, clear the dragging flag
    isDown = false;
}

function handleMouseOut(e) {
    e.preventDefault();
    e.stopPropagation();

    // clear the dragging flag
    isDown = false;
}

function handleMouseMove(e) {
    e.preventDefault();
    e.stopPropagation();

    // if we're not dragging, just return
    if (!isDown) {
        return;
    }

    // get the current mouse position
    mouseX = parseInt(e.pageX);
    mouseY = parseInt(e.pageY);

    // clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // calculate the rectangle width/height based on starting vs current mouse position
    var width = mouseX - startX;
    var height = mouseY - startY;

    // draw a new rect from the start position to the current mouse position
    ctx.strokeRect(startX, startY, width, height);
}

// listen for mouse events
$("#overlay").mousedown(function (e) {
    handleMouseDown(e);
});
$("#overlay").mousemove(function (e) {
    handleMouseMove(e);
});
$("#overlay").mouseup(function (e) {
    handleMouseUp(e);
});
$("#overlay").mouseout(function (e) {
    handleMouseOut(e);
});

function rec(){
    document.getElementById("coords").value += capName + ", " + URLval + ", " + startX + ", " + startY + ", " + recWidth  + ", " + recHeight + "\n";
    openedWindow.close();     // Close the tab for the given URL
    document.getElementById("text1").value = ''; // Reset the filename box
    document.getElementById("text2").value = ''; // Reset the URL box
}

var lines;
var items;
/* function cap(){
    lines = document.getElementById("coords").value.split('\n');
    for(var i = 0;i < lines.length;i++){
        //code here using lines[i] which will give you each line
        var items = lines[i].split(",")
        for(var j = 0;j < items.length; j++){
            console.log(items[j]);
        }
    }
} */

// Get a handle to the form that has a class = "form"
const formEl = document.querySelector('.form');

// Add an event listener to listen for submit events on that form
formEl.addEventListener('submit', event => {
    event.preventDefault();                  // the default action is to open a new /process_get page 
    const formData = new FormData(formEl);   // create a FormData object
    // console.log(formData.get('coords'));  // need to convert to JSON format to sent to the server
    const data = Object.fromEntries(formData);   // first, create a normal Javascript object, then use JSON.stringify to convert to a JSON object
    // console.log('Data is: ');
    lines = data.coords.split('\n');
    console.log("lines.length is: " + lines.length);
    // items = lines.split(',');
    // console.log(items[0]);

    lines.forEach(function(line) {
        console.log("Line is: " + line);   // aaa, http:something... , 29, 309, 49, 120
        // We need it to be { coords : aaa, http...... }
        const lineObj = {coords: line};
        console.log("JSON line is:" + JSON.stringify(lineObj));

        items = line.split(',');
        console.log("File Name is: " + items[0] + ".png");
        // capName = items[0] + ".png";

        // Set up the options to make a post request of type JSON
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(lineObj)
        };

        fetch('/process_get', options)
            .then((response) => response.blob())
            .then((blob) =>{
                // Get the file name from the options as the first element of items
                let thebody = options.body;
                thebody = JSON.parse(thebody);
                console.log("coords is: " + thebody.coords);
                items = thebody.coords.split(',');
                const fileURL = URL.createObjectURL(blob);
                const fileLink = document.createElement('a');
                fileLink.href = fileURL;
                const fileName = items[0] + ".png";
                console.log(fileName);
                fileLink.setAttribute('download', fileName);
                fileLink.setAttribute('target', '_blank');
                document.body.appendChild(fileLink);
                fileLink.click();
                fileLink.remove(); 
        }); 
        // sleep(3000);
    });      // end of forEach line statement

})

function sleep(milliSeconds){
    var startTime = new Date().getTime();                    // get the current time
    while (new Date().getTime() < startTime + milliSeconds); // hog cpu until time's up
}
