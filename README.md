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

#### setOptions method
If you prefer to not pass options as a parameter of ```typewriter```, then the ```setOptions``` method exists to set options:
```javascript
elem.typewriter('Hello, World!').setOptions(options).start();
```

#### setContent method
Similarly, the ```setContent``` method allows you to set the text to type:
```javascript
elem.typewriter().setContent('Hello, World!').start();
```
The ```setContent``` method is *extremely* useful when typing more stuff in callback functions.


### Script Modes
Typewriter.js has three modes that you can use, ```DEFAULT```, ```CORRECTION```, and ```ARRAY```.

Each one allows for bigger and better typewriting effects, and requires that you format the first parameter of ```typewriter``` differently.

Here are some helper constants for you to remember the modes, and their integer values:
```
TYPEWRITER_MODE_DEFAULT => 0
TYPEWRITER_MODE_CORRECTION => 1
TYPEWRITER_MODE_ARRAY => 2
```

#### Default Mode (0)
The default mode, as its name implies, is the default/automatic mode that Typewriter.js will run under.

This mode requires that a ```string``` be the first parameter of ```typewriter```, here is a script that runs in ```DEFAULT MODE```:

```javascript
elem.typewriter('This is mode 0, or the default mode').start();
```
Which produces the following:

![Typewriter.js Default example](https://raw.githubusercontent.com/mwrouse/typewriter.js/master/images/default.gif)



#### Correction Mode (1)
Correction mode, as its name also implies, allows you to generate a spelling correction.

The first parameter now needs to be an ```array of strings```, with the first element being the incorrect version, and the second element being the corrected version. You will need to specify the mode in the options.

```javascript
elem.typewriter(['This was typedasdf in mode 1.', 'This was typed in mode 1.'],
  { mode: TYPEWRITER_MODE_CORRECTION }).start();
```
Which produces the following:

![Typewriter.js Correction example](https://raw.githubusercontent.com/mwrouse/typewriter.js/master/images/correction.gif)

Only the first two elements will be used, if you have more than two elements, they will not be used, see the ```TYPEWRITER_MODE_ARRAY``` mode.


#### Array Mode (2)
Array allows you to display multiple messages, one after another, as well as making corrections!

The first parameter must be an ```array```, which can have ```array``` or ```string``` elements.

```javascript
elem.typewriter(['This is the first sentence.', ['This is the secnd sentence', 'This is the second sentence']],
  { mode: TYPEWRITER_MODE_ARRAY }).start();
```
Which produces the following:

![Typewriter.js Array example](https://raw.githubusercontent.com/mwrouse/typewriter.js/master/images/array.gif)


### Callback Function
There are two ways to execute callback functions:

Using the ```setCallback``` method:
```javascript
elem.typewriter('Hello, World!', options).setCallback(function(me){
  console.log('callback function');
}).start();
```

**OR**, adding the function as a parameter to the ```start``` method:
```javascript
elem.typewriter('Hello, World!', options).start(function(me){
  console.log('callback function');
});
```
If you put both of these, the callback function that is a parameter to the ```start``` method is the one that will be executed.

The callback function will **only be called once**.
It is recommended that your callback functions have the first parameter as a way to reference ```this```, or point to ```typewriter```.




### Backspacing
While it is recommended that you use the ```TYPEWRITER_MODE_CORRECTION``` mode to produce a correction effect, you may like to do things the old fashioned way, or the hard way. You do you.

For you people, the ```backspace``` method exists, call it from a callback function, using the syntax:
```javascript
me.backspace(callback_function);
```
Where ```me``` is a reference to ```typewriter```, the parameter we suggested you have in the callback function.
The ```backspace``` method accepts one parameter, which is a callback function, use this to daisy chain callbacks :)

Example:
```javascript
elem.typewriter('typewriter.py').start(function(me){
  // First backspace
  me.backspace(function(me){
    // Second backspace
    me.backspace(function(me){
      me.setContent('js').startNoDelay(); // Make correction, changes to typewriter.js
    });
  });
});
```
This will produce the following:

![Typewriter.js Backspace example](https://raw.githubusercontent.com/mwrouse/typewriter.js/master/images/backspace.gif)

This is the same as writing:
```javascript
elem.typewriter(['typewriter.py', 'typewriter.js'], { mode: TYPEWRITER_MODE_CORRECTION }).start();
```
And is the suggested way to make corrections.

#### startNoDelay Method
In the above example there is the ```startNoDelay``` method, this does the exact same thing as the ```start``` method, except there is no delay before typing.

The ```startNoDelay``` method accepts a callback function as a parameter, just like the ```start``` method does.


### Erasing
Using the ```erase``` method, in a callback function, is a way to erase the entire sentence that has just been typed.

```javascript
elem.typewriter('This will all be erased').start(function(me){
  me.erase();
});
```
Which will result in the following:

![Typewriter.js erase example](https://raw.githubusercontent.com/mwrouse/typewriter.js/master/images/erase.gif)

The ```erase``` method also accepts a callback function like the ```backspace``` method.

You can use the ```TYPEWRITER_MODE_CORRECTION``` mode to simular this as well:
```javascript
elem.typewriter(['This will all be erased', ''], { mode: TYPEWRITER_MODE_CORRECTION }).start();
```


## CSS Animations
This script utilizes the ```animationend``` event listener to trigger typing the next letter(s), removing letters, as well as callback functions on the last letters.

Therefore, if you want to speed up the typing or backspacing, simply increase the animation duration on your CSS classes for the ```letters.remove_class``` and ```letters.class``` CSS classes.

Likewise, to speedup these actions, slow down the animation durations.



## Example
View an example on [CodePen](http://codepen.io/mwrouse/full/PNpmbd)

The text will turn green when each callback function is executed, be sure to pay attention to that.

## License
Distributed under the [MIT License](https://raw.githubusercontent.com/mwrouse/typewriter.js/master/LICENSE).
