// GameVM - window
// Author: Amy Burnett
//========================================================================
// Globals

//========================================================================

// Generic Window class
// user applications should extend this class
// resizeable feature inspired by https://codepen.io/DanielHarty/pen/vRRxxL?editors=0010
class Window
{
    constructor (x, y)
    {
        this.is_focused = false;
        this.is_dragging = false;
        this.offset_x = 0;
        this.offset_y = 0;
        this.x = x;
        this.y = y;
        this.width = 500;
        this.height = 500;

        this.header_height = 25;
        this.header_color = "#222";

        this.title = "Generic Window";
        this.icon = taskbar_icon_generic_window;

        // resizing
        this.is_resizing = false;
        this.resize_box_size = 15;
        this.minimum_width = 300;
        this.minimum_height = 100;

        this.taskbar_app = null;

        this.is_minimized = false;

        // window content
        this.background_color = "#fff";
        // list of user elements that could be interacted with
        // base window class will handle calling pressed, released, doubleClicked etc
        // Window users just need to add their interactable window elements to this array
        this.interactables = [];

        // even though pressing on a window generally does nothing,
        // this exists to keep track of if something on this window was pressed.
        // if something was pressed on this window,
        // we need to know to process mouse buttons being released
        this.is_being_pressed = false;

    }

    //====================================================================

    is_mouse_over ()
    {
        let xlow  = this.x;
        let xhigh = xlow + this.width;
        let ylow  = this.y;
        let yhigh = ylow + this.height;
        return xlow < mouseX && mouseX < xhigh && ylow < mouseY && mouseY < yhigh;
    }

    //====================================================================

    // returns true if mouse is over window header, false otherwise
    // returns false if mouse is over exit button on header
    is_mouse_over_header ()
    {
        let xlow  = this.x;
        let xhigh = xlow + this.width;
        let ylow  = this.y;
        let yhigh = ylow + this.header_height;
        return xlow < mouseX && mouseX < xhigh && ylow < mouseY && mouseY < yhigh
            && !this.is_mouse_over_exit_button ()
            && !this.is_mouse_over_maximize_button ()
            && !this.is_mouse_over_minimize_button ();
    }

    //====================================================================

    is_mouse_over_resize_box ()
    {
        let xlow  = this.x+this.width-this.resize_box_size;
        let xhigh = this.x + this.width;
        let ylow  = this.y+this.height-this.resize_box_size;
        let yhigh = this.y + this.height;
        return xlow < mouseX && mouseX < xhigh && ylow < mouseY && mouseY < yhigh;
    }

    //====================================================================

    is_mouse_over_exit_button ()
    {
        let header_button_padding = 10;
        let exit_button_font = "Courier New";
        let exit_button_text = "X";
        let exit_button_height = 16;
        textFont (exit_button_font);
        textSize (exit_button_height);
        let exit_button_width = textWidth (exit_button_text);
        let xlow  = this.x+this.width-exit_button_width-header_button_padding*2;
        let xhigh = xlow + exit_button_width+header_button_padding*2;
        let ylow  = this.y;
        let yhigh = ylow + this.header_height;
        return xlow < mouseX && mouseX < xhigh && ylow < mouseY && mouseY < yhigh;
    }

    //====================================================================

    is_mouse_over_maximize_button ()
    {
        let header_button_padding = 10;
        let exit_button_font = "Courier New";
        let exit_button_text = "X";
        let exit_button_height = 16;
        textFont (exit_button_font);
        textSize (exit_button_height);
        let exit_button_width = textWidth (exit_button_text);
        let maximize_button_height = 16;
        let maximize_button_text = "[]";
        textSize (maximize_button_height);
        let maximize_button_width = textWidth (maximize_button_text);
        let xlow  = this.x+this.width-exit_button_width-header_button_padding-maximize_button_width-header_button_padding*2-header_button_padding;
        let xhigh = xlow + maximize_button_width+header_button_padding*2;
        let ylow  = this.y;
        let yhigh = ylow + this.header_height;
        return xlow < mouseX && mouseX < xhigh && ylow < mouseY && mouseY < yhigh;
    }

    //====================================================================

    is_mouse_over_minimize_button ()
    {
        let header_button_padding = 10;
        let exit_button_font = "Courier New";
        let exit_button_text = "X";
        let exit_button_height = 16;
        textFont (exit_button_font);
        textSize (exit_button_height);
        let exit_button_width = textWidth (exit_button_text);
        let maximize_button_height = 16;
        let maximize_button_text = "[]";
        textSize (maximize_button_height);
        let maximize_button_width = textWidth (maximize_button_text);
        let minimize_button_height = 16;
        let minimize_button_text = "-";
        textSize (minimize_button_height);
        let minimize_button_width = textWidth (minimize_button_text);
        let xlow  = this.x+this.width-exit_button_width-header_button_padding-maximize_button_width-header_button_padding*2-minimize_button_width-header_button_padding*2-header_button_padding;
        let xhigh = xlow + minimize_button_width+header_button_padding*2;
        let ylow  = this.y;
        let yhigh = ylow + this.header_height;
        return xlow < mouseX && mouseX < xhigh && ylow < mouseY && mouseY < yhigh;
    }

    //====================================================================

    resize ()
    {

    }

    //====================================================================

    update ()
    {
        // move window if being dragged
        if (this.is_dragging)
        {
            this.x = mouseX + this.offset_x;
            this.y = mouseY + this.offset_y;
            // ensure window doesnt leave top of screen
            if (this.y < 0)
                this.y = 0;
            // ensure header doesnt go below taskbar
            if (this.y+this.header_height > windowHeight-taskbar_height)
                this.y = windowHeight-taskbar_height-this.header_height;
            // ensure the whole window cannot leave right side of screen
            // arbitrary 50 pixel buffer
            if (this.x+50 > windowWidth)
                this.x = windowWidth-50;
            // ensure the whole window cannot leave left side of screen
            if (this.x+this.width-50 < 0)
                this.x = -this.width+50;
        }

        // resize window (if being resized)
        if (this.is_resizing)
        {
            if (mouseX - this.x + this.offset_x > this.minimum_width) {
                this.width = mouseX - this.x + this.offset_x;
            } else {
                this.width = this.minimum_width;
            }
            if (mouseY - this.y + this.offset_y > this.minimum_height) {
                this.height = mouseY - this.y + this.offset_y;
            } else {
                this.height = this.minimum_height;
            }
        }
    }

    //====================================================================

    // unfocus should handle unfocusing the window and any focus-able elements
    unfocus ()
    {
        for (let interactable of this.interactables)
        {
            // *this should really be interactable.unfocus, but this should work
            interactable.pressed ();
        }
        this.is_focused = false;
    }

    //====================================================================

    // checks if the incoming mouse click happened on this window 
    // or on any of this window's elements and processes the mouse press
    // returns true if mouse press was on this window, false otherwise
    pressed ()
    {
        // ensure window is not minimized
        if (this.is_minimized)
            return false;
        // ignore press if it wasnt over the window
        if (!this.is_mouse_over ())
            return false;
        // keep track that we pressed on this window
        this.is_being_pressed = true;

        
        let was_pressed_on = false;
        // focus window if we clicked anywhere on window
        if (this.is_mouse_over ())
        {
            was_pressed_on = true;
        }
        // check if mouse clicked on window header
        if (this.is_mouse_over_header ())
        {
            this.is_dragging = true;
            // we probably didnt press at x, y so record the difference
            this.offset_x = this.x - mouseX;
            this.offset_y = this.y - mouseY;
            was_pressed_on = true;
        }

        if (this.is_mouse_over_resize_box ())
        {
            this.is_resizing = true;
            this.offset_x = (this.x + this.width) - mouseX;
            this.offset_y = (this.y + this.height) - mouseY;
            was_pressed_on = true;
        }

        if (this.is_mouse_over_exit_button ())
        {
            // exit this window
            // caller function handles this
            // since we cant delete ourselves from an array?
            // for (let wi = 0; wi < windows.length; ++wi)
            // {
            //     if (windows[wi] === this)
            //     {
            //         // windows.splice(wi, 1);
            //         break;
            //     }
            // }
            was_pressed_on = true;
        }

        if (this.is_mouse_over_minimize_button ())
        {
            // set to minimized so we dont draw window
            this.is_minimized = true;
            // unfocus window
            // handled by caller
            was_pressed_on = true;
        }

        // process interactables
        for (let interactable of this.interactables)
        {
            interactable.pressed (this.x, this.y);
        }

        return was_pressed_on;
    }

    //====================================================================

    // checks if the incoming mouse release happened on this window 
    // or on any of this window's elements and processes the mouse release
    released ()
    {
        // process interactables if we pressed something on this window
        if (this.is_being_pressed)
        {
            for (let interactable of this.interactables)
            {
                interactable.released (this.x, this.y);
            }
        }
        this.is_dragging = false;
        this.is_resizing = false;
        this.is_being_pressed = false;
    }
    
    //====================================================================

    // checks if the incoming mouse double click happened on this window 
    // or on any of this window's elements and processes the mouse double click
    doubleClicked ()
    {
        // ensure window is not minimized
        if (this.is_minimized)
            return false;
        // ensure mouse was over window when doubleclicked
        if (!this.is_mouse_over ())
            return false;
        // reaches here if this window was doubleclicked
        console.log ("window doubleclick");
        // check if window's interactables were doubleclicked
        for (let interactable of this.interactables)
        {
            interactable.doubleClicked (this.x, this.y);
        }
        return true;
    }

    //====================================================================

    // handles the incoming key press
    keyPressed ()
    {
        // ignore keyPress if window is not focused
        if (!this.is_focused)
            return;

        // handle window keypresses
        // ** this is where we can handle Ctrl+W for closing window
        // ** and tab (and shift+tab) iterating over interactables

        // send keypress to interactable elements
        for (let interactable of this.interactables)
        {
            interactable.keyPressed ();
        }
    }

    //====================================================================

    // draws this window to the canvas
    show ()
    {
        // ensure window is not minimized
        if (this.is_minimized)
            return;
        // draw window background
        if (this.is_focused)
        {
            stroke ("#00BCFF");
            strokeWeight (2);
        }
        else
        {
            stroke ("black");
            strokeWeight (1);
        }
        fill (this.background_color);
        rect (this.x, this.y, this.width, this.height);

        // draw window header
        noStroke ();
        if (this.is_focused)
            fill (this.header_color);
        else
            fill ("#333");
        rect (this.x, this.y, this.width, this.header_height);
        // draw header icon
        let header_icon_width = 16;
        image (this.icon, this.x+6, this.y+this.header_height/2-header_icon_width/2, header_icon_width, header_icon_width);
        // draw header text
        textFont ("Arial");
        let header_text_height = 12;
        textSize (header_text_height);
        noStroke ();
        if (this.is_focused)
            fill ("white");
        else
            fill ("#ccc");
        push ();
        textAlign (LEFT, CENTER);
        text (this.title, this.x+6+header_icon_width+6, this.y+this.header_height/2);
        pop ();

        // draw resize box
        if (this.is_mouse_over() || this.is_resizing) {
            var handleX1 = this.x + this.width - this.resize_box_size;
            var handleY1 = this.y + this.height - this.resize_box_size;
            var handleX2 = this.x + this.width;
            var handleY2 = this.y + this.height;
            noStroke();
            fill('grey');
            beginShape();
            vertex(handleX1, handleY1 + this.resize_box_size);
            vertex(handleX2, handleY1);
            vertex(handleX2, handleY2);
            endShape(CLOSE);
            stroke('black');
            line(handleX1, handleY1 + this.resize_box_size, handleX2, handleY1);
            line(handleX1+5, handleY1 + this.resize_box_size, handleX2, handleY1+5);
            line(handleX1+10, handleY1 + this.resize_box_size, handleX2, handleY1+10);
        }

        if (this.is_mouse_over_header ())
        {
            cursor (MOVE);
        }

        if (this.is_mouse_over_resize_box ())
        {
            cursor (CROSS);
        }

        // draw exit button
        let header_button_padding = 10;
        let exit_button_font = "Courier New";
        let exit_button_text = "X";
        let exit_button_height = 16;
        textFont (exit_button_font);
        textSize (exit_button_height);
        let exit_button_width = textWidth (exit_button_text);
        let exit_button_xlow  = this.x+this.width-exit_button_width-header_button_padding*2;
        let exit_button_xhigh = exit_button_xlow + exit_button_width+header_button_padding*2;
        let exit_button_ylow  = this.y;
        let exit_button_yhigh = exit_button_ylow + this.header_height;
        // only show hover color if mouse is over X
        if (exit_button_xlow < mouseX && mouseX < exit_button_xhigh && exit_button_ylow < mouseY && mouseY < exit_button_yhigh)
        {
            noStroke ();
            fill ("red");
            rect (this.x+this.width-exit_button_width-header_button_padding*2, this.y, exit_button_width+header_button_padding*2, this.header_height);
            cursor (HAND);
        }
        noStroke ();
        fill ("white");
        text (exit_button_text, this.x+this.width-exit_button_width-header_button_padding, this.y+this.header_height/2+exit_button_height/3);
        // draw maximize button
        let maximize_button_height = 16;
        let maximize_button_text = "[]";
        textSize (maximize_button_height);
        let maximize_button_width = textWidth (maximize_button_text);
        let xlow  = this.x+this.width-exit_button_width-header_button_padding-maximize_button_width-header_button_padding*2-header_button_padding;
        let xhigh = xlow + maximize_button_width+header_button_padding*2;
        let ylow  = this.y;
        let yhigh = ylow + this.header_height;
        // only show hover color if mouse is over X
        if (xlow < mouseX && mouseX < xhigh && ylow < mouseY && mouseY < yhigh)
        {
            noStroke ();
            fill ("#555");
            rect (this.x+this.width-exit_button_width-header_button_padding-maximize_button_width-header_button_padding*2-header_button_padding, this.y, maximize_button_width+header_button_padding*2, this.header_height);
            cursor (HAND);
        }
        noStroke ();
        fill ("white");
        text (maximize_button_text, this.x+this.width-exit_button_width-header_button_padding-maximize_button_width-header_button_padding*2, this.y+this.header_height/2+maximize_button_height/3);
        // draw minimize button
        let minimize_button_height = 16;
        let minimize_button_text = "-";
        textSize (minimize_button_height);
        let minimize_button_width = textWidth (minimize_button_text);
        xlow  = this.x+this.width-exit_button_width-header_button_padding-maximize_button_width-header_button_padding*2-minimize_button_width-header_button_padding*2-header_button_padding;
        xhigh = xlow + minimize_button_width+header_button_padding*2;
        ylow  = this.y;
        yhigh = ylow + this.header_height;
        // only show hover color if mouse is over X
        if (xlow < mouseX && mouseX < xhigh && ylow < mouseY && mouseY < yhigh)
        {
            noStroke ();
            fill ("#555");
            rect (this.x+this.width-exit_button_width-header_button_padding-maximize_button_width-header_button_padding*2-minimize_button_width-header_button_padding*2-header_button_padding, this.y, minimize_button_width+header_button_padding*2, this.header_height);
            cursor (HAND);
        }
        noStroke ();
        fill ("white");
        text (minimize_button_text, this.x+this.width-exit_button_width-header_button_padding-maximize_button_width-header_button_padding*2-minimize_button_width-header_button_padding*2, this.y+this.header_height/2+minimize_button_height/3);

        // print window contents
        this.draw_window_content ();
    }

    //====================================================================

    // prints the main content of the window
    // should be overloaded
    draw_window_content ()
    {
        push ();

        fill ("black");
        stroke (0);
        strokeWeight (0);
        textAlign (CENTER);
        text ("generic content", this.x+this.width/2, this.y+this.height/2);

        pop ();
    }
}

//========================================================================
//=== WINDOW ELEMENTS ====================================================
//========================================================================

// App window element
// a clickable button
// when the button is pressed, it calls the onclick function provided
class WindowButton
{
    constructor (x, y, label, onclick, window_instance, {width=50, height=25, border_radius=10, border_color="#000", noStroke=false, label_text_size=25, background_color="#fff", label_color="#000", mouse_over_background_color="#ccc", icon=null, is_disabled=false, popup_text=""}={})
    {
        // button's position is relative to the app window's position
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.border_radius = border_radius;
        this.border_color = border_color;
        this.noStroke = noStroke;
        this.background_color = background_color;
        this.mouse_over_background_color = mouse_over_background_color;
        this.label = label;
        this.label_text_size = label_text_size;
        this.label_color = label_color;
        this.disabled_label_color = "#777";
        this.icon = icon;

        // controls
        this.is_being_pressed = false;
        this.onclick_function = onclick;
        this.window_instance = window_instance;
        this.is_disabled = is_disabled;

        // popup text
        this.mouse_paused_counter = 0;
        this.popup_text = popup_text;
        this.has_popup = false;
    }

    //====================================================================

    is_mouse_over (window_x, window_y)
    {
        let xlow  = this.x + window_x;
        let xhigh = xlow + this.width;
        let ylow  = this.y + window_y;
        let yhigh = ylow + this.height;
        return xlow < mouseX && mouseX < xhigh && ylow < mouseY && mouseY < yhigh;
    }

    //====================================================================

    pressed (window_x, window_y)
    {
        // remove popup
        if (this.has_popup)
        {
            mouseHoverPopUpManager.remove_popup ();
            this.has_popup = false;
        }
        // ensure button is not disabled
        if (this.is_disabled)
            return false;
        if (this.is_mouse_over (window_x, window_y))
        {
            this.is_being_pressed = true;
            return true;
        }
        return false;
    }

    //====================================================================

    released (window_x, window_y)
    {
        // remove popup
        if (this.has_popup)
        {
            mouseHoverPopUpManager.remove_popup ();
            this.has_popup = false;
        }
        // if we pressed and released while the mouse was over the button,,
        // then submit the button press
        if (this.is_being_pressed && this.is_mouse_over (window_x, window_y))
        {
            // console.log ("button pressed!");
            this.onclick_function ();
        }
        // mouse was released so we cannot be still pressing this button
        this.is_being_pressed = false;
    }

    //====================================================================

    doubleClicked (window_x, window_y)
    {
        // remove popup
        if (this.has_popup)
        {
            mouseHoverPopUpManager.remove_popup ();
            this.has_popup = false;
        }
        // do nothing
    }

    //====================================================================

    keyPressed ()
    {
        // ensure button is not disabled
        if (this.is_disabled)
            return;
        // ignore if not focused
        if (!this.is_focused)
            return;
        // TODO - SPACEBAR should press/submit button
    }

    //====================================================================

    show (window_x, window_y)
    {
        push ();

        let x = this.x + window_x;
        let y = this.y + window_y;

        // popup text
        // display if mouse was hovering at rest for 0.5 sec over this
        // mouse is at rest over this
        if (mouseX == pmouseX && mouseY == pmouseY && this.is_mouse_over (window_x, window_y))
        {
            // advance "paused" counter by one frame
            this.mouse_paused_counter++;
            // draw popup if counter reached 0.5 sec, if not already added
            if (this.mouse_paused_counter / frameRate () > 0.5 && !mouseHoverPopUpManager.has_popup)
            {
                mouseHoverPopUpManager.add_popup (this.popup_text);
                this.has_popup = true;
            }
        }
        // mouse moving
        else if (!(mouseX == pmouseX && mouseY == pmouseY))
        {
            // reset "paused" counter
            this.mouse_paused_counter = 0;
            // if mouse exited and we had a popup, remove popup
            if (!this.is_mouse_over (window_x, window_y) && this.has_popup)
            {
                mouseHoverPopUpManager.remove_popup ();
                this.has_popup = false;
            }
        }

        // draw button
        // highlight if mouse is over button and button is not disabled
        if (this.is_mouse_over (window_x, window_y) && !this.is_disabled)
        {
            fill (this.mouse_over_background_color);
            cursor (HAND);
        }
        // otherwise, use normal background color
        else
        {
            fill (this.background_color);
        }
        if (this.noStroke)
            noStroke ();
        else
        {
            strokeWeight (1);
            stroke (this.border_color);
        }
        rect (x, y, this.width, this.height, this.border_radius);

        // draw button's label
        // text label
        if (this.icon == null)
        {
            fill (this.label_color);
            if (this.is_disabled)
                fill (this.disabled_label_color);
            noStroke ();
            textFont ("Arial");
            textStyle (BOLD);
            textSize (this.label_text_size);
            textAlign (CENTER, CENTER);
            text (this.label, x+this.width/2, y+this.height/2);
        }
        else
        {
            image (this.icon, x+this.width/2-this.label_text_size/2, y+this.height/2-this.label_text_size/2, this.label_text_size, this.label_text_size);
        }

        pop ();
    }
}

//========================================================================

// App window element
// an editable textbox
class WindowTextBox
{
    constructor (x, y, initial_text, submit_callback, window_instance, {width=50, height=25, border_radius=10, border_color="#000", noStroke=false, text_size=25, background_color="#fff", text_color="#000", text_font="Arial", is_editable=true}={})
    {
        // button's position is relative to the app window's position
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.border_radius = border_radius;
        this.border_color = border_color;
        this.noStroke = noStroke;
        this.background_color = background_color;
        this.value = initial_text;
        this.text_size = text_size;
        this.text_color = text_color;
        this.text_font = text_font;

        // controls
        this.is_editable = is_editable;
        this.is_editing = false;
        this.cursor_pos = this.value.length;
        this.submit_callback = submit_callback;
        this.window_instance = window_instance;
        // this gives a frame countdown delay before the cursor resumes blinking
        this.cursor_blink_delay = 30;
        // text selecting
        this.is_being_pressed = false;
        // -1 means no selected text
        this.selection_cursor_start = -1;
        // this.press_y = 0;
    }

    //====================================================================

    is_mouse_over (window_x, window_y)
    {
        let xlow  = this.x + window_x;
        let xhigh = xlow + this.width;
        let ylow  = this.y + window_y;
        let yhigh = ylow + this.height;
        return xlow < mouseX && mouseX < xhigh && ylow < mouseY && mouseY < yhigh;
    }

    //====================================================================

    pressed (window_x, window_y)
    {
        if (this.is_mouse_over (window_x, window_y))
        {
            this.is_being_pressed = true;
            // shift key should put cursor into selected cursor
            if (keyIsDown (SHIFT))
            {
                if (this.selection_cursor_start == -1 || this.selection_cursor_start == this.cursor_pos)
                    this.selection_cursor_start = this.cursor_pos;
            }
            else
                // save mouse position for selecting text
                this.selection_cursor_start = this.x_to_nearest_index (window_x, window_y, mouseX);
            // mouse pressed on this textbox, so activate editing
            this.is_editing = true;
            return true;
        }
        // mouse press is off of textbox
        // unfocus
        this.is_editing = false;
        return false;
    }

    //====================================================================

    released (window_x, window_y)
    {
        if (this.is_being_pressed && this.is_mouse_over (window_x, window_y))
        {

        }
        // mouse was released so we cannot be still pressing this button
        this.is_being_pressed = false;
        // if nothing is selected, mark it as unselected
        if (this.selection_cursor_start == this.cursor_pos)
            this.selection_cursor_start = -1;
    }

    //====================================================================

    doubleClicked (window_x, window_y)
    {
        // ensure doubleclicked on this element
        if (!this.is_mouse_over (window_x, window_y))
            return false;
        // just select all text (for now)
        // ** this should select a word
        this.selection_cursor_start = 0;
        this.cursor_pos = this.value.length;
    }

    //====================================================================

    keyPressed ()
    {
        // ignore keypresses if not editing
        if (!this.is_editing)
            return;
        // reset cursor blink delay
        this.cursor_blink_delay = 30;
        // cursor movement
        // cursor left (if not already all the way left)
        if (keyCode == LEFT_ARROW && this.cursor_pos > 0)
        {
            // if we were holding shift and nothing was selected, start selection
            if (keyIsDown (SHIFT) && this.selection_cursor_start == -1)
                this.selection_cursor_start = this.cursor_pos;
            // if we werent holding shift, then reset selection cursor
            if (!keyIsDown (SHIFT))
                this.selection_cursor_start = -1;
            // move cursor left
            --this.cursor_pos;
        }
        // cursor right (if not already all the way right)
        else if (keyCode == RIGHT_ARROW && this.cursor_pos < this.value.length)
        {
            // if we were holding shift and nothing was selected, start selection
            if (keyIsDown (SHIFT) && this.selection_cursor_start == -1)
                this.selection_cursor_start = this.cursor_pos;
            // if we werent holding shift, then reset selection cursor
            if (!keyIsDown (SHIFT))
                this.selection_cursor_start = -1;
            // move cursor right
            ++this.cursor_pos;
        }

        // ensure this textbox is editable
        if (!this.is_editable)
            return;

        // deleting chars
        if (keyCode == BACKSPACE)
        {
            // deleting selected text
            if (this.selection_cursor_start != -1)
            {
                // delete selected text
                let left_i = this.selection_cursor_start < this.cursor_pos ? this.selection_cursor_start : this.cursor_pos;
                let right_i = this.selection_cursor_start < this.cursor_pos ? this.cursor_pos : this.selection_cursor_start;
                this.value = this.value.substring (0, left_i) + this.value.substring (right_i, this.value.length);
                // reset cursor pos
                this.cursor_pos = left_i;
                // no longer selecting text
                this.selection_cursor_start = -1;
            }
            // no selected text
            // ensure there is a char left of the cursor
            else if (this.cursor_pos > 0)
            {
                // remove prev char
                this.value = this.value.substring (0, this.cursor_pos-1) + this.value.substring (this.cursor_pos, this.value.length);
                // shift cursor back
                --this.cursor_pos;
            }
        }
        if (keyCode == DELETE)
        {
            // deleting selected text
            if (this.selection_cursor_start != -1)
            {
                // delete selected text
                let left_i = this.selection_cursor_start < this.cursor_pos ? this.selection_cursor_start : this.cursor_pos;
                let right_i = this.selection_cursor_start < this.cursor_pos ? this.cursor_pos : this.selection_cursor_start;
                this.value = this.value.substring (0, left_i) + this.value.substring (right_i, this.value.length);
                // reset cursor pos
                this.cursor_pos = left_i;
                // no longer selecting text
                this.selection_cursor_start = -1;
            }
            // no selected text
            // ensure there is a char right of the cursor
            else if (this.cursor_pos < this.value.length)
            {
                // remove next char
                this.value = this.value.substring (0, this.cursor_pos) + this.value.substring (this.cursor_pos+1, this.value.length);
                // cursor stays in same position
            }
        }
        // adding chars
        let allowed_chars = " abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()[]{};':\",.<>/?"
        if (allowed_chars.includes (key))
        {
            // deleting selected text (if any)
            if (this.selection_cursor_start != -1)
            {
                // delete selected text
                let left_i = this.selection_cursor_start < this.cursor_pos ? this.selection_cursor_start : this.cursor_pos;
                let right_i = this.selection_cursor_start < this.cursor_pos ? this.cursor_pos : this.selection_cursor_start;
                this.value = this.value.substring (0, left_i) + this.value.substring (right_i, this.value.length);
                // reset cursor pos
                this.cursor_pos = left_i;
                // no longer selecting text
                this.selection_cursor_start = -1;
            }
            // insert char
            this.value = this.value.substring (0, this.cursor_pos) + key + this.value.substring (this.cursor_pos, this.value.length);
            // move cursor
            this.cursor_pos++;
        }
        // submitting textbox
        if (keyCode == ENTER)
        {
            this.submit_callback ();
        }
    }

    //====================================================================

    x_to_nearest_index (window_x, window_y, x)
    {
        noStroke ();
        fill (this.text_color);
        textSize (this.text_size);
        textAlign (LEFT, CENTER);
        textFont (this.text_font);
        let inner_padding = 5;
        let text_x = this.x+window_x+inner_padding;
        let new_cursor_pos = 0;
        for (let i = 0; i < this.value.length+1; ++i)
        {
            let lhs_str = this.value.substring (0, i);
            let new_width = textWidth (lhs_str);
            // check if mouse is left of this char
            if (x < text_x+new_width)
            {
                return new_cursor_pos;
            }
            ++new_cursor_pos;
        }
        return this.value.length;
    }

    //====================================================================

    show (window_x, window_y)
    {
        push ();

        let x = this.x + window_x;
        let y = this.y + window_y;

        if (this.is_mouse_over (window_x, window_y))
            cursor (TEXT);

        // draw textbox
        if (this.noStroke)
            noStroke ();
        else
        {
            stroke (this.border_color);
            strokeWeight (1);
        }
        fill (this.background_color);
        // outline textbox if user is editing
        if (this.is_editing)
        {
            stroke ("#00BCFF");
            strokeWeight (1);
        }
        rect (x, y, this.width, this.height, this.border_radius);

        // draw text
        noStroke ();
        fill (this.text_color);
        textSize (this.text_size);
        textAlign (LEFT, CENTER);
        textFont (this.text_font);
        let inner_padding = 5;
        let text_x = x+inner_padding;
        
        // if user is currently selecting text (mouse pressed but not yet released),
        // we need to update the textbox cursor to the mouse cursor position
        // (or as close to the mouse cursor as possible)
        if (this.is_being_pressed)
        {
            this.cursor_pos = this.x_to_nearest_index (window_x, window_y, mouseX);
        }
        // draw selected text highlight (if text is selected)
        if (this.selection_cursor_start != -1)
        {
            let left_highlight_x = (this.selection_cursor_start < this.cursor_pos) ?
                text_x + textWidth (this.value.substring (0, this.selection_cursor_start)) :
                text_x + textWidth (this.value.substring (0, this.cursor_pos));
            let right_highlight_x = (this.selection_cursor_start < this.cursor_pos) ?
                (left_highlight_x + textWidth (this.value.substring (this.selection_cursor_start, this.cursor_pos))) :
                (left_highlight_x + textWidth (this.value.substring (this.cursor_pos, this.selection_cursor_start)));
            noStroke ();
            if (this.is_editing)
                fill ("#00BCFF");
            else
                fill (255,255,255,75);
            rect (left_highlight_x, y+inner_padding, right_highlight_x-left_highlight_x, this.height-2*inner_padding);
        }

        // finally draw text for real this time
        noStroke ();
        fill (this.text_color);
        textSize (this.text_size);
        textAlign (LEFT, CENTER);
        textFont (this.text_font);
        text (this.value, text_x, y+this.height/2);

        // draw cursor (if editing)
        if (this.is_editing)
        {
            // draw cursor line if on blink delay
            let is_blink_delay_active = this.cursor_blink_delay > 0;
            // show cursor for first half of a second and hide for the second half of the second
            // to get the cursor blinking effect
            // this relies on 60 fps - probably not ideal
            let is_blink_on = frameCount % 60 < 30;
            if (is_blink_delay_active || is_blink_on)
            {
                // cursor line is draw to the left of the current char position
                // or end of line if cursor is at the end of the input
                let cursor_x = x + inner_padding + textWidth (this.value.substring (0, this.cursor_pos));
                stroke ("#fff");
                strokeWeight (1);
                noFill ();
                line (cursor_x, y+inner_padding, cursor_x, y+this.height-inner_padding);
            }
            this.cursor_blink_delay--;
        }

        pop ();
    }
}

//========================================================================

// displays multiple files
// similar to a desktop where you have multiple icons for different files
// - files can be moved around
// - display can accept drag+drop files
// - supports click+drag for selecting multiple files
// - supports arrow key presses to move around a file cursor
// - supports selecting all files via CTRL+A
// - supports deleting files via select + backspace
class WindowFileDisplay
{
    constructor (x, y, window_instance, {width=50, height=25, border_radius=0, border_color="#000", noStroke=false, text_size=25, background_color="#fff", text_color="#000", text_font="Arial", dir_change_callback=null}={})
    {
        // button's position is relative to the app window's position
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.border_radius = border_radius;
        this.border_color = border_color;
        this.noStroke = noStroke;
        this.background_color = background_color;
        this.text_size = text_size;
        this.text_color = text_color;
        this.text_font = text_font;

        // controls
        this.window_instance = window_instance;
        this.is_focused = false;
        this.files = [];
        this.dir_change_callback = dir_change_callback;

    }

    //====================================================================

    is_mouse_over (window_x, window_y)
    {
        let xlow  = this.x + window_x;
        let xhigh = xlow + this.width;
        let ylow  = this.y + window_y;
        let yhigh = ylow + this.height;
        return xlow < mouseX && mouseX < xhigh && ylow < mouseY && mouseY < yhigh;
    }

    //====================================================================

    pressed (window_x, window_y)
    {
        // pass press along to icons
        for (let file of this.files)
        {
            file.pressed (this.x+window_x, this.y+window_y);
        }

        if (this.is_mouse_over (window_x, window_y))
        {
            this.is_being_pressed = true;
            this.is_focused = true;
            return true;
        }
        // mouse press is off of file display
        // unfocus
        this.is_focused = false;
        return false;
    }

    //====================================================================

    released (window_x, window_y)
    {
        // pass release along to icons
        for (let file of this.files)
        {
            file.released (this.x+window_x, this.y+window_y);
        }

        if (this.is_being_pressed && this.is_mouse_over (window_x, window_y))
        {

        }
        this.is_being_pressed = false;
    }

    //====================================================================

    doubleClicked (window_x, window_y)
    {
        // ensure doubleclicked on this element
        if (!this.is_mouse_over (window_x, window_y))
            return false;
        // pass doubleclick along to icons
        for (let file of this.files)
        {
            let was_doubleclicked = file.doubleClicked (this.x+window_x, this.y+window_y);
            if (was_doubleclicked) 
            {
                // check if the doubleclick was on a directory
                // doubleclicking directory should change current file explorer
                if (file.file_obj instanceof Directory)
                {
                    if (this.dir_change_callback != null)
                        this.dir_change_callback (file.file_obj);
                }
                return true;
            }
        }
        return true;
    }

    //====================================================================

    keyPressed ()
    {
        // only accept keypresses if this is focused
        // ensure this is focused
        if (!this.is_focused)
            return;
        // cursor movement
        // cursor left (if not already all the way left)
        if (keyCode == LEFT_ARROW && this.cursor_pos > 0)
        {
            // // if we were holding shift and nothing was selected, start selection
            // if (keyIsDown (SHIFT) && this.selection_cursor_start == -1)
            //     this.selection_cursor_start = this.cursor_pos;
            // // if we werent holding shift, then reset selection cursor
            // if (!keyIsDown (SHIFT))
            //     this.selection_cursor_start = -1;
            // // move cursor left
            // --this.cursor_pos;
        }
        // cursor right (if not already all the way right)
        else if (keyCode == RIGHT_ARROW && this.cursor_pos < this.value.length)
        {
            // // if we were holding shift and nothing was selected, start selection
            // if (keyIsDown (SHIFT) && this.selection_cursor_start == -1)
            //     this.selection_cursor_start = this.cursor_pos;
            // // if we werent holding shift, then reset selection cursor
            // if (!keyIsDown (SHIFT))
            //     this.selection_cursor_start = -1;
            // // move cursor right
            // ++this.cursor_pos;
        }

        // deleting files
        if (keyCode == BACKSPACE || keyCode == DELETE)
        {

        }
    }

    //====================================================================

    x_to_nearest_index (window_x, window_y, x)
    {
        // noStroke ();
        // fill (this.text_color);
        // textSize (this.text_size);
        // textAlign (LEFT, CENTER);
        // textFont (this.text_font);
        // let inner_padding = 5;
        // let text_x = this.x+window_x+inner_padding;
        // let new_cursor_pos = 0;
        // for (let i = 0; i < this.value.length+1; ++i)
        // {
        //     let lhs_str = this.value.substring (0, i);
        //     let new_width = textWidth (lhs_str);
        //     // check if mouse is left of this char
        //     if (x < text_x+new_width)
        //     {
        //         return new_cursor_pos;
        //     }
        //     ++new_cursor_pos;
        // }
        // return this.value.length;
    }

    //====================================================================

    // filename is separate for the case of '.' and '..'
    add_file (file_name, file_obj)
    {
        this.files.push (new WindowFileIcon (this.x, this.y, file_name, file_obj.icon, file_obj.open_with_application, file_obj, this, {}));
    }

    //====================================================================

    // draw file display to the canvas
    show (window_x, window_y)
    {
        push ();

        let x = this.x + window_x;
        let y = this.y + window_y;

        // draw background
        noStroke ();
        if (this.is_focused)
        {
            stroke ("#00BCFF");
            strokeWeight (1);
        }
        fill (this.background_color);
        rect (x, y, this.width, this.height);

        // draw files
        // arrange in a grid
        let padding = 5;
        let i = padding;
        let j = padding;
        for (let file of this.files)
        {
            // update grid position
            file.x = j;
            file.y = i;
            // draw file
            // x and y is not relative to window, but rather to this file display
            file.show (x, y);
            // move to next position
            j += file.width;
            // move to next row if we exceeded
            if (j+file.width > this.width)
            {
                j = padding;
                i += file.height;
            }
        }

        pop ();
    }
}

//========================================================================

class WindowFileIcon
{
    constructor (x, y, name, icon, open_with_application, file_obj, window_instance, {width=60, height=60, icon_width=25, icon_height=25, border_radius=0, border_color="#000", noStroke=true, text_size=25, background_color=[0,0,0,0], text_color="#fff", text_font="Arial"}={})
    {
        // element's position is relative to the app window's position
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.border_radius = border_radius;
        this.border_color = border_color;
        this.noStroke = noStroke;
        this.background_color = background_color;
        this.name = name;
        this.icon = icon;
        this.icon_width = icon_width;
        this.icon_height = icon_height;
        this.text_size = text_size;
        this.text_color = text_color;
        this.text_font = text_font;
        this.open_with_application = open_with_application;
        this.file_obj = file_obj;

        // controls
        this.window_instance = window_instance;
        this.is_focused = false;
        this.is_being_pressed = false;

        // popup text
        this.mouse_paused_counter = 0;
        this.popup_text = name;
        this.has_popup = false;

    }

    //====================================================================

    is_mouse_over (window_x, window_y)
    {
        let xlow  = this.x + window_x;
        let xhigh = xlow + this.width;
        let ylow  = this.y + window_y;
        let yhigh = ylow + this.height;
        return xlow < mouseX && mouseX < xhigh && ylow < mouseY && mouseY < yhigh;
    }

    //====================================================================

    pressed (window_x, window_y)
    {
        // remove popup
        if (this.has_popup)
        {
            mouseHoverPopUpManager.remove_popup ();
            this.has_popup = false;
        }
        if (this.is_mouse_over (window_x, window_y))
        {
            this.is_being_pressed = true;
            this.is_focused = true;
            return true;
        }
        // mouse press is off of file display
        // unfocus
        this.is_focused = false;
        return false;
    }

    //====================================================================

    released (window_x, window_y)
    {
        // remove popup
        if (this.has_popup)
        {
            mouseHoverPopUpManager.remove_popup ();
            this.has_popup = false;
        }
        if (this.is_being_pressed && this.is_mouse_over (window_x, window_y))
        {

        }
        this.is_being_pressed = false;
    }

    //====================================================================

    doubleClicked (window_x, window_y)
    {
        // remove popup
        if (this.has_popup)
        {
            mouseHoverPopUpManager.remove_popup ();
            this.has_popup = false;
        }
        // ensure doubleclicked on this element
        if (!this.is_mouse_over (window_x, window_y))
            return false;
        // ensure this is not a directory
        // FileDisplay will handle doubleclicks to directories
        if (this.file_obj instanceof Directory)
            return true;
        // open this file with the given application
        let app_window = new this.open_with_application (0, 0);
        // **create taskbar app?
        windows.push (app_window);
        is_a_window_focused = true;
        // was doubleclicked on so return true
        return true;
    }

    //====================================================================

    keyPressed ()
    {
        // only accept keypresses if this is focused
        // ensure this is focused
        if (!this.is_focused)
            return;
        // Nothing
    }

    //====================================================================

    update ()
    {
        // move app if being dragged
        if (this.is_dragging)
        {
            // this.x = mouseX + this.offset_x;
            // this.y = mouseY + this.offset_y;
            // // ensure app doesnt leave top of screen
            // if (this.y < 0)
            //     this.y = 0;
            // // ensure app doesnt go below taskbar
            // if (this.y+this.height > windowHeight-taskbar_height)
            //     this.y = windowHeight-taskbar_height-this.height;
            // // ensure the whole app cannot leave right side of screen
            // // arbitrary 50 pixel buffer
            // if (this.x+50 > windowWidth)
            //     this.x = windowWidth-50;
            // // ensure the whole app cannot leave left side of screen
            // if (this.x+this.width-50 < 0)
            //     this.x = -this.width+50;
        }
    }

    //====================================================================

    // draw file display to the canvas
    show (window_x, window_y)
    {
        push ();

        let x = this.x + window_x;
        let y = this.y + window_y;

        // background
        noStroke ();
        fill (this.background_color);
        rect (x, y, this.width, this.height, this.border_radius);

        // popup text
        // display if mouse was hovering at rest for 0.5 sec over this
        // mouse is at rest over icon
        if (mouseX == pmouseX && mouseY == pmouseY && this.is_mouse_over (window_x, window_y))
        {
            // advance "paused" counter by one frame
            this.mouse_paused_counter++;
            // draw popup if counter reached 0.5 sec, if not already added
            if (this.mouse_paused_counter / frameRate () > 0.5 && !mouseHoverPopUpManager.has_popup)
            {
                mouseHoverPopUpManager.add_popup (this.popup_text);
                this.has_popup = true;
            }
        }
        // mouse moving
        else if (!(mouseX == pmouseX && mouseY == pmouseY))
        {
            // reset "paused" counter
            this.mouse_paused_counter = 0;
            // if mouse exited and we had a popup, remove popup
            if (!this.is_mouse_over (window_x, window_y) && this.has_popup)
            {
                mouseHoverPopUpManager.remove_popup ();
                this.has_popup = false;
            }
        }

        // highlighting mouse over
        if ((this.is_mouse_over (window_x, window_y) && !this.is_being_pressed) || this.is_focused)
        {
            // highlight icon
            noStroke ();
            fill (255,255,255,25);
            rect (x, y, this.width, this.height, 10);
        }

        // highlight more if mouse pressed
        if (this.is_being_pressed)
        {
            noStroke ();
            fill (255,255,255,100);
            rect (x, y, this.width, this.height, 10);
        }

        // draw icon
        let widget_center_x = x + this.width / 2;
        let widget_center_y = y + this.height / 2;
        if (this.icon != null)
            image (this.icon, widget_center_x-this.icon_width/2, y+5, this.icon_width, this.icon_height);

        // draw text
        noStroke ();
        fill (255);
        let text_size = 10;
        textSize (text_size);
        textFont ("Arial");
        textWrap (WORD);
        textAlign(CENTER, TOP);
        let wrap_width = this.width;
        text (this.name, x, y+5+this.icon_height+5, wrap_width);

        pop ();
    }

}

//========================================================================
