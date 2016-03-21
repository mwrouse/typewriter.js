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
(function(){
  var TypeWriter = function(_elem, _options, _callback)
  {
    // Do not clutter the window scope
    if (this === window) { return new TypeWriter(_elem, _options, _callback); }

    // Set Parent to the element
    this.parent = _elem;

    // Allow _options to be the callback function
    if (_options && (typeof _options === 'function')) { _callback = _options; _options = undefined; }

    // Default options
    this.setOptions((_options === undefined || (typeof _options !== 'object')) ? { content: undefined, delay: undefined} : _options);
    this.setCallback(_callback); // Copy the callback

    // Setup the blinking cursor
    this.cursor = document.createElement(this.options.cursor.tag);
    this.cursor.classList.add(this.options.cursor.class);
    this.parent.appendChild(this.cursor);

    return this;
  };  // End TypeWriter

  /**
   * Function.....: Set Options
   * Parameters...: new_options - the new options
   * Description..: Another way to setup options
   */
  TypeWriter.prototype.setOptions = function(new_options)
  {
    // Setup and confirm that the new options are valid
    this.options = (new_options === undefined || (typeof new_options !== 'object')) ? this.options : new_options;
    this.options.content = (this.options.content === undefined || !this.options.content) ? 'I have no clue what to type' : this.options.content;
    this.options.delay = (this.options.delay === undefined || (typeof this.options.delay !== 'number')) ? 2 : this.options.delay;

    this.options.letters = (this.options.letters === undefined || (typeof this.options.letters !== 'object')) ? { tag: undefined, class: undefined } : this.options.letters;
    this.options.letters.tag = (this.options.letters.tag === undefined) ? 'span' : this.options.letters.tag;
    this.options.letters.class = (this.options.letters.class === undefined) ? 'typewriter-letter' : this.options.letters.class;
    this.options.letters.removeClass = (this.options.letters.removeClass === undefined) ? 'typewriter-letter-remove' : this.options.letters.removeClass;

    this.options.cursor = (this.options.cursor === undefined || (typeof this.options.letters !== 'objcet')) ? { tag: undefined, class: undefined } : this.options.cursor;
    this.options.cursor.tag = (this.options.cursor.tag === undefined) ? 'span' : this.options.cursor.tag;
    this.options.cursor.class = (this.options.cursor.class === undefined) ? 'typewriter-cursor' : this.options.cursor.class;
    this.options.cursor.noBlinkClass = (this.options.cursor.noBlinkClass === undefined) ? 'typewriter-cursor-noblink' : this.options.cursor.noBlinkClass;

    this.options.callbackDelay = (this.options.callbackDelay === undefined) ? 1 : this.options.callbackDelay;

    return this;
  }; // End setOptions

  /**
   * Function.....: Set Content
   * Parameters...: new_content - the new content
   * Description..: Another way to set the content
   */
  TypeWriter.prototype.setContent = function(new_content)
  {
    this.options.content = (new_content === undefined) ? this.options.content : new_content;

    return this;
  }; // End setContent

  /**
   * Function.....: Set Callback
   * Parameters...: new_callback - the new callback function
   * Description..: Another way to setup the callback function
   */
  TypeWriter.prototype.setCallback = function(new_callback)
  {
    this.callback = (new_callback === undefined) ? this.callback : new_callback;
    if (this.callback && !(typeof this.callback === 'function')) { this.options.content = 'Callback must be a function, silly!'; this.callback = null; } // Callback not a function error

    return this;
  }; // End setCallback

  /**
   * Function.....: Cursor No Blink
   * Description..: Stops the cursor form blinking
   */
  TypeWriter.prototype.cursorNoBlink = function()
  {
    if (!(this.cursor.classList.contains(this.options.cursor.noBlinkClass)))
    {
      this.cursor.classList.add(this.options.cursor.noBlinkClass); // Add the no blink class
    }

    return null; // Prevent from using inline with the function
  }; // End cursorNoBlink

  /**
   * Function.....: Cursor Blink
   * Description..: Sets the cursor to blink
   */
  TypeWriter.prototype.cursorBlink = function()
  {
    if (this.cursor.classList.contains(this.options.cursor.noBlinkClass))
    {
      this.cursor.classList.remove(this.options.cursor.noBlinkClass); // Remove the no blink class
    }

    return null; // Prevent from using inline with function
  }; // End cursorBlink

  /**
   * Function.....: Perform Callback
   * Parameters...: _callback - if this is set, it will not berform this.callback, it will perform _callback
   * Description..: Performs a callback function
   */
  TypeWriter.prototype.performCallback = function(_callback, _delay)
  {
    var me = this; // Remember this

    if (typeof _callback == 'number') { _delay = _callback; _callback = undefined; }


    var the_callback = (_callback && (typeof _callback === 'function')) ? _callback : this.callback;

    // Perform the callback after a 0.3s delay
    window.setTimeout(function(){
      if (the_callback && (typeof the_callback === 'function'))
      {
        the_callback(me);
        if (the_callback == me.callback) { me.callback = undefined; }
      }
    }, ((_delay === undefined) ? this.options.callbackDelay : _delay) * 1000);

    return null; // Prevent from using inline
  }; // End performCallback

  /**
   * Function.....: Type String
   * Parameters...: str - the string to type
   *                reset - will restart if true
   * Description..: Types a string
   */
  TypeWriter.prototype.typeString = function(str, reset)
  {
    var me = this; // Remember this

    this.typeString.index = (this.typeString.index === undefined || reset) ? 0 : this.typeString.index;  // Static variable to keep track of the location in str

    str = (str === undefined || !(typeof str === 'string')) ? 'Invalid String' : str;

    if (this.typeString.index < str.length)
    {
      // Do not let the cursor blink while typing
      this.cursorNoBlink();

      // Create the span element for the letter
      var letter = document.createElement(this.options.letters.tag);
      letter.classList.add(this.options.letters.class);
      letter.innerHTML = (str[this.typeString.index] === ' ') ? '&nbsp;' : str[this.typeString.index];

      // Add the animation end event listener, to begin typing the next letter
      letter.addEventListener('animationend', function(){
        me.typeString(str); // Type the next letter
      });

      // Add the letter to the parent, before the cursor
      this.parent.insertBefore(letter, this.cursor);

      // Advance to the next letter
      this.typeString.index++;
    }
    else
    {
      // Let the cursor blink
      this.cursorBlink();

      // Perform the callback
      me.performCallback();
    }

    return null;
  }; // End typeString

  /**
   * Function.....: Erase
   * Parameters...: _callback - callback for erasing
   * Description..: Erases a typed string
   */
  TypeWriter.prototype.erase = function(_callback)
  {
    var me = this; // Remember this

    if (this.parent.childNodes.length > 1)
    {
      // Prevent cursor from blinking when erasing
      this.cursorNoBlink();

      // backspace, and call me.erase in the callback function
      this.backspace(function(){
          me.erase(_callback);
      });
    }
    else
    {
      // Let the cursor blink
      this.cursorBlink();

      // Perform the callback w/ no delay
      me.performCallback(_callback, 0);
    }

    return null;
  }; // End erase

  /**
   * Function.....: Backspace
   * Parameters...: _callback - callback after backspacing
   * Description..: Backspaces one character
   */
  TypeWriter.prototype.backspace = function(_callback)
  {
    var me = this; // Remember this

    if (this.parent.childNodes.length > 1)
    {
      var last_letter = this.parent.childNodes.length - 2; // Minus two, because arrays start at 0 (that's a -1) and the last child is the cursor (so therefore -2)

      this.parent.childNodes[last_letter].classList.add(this.options.letters.removeClass);

      // Remove the letter after 0.2s
      this.parent.childNodes[last_letter].addEventListener('animationend', function(){
        me.parent.removeChild(me.parent.childNodes[last_letter]); // Remove the letter

        // Perform callback
        if (_callback !== undefined)
        {
          me.performCallback(_callback, 0); // perform callback w/ 100ms delay
        }
      });
    }

    return null;
  }; // End backspace

  /**
   * Function.....: Start
   * Parameters...: _callback - possible callback function
   * Description..: Starts the typing
   */
  TypeWriter.prototype.start = function(_callback)
  {
    var me = this; // Remember this

    if (_callback) { this.setCallback(_callback); } // Attempt to make _callback the new callback function

    // Start typing after the specified delay
    window.setTimeout(function(){
      me.typeString(me.options.content, true); // Type the string and reset the index counter
    }, this.options.delay * 1000);

    return null;
  }; // End start

  /**
   * Function.....: Start no Delay
   * Description..: Starts the typing without a delay
   */
  TypeWriter.prototype.startNoDelay = function(_callback)
  {
    var me = this;
    if (_callback) { this.setCallback(_callback); }

    this.typeString(this.options.content, true);

    return null;
  }; // End Start no delay



  // Initialize
  if (!window.Typewriter)
  {
    window.Typewriter = TypeWriter;
  }
})();
