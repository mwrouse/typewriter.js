/**
 * ====================================
 *        JavaScript Typewriter
 * ===================================
 *
 * Author.......: Michael Rouse
 * Language.....: JavaScript
 * Date.........: March 2016
 *
 * Description..: Typewriter effect for text
 */

/*
 * Typewriter Modes
 */
const TYPEWRITER_MODE_DEFAULT = 0;     // Type a string, then stop
const TYPEWRITER_MODE_CORRECTION = 1;  // Type a string, then backspace until strings are the same, and make a correction
const TYPEWRITER_MODE_ARRAY = 2;       // Type an array (types a string, erases, type the next index)

(function(){
  var TypeWriter = function(_text, _options)
  {
    // Protect the scope
    if (this === HTMLElement) { return new TypeWriter(_text, _options); }

    // Parent Element
    var me = this.parent = this;

    // Cursor
    this.cursor = undefined;

    // Options
    this.options = undefined;

    // Default content if it's not defined ( private variable )
    var content = (_text === undefined) ? 'I have no clue what to type' : _text;

    // Callback starts out as undefined ( private variable )
    var callback = undefined;

    /**
     * Method.......: Set Options
     * Parameters...: new_options - the options to set
     * Description..: Sets options for the library
     */
    this.setOptions = function(new_options)
    {
      // Set default options to be empty if new_options is not set
      this.options = ((new_options === undefined) || (typeof new_options !== 'object')) ? { } : new_options;

      // Set default mode if needed
      if ((this.options.mode === undefined) || (typeof this.options.mode !== 'number') || (this.options.mode > 2 || this.options.mode < 0)) { this.options.mode = TYPEWRITER_MODE_DEFAULT; } // Default mode

      // Fix _text if the mode is default
      if (((this.options.mode == TYPEWRITER_MODE_ARRAY) || (this.options.mode == TYPEWRITER_MODE_CORRECTION)) && !(content instanceof Array)) { this.options.mode = TYPEWRITER_MODE_DEFAULT; }
      if ((this.options.mode == TYPEWRITER_MODE_DEFAULT) && (content instanceof Array))
      {
        if (content.length == 0) { content[0] = 'I have no clue what to type'; } // Give default string if the array is empty
        content = content[0]; // Set text equal to the first element in the array
      }

      // Set default start delay if needed
      if ((this.options.start_delay === undefined) || (typeof this.options.start_delay !== 'number')) { this.options.start_delay = 2; } // Default delay of 2 seconds

      // Set default callback delay if needed
      if ((this.options.callback_delay === undefined) || (typeof this.options.callback_delay !== 'number')) { this.options.callback_delay = 1; } // Default 1s callback delay

      // Set default letter info if needed
      if ((this.options.letters === undefined) || (typeof this.options.letters !== 'object')) { this.options.letters = {}; }

      // Set default letter tag, class, and remove class if needed
      if((this.options.letters.tag === undefined) || (typeof this.options.letters.tag !== 'string')) { this.options.letters.tag = 'span'; } // Default tag for letters is span
      if ((this.options.letters.class === undefined) || (typeof this.options.letters.class !== 'string')) { this.options.letters.class = 'typewriter-letter'; } // Default CSS Class
      if ((this.options.letters.remove_class === undefined) || (typeof this.options.letters.remove_class !== 'string')) { this.options.letters.remove_class = 'typewriter-letter-remove'; } // Default CSS Class for removing a letter

      // Set default options for the cursor if needed
      if ((this.options.cursor === undefined) || (typeof this.options.cursor !== 'object')) { this.options.cursor = {}; }
      if ((this.options.cursor.tag === undefined) || (typeof this.options.cursor.tag !== 'string')) { this.options.cursor.tag = 'span'; } // Default tag for the cursor
      if ((this.options.cursor.class === undefined) || (typeof this.options.cursor.class !== 'string')) { this.options.cursor.class = 'typewriter-cursor'; } // Default CSS Class
      if ((this.options.cursor.no_blink_class === undefined) || (typeof this.options.cursor.no_blink_class !== 'string')) { this.options.cursor.no_blink_class = 'typewriter-cursor-noblink'; }

      // Initialize the cursor if it does not exist
      if (this.cursor === undefined)
      {
        this.cursor = document.createElement(this.options.cursor.tag);
        this.cursor.classList.add(this.options.cursor.class);
        this.parent.appendChild(this.cursor);
      }

      return this;
    }; // End Set Options

    /**
     * Method.......: Set Content
     * Parameters...: new_content
     * Description..: Sets new content to type
     */
    this.setContent = function(new_content)
    {
      content = (new_content === undefined) ? content : new_content;

      if ((content instanceof Array) && (this.options.mode != TYPEWRITER_MODE_ARRAY) && (this.options.mode != TYPEWRITER_MODE_CORRECTION))
      {
        content = (content[0] == undefined) ? 'I have no clue what to type' : content[0];
      }

      return this;
    }; // End Set Content

    /**
     * Method.......: Set Callback
     * Parameters...: new_callback - the callback to set
     * Description..: Sets the callback function
     */
    this.setCallback = function(new_callback)
    {
      callback = ((new_callback === undefined) || (typeof new_callback !== 'function')) ? callback : new_callback;

      return this;
    }; // End setCallback

    /**
     * Method.......: Cursor No blink ( private )
     * Description..: Stops the cursor from blinking
     */
    function cursorNoBlink()
    {
      if (!(me.cursor.classList.contains(me.options.cursor.no_blink_class)))
      {
        me.cursor.classList.add(me.options.cursor.no_blink_class); // Add the no blink class
      }
    } // End cursorNoBlink

    /**
     * Method.......: Cursor Blink ( private )
     * Description..: Allows the cursor to blink
     */
    function cursorBlink()
    {
      if (me.cursor.classList.contains(me.options.cursor.no_blink_class))
      {
        me.cursor.classList.remove(me.options.cursor.no_blink_class); // Remove the no blink class
      }
    } // End cursorBlink

    /**
     * Method.......: Perform Callback ( private )
     * Parameters...: _callback - overrides the default callback function
     *                _delay - overrides the default callback delay
     * Description..: Performs a callback function
     */
    function performCallback(_callback, _delay)
    {
      if (typeof _callback === 'number') { _delay = _callback; _callback = undefined; }

      var the_callback = ((_callback !== undefined) && (typeof _callback === 'function')) ? _callback : callback; // Choose which callback to perform
      var the_delay = ((_delay !== undefined) && (typeof _delay === 'number')) ? _delay : me.options.callback_delay;

      // Event timer to perform the the_callback function after the_delay
      window.setTimeout(function(){
        if ((the_callback !== undefined) && (typeof the_callback === 'function'))
        {
          the_callback(me); // Call the function, and pass it a reference to TypeWriter
          if (the_callback == callback) { callback = undefined; } // Only perform the callback function once
        }
      }, the_delay * 1000);

    } // End performCallback

    /**
     * Method.......: Type String ( private )
     * Parameters...: str - the string to type
     *                _callback - custom callback for array and correction
     * Description..: Types a string
     */
    function typeString(str, _callback)
    {
      str = ((str === undefined) || (typeof str !== 'string')) ? 'Invalid String' : str;

      if (str.length > 0)
      {
        // When typing, do not let the cursor blink
        cursorNoBlink();

        // Not a HTML tag, create element and add it
        var letter = document.createElement(me.options.letters.tag);
        letter.classList.add(me.options.letters.class);
        letter.innerHTML = (str[0] == ' ') ? '&nbsp;' : str[0];

        // Add animationend listener to chain next letter
        letter.addEventListener('animationend', function(){
          typeString(str.slice(1, str.length), _callback); // Type the next letter

          this.removeEventListener('animationend', arguments.callee); // Remove event listener
        });

        // Insert letter at the end of the parent, but before the cursor
        me.parent.insertBefore(letter, me.cursor);
      }
      else
      {
        // Done typing, let the cursor blink
        cursorBlink();

        performCallback(_callback); // Perform the callback function
      }
    } // End typeString


    /**
     * Method.......: Type Array
     * Description..: Types an array, and possibly does corrections
     */
    function typeArray()
    {
      // Confirm the script is in the right mode and stuff
      if ((content instanceof Array) && ((me.options.mode == TYPEWRITER_MODE_ARRAY) || (me.options.mode == TYPEWRITER_MODE_CORRECTION)))
      {
        if (content.length > 0)
        {
          if (content[0] instanceof Array)
          {
            typeCorrection(content[0], function(){
              content = content.slice(1, content.length);

              if (content.length >= 1)
              {
                me.erase(function(){
                  typeArray();
                });
              }
            }); // Send to type correction, not enough elements
          }
          else
          {
            typeString(content[0], function(){
              content = content.slice(1, content.length);
              if (content.length >= 1)
              {
                me.erase(function(){
                  typeArray();
                });
              }
            })
          }

        }
      }
    } // End typeArray

    /**
     * Method.......: Type Correction
     * Description..: Will type one string, then erase until they are different, making a correction.
     */
    function typeCorrection(_content, _callback)
    {
      if (_content === undefined) { _content = content; }
      // Confirm script is in the correct mode and stuff
      if ((_content instanceof Array) && (me.options.mode != TYPEWRITER_MODE_DEFAULT))
      {
        if (_content.length != 2)
        {
          typeString((_content[0] === undefined) ? "I don't know what to type" : _content[0]); // This only works with an array of two elements, silly users
        }
        else
        {
          // Type the first element
          typeString(_content[0], function(){
            // Find when they differ
            var shortest_length = (_content[0].length <= _content[1].length) ? _content[0].length : _content[1].length; // Get length of shorter string
            var different_at = shortest_length;
            for (var i = 0; i < shortest_length; i++)
            {
              if (_content[0][i] != _content[1][i])
              {
                different_at = i; // Mark where they are difference
                i = shortest_length; // Break the for-loop ( I'm sorry... )
              }
            } // End for

            // backspace to where they are different
            backspaceUntilLengthIs(different_at, function(){
              typeString(_content[1].replace(_content[0].slice(0, different_at), ''), function(){
                if ((_callback !== undefined) && (typeof _callback === 'function'))
                {
                  _callback();
                }
              });
            });
          });
        }
      }
    } // End typeCorrection

    /**
     * Method.......: Backspace Until Length is
     * Parameters...: desired_length - the length to backspace until
     * Description..: Will backspace the words, until the desired length
     */
    function backspaceUntilLengthIs(desired_length, _callback)
    {
      if ((me.parent.childNodes.length - 1) > desired_length)
      {
        me.backspace(function(){
          backspaceUntilLengthIs(desired_length, _callback); // Keep backspacing
        });
      }
      else
      {
        // Perform the callback
        if ((_callback !== undefined))
        {
          _callback();
        }
      }
    } // End backspaceUntilLengthIs

    /**
     * Method.......: Erase
     * Parameters...: _callback - callback override
     * Description..: Erases what is typed ( uses backspace method )
     */
    this.erase = function(_callback)
    {
      if (this.parent.childNodes.length > 1)
      {
        // Stop cursor from blinking
        cursorNoBlink();

        this.backspace(function(){
          me.erase(_callback); // Keep erasing
        });
      }
      else
      {
        // Done erasing, let the cursor blink
        cursorBlink();

        // Perform callback w/ delay
        if ((_callback !== undefined) && (typeof _callback === 'function'))
        {
          performCallback(_callback);
        }
      }
      return;
    }; // End erase


    /**
     * Method.......: Backspace
     * Parameters...: _callback - callback  override
     * Description..: Backspaces a character
     */
    this.backspace = function(_callback)
    {
      if (this.parent.childNodes.length > 1)
      {
        var last_letter = this.parent.childNodes.length - 2; // Minus two because the last child node is the cursor

        this.parent.childNodes[last_letter].classList.add(this.options.letters.remove_class); // Add remove class

        // Animationend event listener
        this.parent.childNodes[last_letter].addEventListener('animationend', function(){
          me.parent.removeChild(me.parent.childNodes[last_letter]); // Remove the letter element

          this.removeEventListener('animationend', arguments.callee); // Remove event listener

          if ((_callback !== undefined) && (typeof _callback === 'function'))
          {
            performCallback(_callback, 0);
          }
        });
      }
    }; // End backspace


    /**
     * Method.......: Mode Start
     * Description..: Calls the appropriate function based on what mode the script is in
     */
    function modeStart()
    {
      switch (me.options.mode)
      {
        // Default mode
        case TYPEWRITER_MODE_DEFAULT:
          typeString(content); // Type String
          break;

        // Correction Mode
        case TYPEWRITER_MODE_CORRECTION:
          typeCorrection(); // Type correction
          break;

        // Array Mode and Array with Correction s
        case TYPEWRITER_MODE_ARRAY:
          typeArray(); // Type Array/Array with corrections
          break;
      }
    } // End modeStart

    /**
     * Method.......: Start
     * Parameters...: _callback - overrides the callback function
     * Description..: Begins typing after delay
     */
    this.start = function(_callback)
    {
      if (_callback !== undefined) { this.setCallback(_callback); } // Attempt to override the callback function with _callback

      // Start typing after delay
      window.setTimeout(function(){
        modeStart(); // Begin typing
      }, this.options.start_delay * 1000);

    }; // End start

    /**
     * Method.......: Start No Delay
     * Parameters...: _callback - ovverrides the callback
     * Description..: Begins typing without a delay
     */
    this.startNoDelay = function(_callback)
    {
      if (_callback !== undefined) { this.setCallback(_callback); } // Attempt to set new callback function

      // Start typing wihtout a delay
      modeStart();

    }; // End startNoDelay




    /*
     * Constructor stuff
     */
    this.setOptions(_options);



    return this;

  }; // End TypeWriter




  if (!HTMLElement.prototype.typewriter)
  {
    HTMLElement.prototype.typewriter = TypeWriter;
  }
})();



/**
 * Method.......:
 * Parameters...:
 * Description..:
 */
