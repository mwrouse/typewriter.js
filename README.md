![Typewriter.js](https://raw.githubusercontent.com/mwrouse/typewriter.js/master/images/typewriterjs.gif)
<hr/>
A JavaScript library that allows for easy, and customizable typewriter effects.

Coming in at under 5KB (minified version), this library is super light weight, and extremely simple! No bullshit features or functions, just straight to the point!

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
elem.typewriter().start();
```
This is the most basic case for Typewriter.js, the ```.start()``` **is** required.


### Options
To customize the script, you need to pass it options, the options is also how you tell the script what to type.
```javascript
var options = {
  content: 'Hello, World!', // What the script will type
    delay: 3                // Delay in seconds before it starts typing
};
elem.typewriter(options).start();
```
Above is an example of simple options, this script will wait three seconds, and then type ```Hello, World!```

Options, is the first parameter of ```typewriter```.

Here is the full list of available options:
```
              content: The string that you want to type (Default: 'I have no clue what to type')
                delay: Delay (in seconds) before the script starts typing (Default: 2)
    
          letters.tag: HTML Tag to use for letters (Default: 'span')
        letters.class: Class to use on letters (animation) (Default: 'typewriter-letter')
  letters.removeClass: Class to use for removing letters (animation) (Default: typewriter-letter-remove')
  
           cursor.tag: HTML tag for the cursor (Default: 'span')
         cursor.class: Class to use on the cursor (animation) (Default: 'typewriter-cursor')
  cursor.noBlinkClass: Class that does not blink the cursor (Default: 'typewriter-cursor-noblink')
   
        callbackDelay: Delay (in seconds) before the callback function is called (Default: 1)
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
If you need to perform a task when the typeing is finished, pass a function as the second parameter to ```typewriter()```
```javascript
elem.typewriter(options, function(me){
  console.log('Callback Function');
}).start();
```
The callback function will **only be called once**. 
It is recommended that your callback functions have the first parameter as a way to reference ```this```, or point to ```typewriter()```.
You can also specify the callback function in the ```.start()``` function:
```javascript
elem.typewriter().setContent('I love Yodeling').start(function(me){
  console.log('Callback function executed');
});
```

### Helper Functions
If you prefer to not use parameters to set the options and/or the callback function, you can use predefined helper functions to this for you:
```javascript
elem.typewriter().setOptions(options).setCallback(function(me){
  console.log('Callback Function');
}).start();
```
Similarly, you can use the ```setContent()``` helper function to set the options.content value.
```javascript
elem.typewriter().setOptions(options).setCallback(function(me){
  console.log('Callback Function');
}).setContent('This is what will be displayed').start();
```



### Backspacing
To generate a backspace effect, you'll need to chain a couple of callback functions.
```javascript
elem.typewriter({content: 'Typewriter.py'}, function(me){
  // First backspace
  me.backspace(function(me){
    // Second backspace
    me.backspace(function(me){
      me.setContent('js').startNoDelay(); // Make correction
    });
  });
}).start();
```
The ```.startNoDelay()``` function is the exact same as ```.start()``` except it will not wait for the delay specified in options.

This will yield the following: 
```
T
Ty
Typ
Type
Typew
Typewr
Typewri
Typewrit
Typewrite
Typewriter
Typewriter.
Typewriter.p
Typewriter.py
Typewriter.p
Typewriter.
Typewriter.j
Typewriter.js
```

### Erasing 
Using the erase function will erase the entire string that has been typed out, as seen in the gif at the top of this README
```javascript
elem.typewriter({content: 'Typewriter.js'}, function(me){
  // First backspace
  me.erase(function(me){
    console.log('erase callback function');
  });
}).start();
```

## CSS Animations 
This script utilizes the ```animationend``` event listner to trigger typing the next letter(s), as well as callback functions on the last letters. Therefore, if you want to speed up the typing or backspacing, simply increase the animation duration on your css classes for the ```letters.removeClass``` and ```letters.class``` CSS classes.
Likewise, to speedup these actions, slow down the animation durations.



## Example 
View an example on [CodePen](http://codepen.io/mwrouse/full/PNpmbd)


## License 
Distributed under the [MIT License](https://raw.githubusercontent.com/mwrouse/typewriter.js/master/LICENSE).
