![Typewriter.js](https://raw.githubusercontent.com/mwrouse/typewriter.js/master/images/typewriterjs.gif)
<hr/>
A *pure JavaScript* library that allows for easy, and customizable typewriter effects.

Coming in at under 6KB, this library is lightweight, and extremely simple!

No bullshit features or functions, just straight to the point!

[See an example](https://github.com/mwrouse/typewriter.js#example)

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
elem.typewriter('Hello, World!').start();
```
This is the most basic case for Typewriter.js, the ```.start()``` **is** required.

This would type out ```Hello, World!``` inside the ```#typewriter``` DOM Element.

### Options
To customize the script, you need to pass it options:
```javascript
var options = {
    start_delay: 3 // Delay in seconds before it starts typing
};
elem.typewriter('Hello, World!', options).start();
```
Above is an example of simple options, this script will wait three seconds, and then type ```Hello, World!```

Options is the second, and last, parameter of ```typewriter```.

Here is the full list of available options:
```
                 mode: Mode to execute the script in (Default: 1/TYPEWRITER_MODE_DEFAULT)

          start_delay: Delay (in seconds) before the script starts typing (Default: 2)
       callback_delay: Delay (in seconds) before a callback function executes (Default: 1)

          letters.tag: HTML Tag to use for letters (Default: 'span')
        letters.class: Class to use on letters (animation) (Default: 'typewriter-letter')
 letters.remove_class: Class to use for removing letters (animation) (Default: typewriter-letter-remove')

           cursor.tag: HTML tag for the cursor (Default: 'span')
         cursor.class: Class to use on the cursor (animation) (Default: 'typewriter-cursor')
cursor.no_blink_class: Class that does not blink the cursor (Default: 'typewriter-cursor-noblink')
```
Note: letters and cursor are other objects

And, here is an example of options utilizing all of these:
```javascript
var options = {
                mode: TYPEWRITER_MODE_DEFAULT,

                start_delay: 3,
                callback_delay: 1.5,

                letters: {
                          tag: 'span',
                        class: 'letter',
                  remove_class: 'letter-remove'
                },

                 cursor: {
                           tag: 'span',
                         class: 'cursor',
                  no_blink_class: 'cursor-no-blink'
                 },
        };
```

### Script Modes
Typewriter.js has four distinct modes that you can run in, DEFAULT, CORRECTION, and ARRAY.
Each one has different traits, and requires that you format the first parameter of ```typewriter``` differently.

Here are some helper constants for you to remember the modes, and their integer values:
```
TYPEWRITER_MODE_DEFAULT => 0
TYPEWRITER_MODE_CORRECTION => 1
TYPEWRITER_MODE_ARRAY => 2
```

#### Default Mode (0)
The default mode, as its name implies, is the default/automatic mode that Typewriter.js will run under.

This mode requires that a ```string``` be the first parameter of typewriter, here is a script that runs in DEFAULT MODE:

```javascript
elem.typewriter('This is mode 0, or the default mode').start();
```

#### Correction Mode (1)
Correction mode, as its name also implies, allows you to generate a spelling correction.

The first parameter now needs to be an ```array of strings```, with the first element being the incorrect version, and the second element being the corrected version. You will need to specify the mode in the options.

```javascript
elem.typewriter(['This was typedasdf in mode 1.', 'This was typed in mode 1.'], { mode: TYPEWRITER_MODE_CORRECTION }).start();
```
Which produces the following:

![Typewriter.js Correction example](https://raw.githubusercontent.com/mwrouse/typewriter.js/master/images/correction.gif)


#### Array Mode (2)
Array allows you to display multiple messages, one after another, as well as making corrections!

```javascript
elem.typewriter(['This is the first sentence.', ['This is the secnd sentence', 'This is the second sentence']], { mode: TYPEWRITER_MODE_ARRAY }).start();
```
Which produces the following:

![Typewriter.js Array example](https://raw.githubusercontent.com/mwrouse/typewriter.js/master/images/array.gif)


### Callback Function
If you need to perform a task when the typing is finished, pass a function as the second parameter to ```typewriter()```
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

![Typewriter.js Demo](https://raw.githubusercontent.com/mwrouse/typewriter.js/master/images/demo.gif)

## License
Distributed under the [MIT License](https://raw.githubusercontent.com/mwrouse/typewriter.js/master/LICENSE).
