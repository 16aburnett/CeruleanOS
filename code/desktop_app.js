// GameVM
// desktop clickable icons
// Author: Amy Burnett
//========================================================================
// Globals

//========================================================================

class DesktopApp
{
    constructor (x, y, {width=60, height=60, app_icon_image=null, app_window=null, name="<generic_app>"}={})
    {
        // top left point of the app (window space)
        this.x = x;
        this.y = y;
        // size of the app (not the content)
        this.width = width;
        this.height = height;

        this.is_dragging = false;
        this.offset_x = 0;
        this.offset_y = 0;
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

    pressed ()
    {
        if (this.is_mouse_over ())
        {
            this.is_dragging = true;
            // we probably didnt press at x, y so record the difference
            this.offset_x = this.x - mouseX;
            this.offset_y = this.y - mouseY;
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
            // // create new app window
            // this.current_app_window = new this.app_window (0, 0);
            // // **create taskbar app?
            // windows.push (this.current_app_window);
            // is_a_window_focused = true;
        }
        this.is_dragging = false;
        this.is_being_pressed = false;
    }

    doubleClicked ()
    {
        let was_double_clicked = false;
        if (this.is_mouse_over ())
        {
            was_double_clicked = true;
            // create new app window
            this.current_app_window = new this.app_window (0, 0);
            // **create taskbar app?
            windows.push (this.current_app_window);
            is_a_window_focused = true;
        }
        return was_double_clicked;
    }

    update ()
    {
        // move app if being dragged
        if (this.is_dragging)
        {
            this.x = mouseX + this.offset_x;
            this.y = mouseY + this.offset_y;
            // ensure app doesnt leave top of screen
            if (this.y < 0)
                this.y = 0;
            // ensure app doesnt go below taskbar
            if (this.y+this.height > windowHeight-taskbar_height)
                this.y = windowHeight-taskbar_height-this.height;
            // ensure the whole app cannot leave right side of screen
            // arbitrary 50 pixel buffer
            if (this.x+50 > windowWidth)
                this.x = windowWidth-50;
            // ensure the whole app cannot leave left side of screen
            if (this.x+this.width-50 < 0)
                this.x = -this.width+50;
        }
    }

    show ()
    {
        // mouse hovering over this icon
        if (this.is_mouse_over () && !this.is_being_pressed)
        {
            // popup text
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
            
            // highlight icon
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
            image (this.app_icon_image, widget_center_x-this.icon_width/2, this.y+5, this.icon_width, this.icon_height);

        // draw app name
        noStroke ();
        fill (255);
        let text_size = 10;
        textSize (text_size);
        textFont ("Arial");
        textWrap (WORD);
        textAlign(CENTER);
        let wrap_width = this.width;
        text (this.name, this.x, this.y+5+this.icon_height+5, wrap_width);
        // this is kinda dumb but just reset to default text alignment
        // - so i dont have to set it everytime i draw text
        textAlign(LEFT);
    }
}