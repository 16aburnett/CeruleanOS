// GameVM
// widgets for the taskbar
// Author: Amy Burnett
//========================================================================
// Globals

//========================================================================

// Generic taskbar widget
// This class handles all the common mechanics between widgets
// like the mouse hover, mouse pressed/released, popup memus, etc.
// This class does not actually display widget content.
// To display content for the widget, use one of inheritance children
// classes.
class TaskBarWidget
{
    constructor (x, y, {width=35, height=40}={})
    {
        // top left point of the widget (window space)
        this.x = x;
        this.y = y;
        // size of the widget (not the content)
        this.width = width;
        this.height = height;

        this.is_being_pressed = false;
    }

    is_mouse_over ()
    {
        return this.x < mouseX && mouseX < this.x + this.width && this.y < mouseY && mouseY < this.y + this.height;
    }

    pressed ()
    {
        if (this.is_mouse_over ())
            this.is_being_pressed = true;
        else
            this.is_being_pressed = false;
    }
    
    released ()
    {
        if (this.is_being_pressed && this.is_mouse_over ())
        {
            // do something?
        }
        this.is_being_pressed = false;
    }

    show (x, y, width=-1, height=-1)
    {
        // update x,y position
        // **this really should be in an update() function i guess
        // but that would add more steps for using this class
        // (aka requiring update() to be called for each widget).
        this.x = x;
        this.y = y;
        if (width != -1) this.width = width;
        if (height != -1) this.height = height;
        // highlight if mouse over
        if (this.is_mouse_over () && !this.is_being_pressed)
        {
            fill (255,255,255,25);
            rect (this.x, this.y, this.width, this.height, 10);
        }
        // highlight more if mouse pressed
        if (this.is_being_pressed)
        {
            fill (255,255,255,50);
            rect (this.x, this.y, this.width, this.height, 10);
        }
    }
}

//========================================================================

// these widgets draw an image icon as the widget content
// the image icon can have multiple states
class TaskBarWidget_Icon extends TaskBarWidget
{
    constructor (x, y, {width=35, height=40, icon_width=18, icon_height=18, icon_image_states=[], default_state=0, is_custom_display=false, show_custom_display=null}={})
    {
        super (x, y, {width:width, height:height, icon_width:icon_width, icon_height:icon_height, icon_image_states:icon_image_states, default_state:default_state, is_custom_display:true, show_custom_display:show_custom_display});
        
        this.icon_width = icon_width;
        this.icon_height = icon_height;
        this.icon_image_states = icon_image_states;
        this.state = default_state;
    }

    show (x, y, width=-1, height=-1)
    {
        // draw standard widget
        super.show (x, y, width, height);
        // draw widget content
        let widget_center_x = this.x + this.width / 2;
        let widget_center_y = this.y + this.height / 2;
        image (this.icon_image_states[this.state], widget_center_x-this.icon_width/2, widget_center_y-this.icon_height/2, this.icon_width, this.icon_height);
    }
}

//========================================================================

// this is the standard date and time widget
// which tells the user the current time and date
// this uses the user's OS date and time
class TaskBarWidget_DateAndTime extends TaskBarWidget
{
    constructor (x, y, {width=35, height=40, icon_width=18, icon_height=18, icon_image_states=[], default_state=0, is_custom_display=false, show_custom_display=null}={})
    {
        super (x, y, {width:width, height:height, icon_width:icon_width, icon_height:icon_height, icon_image_states:icon_image_states, default_state:default_state, is_custom_display:true, show_custom_display:show_custom_display});
    }

    show (x, y, width=-1, height=-1)
    {
        // ensure custom_display is set
        this.is_custom_display = true;
        super.show (x, y, width, height);
        // draw widget content
        fill ("white");
        let time_padding_right = 10;
        let time_text_height = 12;
        textSize (time_text_height);
        let hour_24 = hour ();
        let hour_12 = (11 + hour_24) % 12 + 1;
        let is_am = hour_24 < 12;
        let padded_minute = ("0" + minute()).slice (-2);
        let time_str = `${hour_12}:${padded_minute} ${is_am ? "AM" : "PM"}`;
        let text_width = textWidth (time_str);
        text (time_str, this.x+this.width-text_width-time_padding_right, y-5+taskbar_height/3+time_text_height/2);
        // taskbar: date
        let date_str = `${month()}/${day()}/${year()}`;
        textSize (time_text_height);
        let date_text_width = textWidth (date_str);
        text (date_str, this.x+this.width-date_text_width-time_padding_right, y-5+taskbar_height*2/3+time_text_height/2);
    }
}

//========================================================================
