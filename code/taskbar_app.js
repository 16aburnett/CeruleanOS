// GameVM
// apps for the taskbar
// Author: Amy Burnett
//========================================================================
// Globals

//========================================================================

class TaskBarApp
{
    constructor (x, y, {width=40, height=40, app_icon_image=null, app_window=null, name="<generic_app>"}={})
    {
        // top left point of the app (window space)
        this.x = x;
        this.y = y;
        // size of the app (not the content)
        this.width = width;
        this.height = height;

        this.is_being_pressed = false;

        this.app_icon_image = app_icon_image;
        this.icon_width = 25;
        this.icon_height = 25;

        this.current_app_window = null;
        this.app_window = app_window;

        this.name = name;
    }

    is_mouse_over ()
    {
        return this.x < mouseX && mouseX < this.x + this.width && this.y < mouseY && mouseY < this.y + this.height;
    }

    has_opened_window ()
    {
        return this.current_app_window != null;
    }

    is_window_focused ()
    {
        if (this.current_app_window == null)
            return false;
        return this.current_app_window.is_focused;
    }

    pressed ()
    {
        if (this.is_mouse_over ())
        {
            this.is_being_pressed = true;
            return true;
        }
        else
        {
            this.is_being_pressed = false;
            return false;
        }
    }
    
    released ()
    {
        // ensure the user pressed and released on this button
        // this enabled the user to press on but release off the button
        // to cancel the press if they want - small detail
        if (this.is_being_pressed && this.is_mouse_over ())
        {
            // if window is already opened
            if (this.has_opened_window ())
            {
                // if app is already focused - then minimize it
                if (this.current_app_window.is_focused)
                {
                    this.current_app_window.is_minimized = true;
                    // unfocus window
                    this.current_app_window.is_focused = false;
                    // move window to the start of the draw order list
                    // **really should have a linked list for this**
                    // windows.splice (wi, 1);
                    // windows.unshift (this.current_app_window);
                    // edge case: if there is only one window
                    // then this window becomes focused again
                    if (windows.length == 1)
                    {
                        is_a_window_focused = false;
                    }
                }
                // otherwise, then focus the window
                else
                {
                    // find window in focus order list and focus it
                    for (let wi = 0; wi < windows.length; ++wi)
                    {
                        let window = windows[wi];
                        if (window == this.current_app_window)
                        {
                            windows.splice (wi, 1);
                            windows.push (window);
                            is_a_window_focused = true;
                            window.is_minimized = false;
                            break;
                        }
                    }
                    is_a_window_focused = true;
                }
            }
            // if window is not already opened - create new app window
            if (!this.has_opened_window ())
            {
                this.current_app_window = new this.app_window (0, 0);
                // link widget with window
                // i dont really like this impl, I would prefer
                // if the widget checked if window was closed
                this.current_app_window.taskbar_app = this;
                windows.push (this.current_app_window);
                is_a_window_focused = true;
            }
        }
        this.is_being_pressed = false;
    }

    show (x, y)
    {
        // update x,y position
        // **this really should be in an update() function i guess
        // but that would add more steps for using this class
        // (aka requiring update() to be called for each app).
        this.x = x;
        this.y = y;
        // popup text
        if (this.is_mouse_over () && !this.is_being_pressed)
        {
            noStroke ();
            fill ("#222");
            let text_height = 12;
            textSize (text_height);
            let text_width = textWidth (this.name);
            let padding = 5;
            rect (this.x-padding, this.y-25-padding, text_width+padding*2, text_height+padding*2, 2);
            noStroke ();
            fill (255);
            text (this.name, this.x, this.y-25+text_height);
        }
        // highlight if mouse over or window is focused
        if ((this.is_mouse_over () || this.is_window_focused ()) && !this.is_being_pressed)
        {
            noStroke ();
            fill (255,255,255,25);
            rect (this.x, this.y, this.width, this.height, 10);
        }
        // highlight more if mouse pressed
        if (this.is_being_pressed)
        {
            noStroke ();
            fill (255,255,255,50);
            rect (this.x, this.y, this.width, this.height, 10);
        }
        // draw app icon image
        let widget_center_x = this.x + this.width / 2;
        let widget_center_y = this.y + this.height / 2;
        if (this.app_icon_image != null)
            image (this.app_icon_image, widget_center_x-this.icon_width/2, widget_center_y-this.icon_height/2, this.icon_width, this.icon_height);

        // draw open/focused indicator
        if (this.has_opened_window () && !this.is_window_focused ())
        {
            stroke (255, 255, 255, 100);
            strokeWeight (5);
            fill (255, 255, 255, 100);
            point (this.x+this.width/2, this.y+this.height-2.5);
        }
        if (this.is_window_focused ())
        {
            stroke (255, 255, 255, 100);
            strokeWeight (5);
            fill (255, 255, 255, 100);
            line (this.x+this.width/2-this.width/4, this.y+this.height-2.5, this.x+this.width/2+this.width/4, this.y+this.height-2.5);
        }
    }
}