
/*
 * Typewriter Modes
 */
const TYPEWRITER_MODE_DEFAULT = 0;     // Type a string, then stop
const TYPEWRITER_MODE_CORRECTION = 1;  // Type a string, then backspace until strings are the same, and make a correction
const TYPEWRITER_MODE_ARRAY = 2;       // Type an array (types a string, erases, type the next index)

(function(){
  var TypeWriter = function($txt, $options, $parent)
  {
    if (this instanceof HTMLElement) return new TypeWriter($txt, $options, this);

    // Validate Parameters
    $txt = ($txt === undefined) ? 'I have no clue what to type' : $txt;

    if ( (typeof $txt == 'object') && !($txt instanceof Array) && ($options === undefined) )
      $options = $txt;

    // Constructor
    this.__parent = $parent;
    this.__cursor = undefined;
    this.__options = undefined;
    this.__content = $txt;
    this.__callback = undefined;

    this.element = this.elem = this.el = this.__parent;

    this.setOptions($options);

  }; // End TypeWriter Constructor


  /**
   * ================================
   *   "Private" member functions
   * ================================
   */
  TypeWriter.prototype.__default__ = function ($target, $default, $ref)
  {
    if ( ($ref[$target] === undefined) || (typeof $ref[$target] !== typeof $default) )
      $ref[$target] = $default;
  }; // End __default__


  /**
   * Method.......: Cursor No blink ( private )
   * Description..: Stops the cursor from blinking
   */
  TypeWriter.prototype.__cursorNoBlink__ = function() {
    var me = this;

    // Add the no blink class if it doesn't already have it
    if ( !me.__cursor.classList.contains(me.__options.cursor.no_blink_class) )
      me.__cursor.classList.add(me.__options.cursor.no_blink_class);

  }; // end __cursorNoBlink__


  /**
   * Method.......: Cursor Blink ( private )
   * Description..: Allows the cursor to blink
   */
  TypeWriter.prototype.__cursorBlink__ = function() {
    var me = this;

    // Remove the no_blink_class if the cursor has it
    if ( me.__cursor.classList.contains(me.__options.cursor.no_blink_class) )
      me.__cursor.classList.remove(me.__options.cursor.no_blink_class);

  }; // End __cursorBlink__


  /**
   * Method.......: Perform Callback ( private )
   * Parameters...: $callback - overrides the default callback function
   *                $delay - overrides the default callback delay
   * Description..: Performs a callback function
   */
  TypeWriter.prototype.__performCallback__ = function($callback, $delay) {
    var me = this;

    if ( typeof $callback === 'number' ) { $delay = $callback; $calllback = undefined; }

    var finalCallback = ( ($callback === undefined) || (typeof $callback !== 'function') ) ? me.__callback : $callback;
    var finalDelay = ( ($delay === undefined) || (typeof $delay !== 'number') ) ? me.__options.callback_delay : $delay;

    // Timeout to perform callback
    if ( (finalCallback !== undefined) && (typeof finalCallback === 'function') )
    {

      window.setTimeout(function(){
        // Perform callback function
        finalCallback(me);

        if ( finalCallback === me.__callback )
          me.__callback = undefined;
      }, finalDelay * 1000); // End setTimeout
    }

  }; // End __performCallback__


  /**
   * Method.......: Mode Start
   * Description..: Calls the appropriate function based on what mode the script is in
   */
  TypeWriter.prototype.__modeStart__ = function() {
    var me = this;

    switch (me.__options.mode)
    {
      // Default mode
      case TYPEWRITER_MODE_DEFAULT:
        me.__typeString__(me.__content);
        break;

      // Correction Mode
      case TYPEWRITER_MODE_CORRECTION:
        me.__typeCorrection__();
        break;

      // Array mode
      case TYPEWRITER_MODE_ARRAY:
        me.__typeArray__();
        break;
    }

  }; // End __modeStart__


  /**
   * Method.......: Type String ( private )
   * Parameters...: $str - the string to type
   *                $callback - custom callback for array and correction
   * Description..: Types a string
   */
  TypeWriter.prototype.__typeString__ = function($str, $callback) {
    var me = this;

    $str = ( ($str === undefined) || (typeof $str !== 'string') ) ? 'Invalid String' : $str;

    if ($str.length > 0)
    {
      // When typing, do not let the cursor blink
      me.__cursorNoBlink__();

      // Create element and add it
      var letter = document.createElement(me.__options.letters.tag || 'span');
      letter.classList.add(me.__options.letters.class || 'typewriter-letter');
      letter.innerHTML = ($str[0] == ' ') ? '&nbsp;' : $str[0];

      // Add animationend listener to chain the next letter
      letter.addEventListener('animationend', function(){
        // Type the next letter
        me.__typeString__($str.slice(1, $str.length), $callback);

        // Remove this event listener
        this.removeEventListener('animationend', arguments.callee);
      }); // Event listener

      me.__parent.insertBefore(letter, me.__cursor);
    }
    else
    {
      // Done typing
      me.__cursorBlink__();

      me.__performCallback__($callback);
    }

  }; // End __typeString__


  /**
   * Method.......: Type Array
   * Description..: Types an array, and possibly does corrections
   */
  TypeWriter.prototype.__typeArray__ = function() {
    var me = this;

    if ( (me.__content instanceof Array) && ((me.__options.mode == TYPEWRITER_MODE_ARRAY) || (me.__options.mode == TYPEWRITER_MODE_CORRECTION)) )
    {
      if (me.__content.length > 0)
      {
        if (me.__content[0] instanceof Array)
        {
          // Type a correction
          me.__typeCorrection__(me.__content[0], function(){
            me.__content = me.__content.slice(1, me.__content.length);

            if (me.__content.length >= 1)
              me.erase(function(){
                me.__typeArray__();
              });
            else
              me.__performCallback__(); // No more elements in the array

          });
        }else{
          // Type an array
          me.__typeString__(me.__content[0], function(){
            me.__content = me.__content.slice(1, me.__content.length);

            if (me.__content.length >= 1)
              me.erase(function(){
                me.__typeArray__();
              });
            else
              me.__performCallback__(); // No more elements in the array

          });
        }

      } // End if
    }

  }; // End __typeArray__


  /**
   * Method.......: Type Correction
   * Description..: Will type one string, then erase until they are different, making a correction.
   */
  TypeWriter.prototype.__typeCorrection__ = function($content, $callback) {
    var me = this;

    if ( ($content === undefined) || !($content instanceof Array) ) $content = me.__content;

    // Confirm script is in the correct mode
    if ( ($content instanceof Array) && (me.__options.mode != TYPEWRITER_MODE_DEFAULT) )
    {
      if ($content.length != 2) // Minimum of two elements needed for a correction
      {
        me.__typeString__($content[0] || "I don't know what to type");
      }
      else
      {
        // Type the elements
        me.__typeString__($content[0], function(){
          // Find where the strings are different
          var shortestLength = ($content[0].length <= $content[1].length) ? $content[0].length : $content[1].length;
          var differentAt = shortestLength;

          for (var i = 0; i < shortestLength; i++)
          {
            if ($content[0][i] != $content[1][i])
            {
              differentAt = i;
              i = shortestLength; // break the loop
            }
          } // End for

          // Backspace to where they are different
          me.__backspaceToLength__(differentAt, function(){
            // Type correction
            me.__typeString__($content[1].replace($content[0].slice(0, differentAt), ''), function(){
              me.__performCallback__($callback);
            });

          }); // End backspace to length

        });
      }

    } // End mode check

  }; // End __typeCorrection__


  /**
   * Method.......: Backspace Until Length is
   * Parameters...: $length - the length to backspace until
   * Description..: Will backspace the words, until the desired length
   */
  TypeWriter.prototype.__backspaceToLength__ = function($length, $callback) {
    var me = this;

    if ( (me.__parent.childNodes.length - 1) > $length)
    {
      // Keep backspacing
      me.backspace(function(){
        me.__backspaceToLength__($length, $callback);
      });
    }
    else
    {
      // Done backspacing
      if ( ($callback !== undefined) && (typeof $callback === 'function') )
        me.__performCallback__($callback);
    }

  }; // End __backspaceToLength__




  /**
   * ================================
   *    "Public" member functions
   * ================================
   */


  /**
   * Method.......: Set Options
   * Parameters...: $newOptions - the options to set
   * Description..: Sets options for the library
   */
  TypeWriter.prototype.setOptions = function($newOptions) {
    var me = this;

    var options = (($newOptions === undefined) || (typeof $newOptions !== 'object')) ? { } : $newOptions;

    /**
     * Set default options, and valid options if they exist
     */
    if ( (options.mode === undefined) || (typeof options.mode !== 'number') || (options.mode > 2 || options.mode < 0) )
      options.mode = TYPEWRITER_MODE_DEFAULT;

    if ( (options.mode == TYPEWRITER_MODE_CORRECTION || options.mode == TYPEWRITER_MODE_ARRAY) &&
        !(me.__content instanceof Array) )
        options.mode = TYPEWRITER_MODE_DEFAULT;

    if ( (options.mode == TYPEWRITER_MODE_DEFAULT) && (me.__content instanceof Array) )
      if ( me.__content.length == 0 )
        me.__content = 'I have no clue what to type';
      else
        me.__content = me.__content[0];

    // Default start delay (2s)
    me.__default__('start_delay', 2, options);

    // Default callback delay (1s)
    me.__default__('callback_delay', 1, options);

    // Default letter
    me.__default__('letters', {}, options);
    me.__default__('tag', 'span', options.letters);
    me.__default__('class', 'typewriter-letter', options.letters);
    me.__default__('remove_class', 'typewriter-letter-remove', options.letters);

    // Default cursor
    me.__default__('cursor', {}, options);
    me.__default__('tag', 'span', options.cursor);
    me.__default__('class', 'typewriter-cursor', options.cursor);
    me.__default__('no_blink_class', 'typewriter-cursor-noblink', options.cursor);

    if ( me.__cursor === undefined )
    {
      me.__cursor = document.createElement(options.cursor.tag);
      me.__cursor.classList.add(options.cursor.class);
      me.__parent.appendChild(me.__cursor);
    }

    // Update the options
    me.__options = options;

    return me;

  }; // End setOptions


  /**
   * Method.......: Set Content
   * Parameters...: $newContent
   * Description..: Sets new content to type
   */
  TypeWriter.prototype.setContent = function($newContent) {
    var me = this;

    me.__content = ($newContent === undefined) ? me.__content : $newContent;

    if ( (me.__content instanceof Array) && (me.__options.mode != TYPEWRITER_MODE_ARRAY) && (me.__options.mode != TYPEWRITER_MODE_CORRECTION) )
      me.__content = (me.__content[0] === undefined) ? 'I have no clue what to type' : me.__content[0];

    return me;

  }; // End setContent


  /**
   * Method.......: Set Callback
   * Parameters...: $newCallback - the callback to set
   * Description..: Sets the callback function
   */
  TypeWriter.prototype.setCallback = function($newCallback) {
    var me = this;

    if ( ($newCallback !== undefined) && (typeof $newCallback === 'function') )
      me.__callback = $newCallback;

    return me;

  }; // End setCallback


  /**
   * Method.......: Backspace
   * Parameters...: $callback - callback  override
   * Description..: Backspaces a character
   */
  TypeWriter.prototype.backspace = function($callback) {
    var me = this;

    // Only backspace if there is a character to backspace (> 1 because it will have 1 child because of the cursor)
    if ( me.__parent.childNodes.length > 1 )
    {
      var lastLetter = me.__parent.childNodes.length - 2; // -2 because the last child node is the cursor

      // Animation event listener
      me.__parent.childNodes[lastLetter].addEventListener('animationend', function(){
        // Remove the letter element
        me.__parent.removeChild(me.__parent.childNodes[lastLetter]);

        this.removeEventListener('animationend', arguments.callee); // Remove the event listener

        if ( ($callback !== undefined) && (typeof $callback === 'function') )
          me.__performCallback__($callback, 0); // perform the callback function

      });

      // Add the class to remove the letter, and triggers the animationend event listener
      me.__parent.childNodes[lastLetter].classList.add(me.__options.letters.remove_class || 'typewriter-letter-remove');

    }

  }; // End backspace


  /**
   * Method.......: Erase
   * Parameters...: $callback - callback override
   * Description..: Erases what is typed ( uses backspace method )
   */
  TypeWriter.prototype.erase = function($callback) {
    var me = this;

    // Only erase if there are any letters
    if ( me.__parent.childNodes.length > 1 )
    {
      // Stop the cursor blinking
      me.__cursorNoBlink__();

      // Backspace, and then keep erasing
      me.backspace(function(){
        me.erase($callback);
      });
    }
    else
    {
      // Done erasing, let the cursor blink
      me.__cursorBlink__();

      if ( ($callback !== undefined) && (typeof $callback === 'function') )
        me.__performCallback__($callback);
    }

  }; // End erase


  /**
   * Method.......: Start
   * Parameters...: $callback - overrides the callback function
   * Description..: Begins typing after delay
   */
  TypeWriter.prototype.start = function($callback) {
    var me = this;

    if ( ($callback !== undefined) && (typeof $callback === 'function') )
      me.setCallback($callback);

    // Start typing after a delay
    window.setTimeout(function(){

      me.__modeStart__();
    }, me.__options.start_delay * 1000);

  }; // End start


  /**
   * Method.......: Start No Delay
   * Parameters...: $callback - ovverrides the callback
   * Description..: Begins typing without a delay
   */
  TypeWriter.prototype.startNoDelay = function($callback) {
    var me = this;

    if ( ($callback !== undefined) && (typeof $callback === 'function') )
      me.setCallback($callback);

    // Start typing, no delay
    me.__modeStart__();

  }; // End startNoDelay



  if ( !HTMLElement.prototype.typewriter )
  {
    HTMLElement.prototype.typewriter = TypeWriter;
  }
}());
