![Typewriter.js](https://raw.githubusercontent.com/mwrouse/typewriter.js/master/images/typewriterjs.gif)
<hr/>
A JavaScript library that allows for easy, and customizable typewriter effects.

## Usage
Typewriter.js is a simple library, works on zero customization, but is also very customizable.

To begin, a basic scenario:
```html
<div id="typewriter"></div>
```
This is the element that we want our typewriter effect to happen in.


You need to pair this with the following JavaScript:
```javascript
var elem = document.getElementById('typewriter');
Typewriter(elem).start();
```
This is the most basic case for Typewriter.js, the ```.start()``` **is** required.


### Options
To customize the script, you need to pass it options, the options is also how you tell the script what to type.
```javascript
var options = {
  content: 'Hello, World!', // What the script will type
    delay: 3                // Delay in seconds before it starts typing
};
Typewriter(elem, options).start();
```
Above is an example of simple options, this script will wait three seconds, and then type ```Hello, World!```

Options, is the second parameter of ```Typewriter```.

Here is the full list of available options:
```
              content: The string that you want to type
                delay: Delay (in seconds) before the script starts typing 
    
          letters.tag: HTML Tag to use for letters
        letters.class: Class to use on letters (animation)
  letters.removeClass: Class to use for removing letters (animation)
  
           cursor.tag: HTML tag for the cursor
         cursor.class: Class to use on the cursor (animation)
  cursor.noBlinkClass: Class that does not blink the cursor
   
        callbackDelay: Delay (in seconds) before the callback function is called
```
Note: letters and cursor are other objects

And, here is an example of options utilizing all of these:
```javascript
var options = {
                content: 'Hello, World!',
                  delay: 2,
                
                letters: {
                          tag: 'span',
                        class: 'letter',
                  removeClass: 'letter-remove'
                },
                
                 cursor: {
                           tag: 'span',
                         class: 'cursor',
                  noBlinkClass: 'cursor-no-blink'
                 },
                
          callBackDelay: 1.5
        };
```

### Callback Function 
If you need to perform a task when the typeing is finished, pass a function as the third parameter to ```Typewriter()```
```javascript
Typewriter(elem, options, function(){
  console.log('Callback Function');
}).start();
```
The callback function will **only be called once**. 


### Helper Functions
If you prefer to not use parameters to set the options and/or the callback function, you can use predefined helper functions to this for you:
```javascript
Typewriter(elem).setOptions(options).setCallback(function(){
  console.log('Callback Function');
}).start();
```

Similarly, you can use the ```setContent()``` helper function to set the options.content value.
```javascript
Typewriter(elem).setOptions(options).setCallback(function(){
  console.log('Callback Function');
}).setContent('This is what will be displayed').start();
```
There is no helper function for setting the element, that must be passed by parameter.
