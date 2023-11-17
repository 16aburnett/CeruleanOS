// GameVM
// Author: Amy Burnett
//========================================================================
// Globals

let computer_off_background_color = "#000";
let desktop_background_color = "#333";

let taskbar_height = 50;

let windows = [];

let is_a_window_focused = true;

let is_wifi_on = true;

//========================================================================

class TaskBarButton
{
    constructor (x, y, name)
    {
        this.x = x;
        this.y = y;
        this.name = name;

        this.width = taskbar_height-10;
        this.height = taskbar_height-10;

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
            // should this be moved out of the class/function?
            windows.push (new Window (0, 0));
            // focus the new window
            is_a_window_focused = true;
        }
    }
    
    show (x, y)
    {
        this.x = x;
        this.y = y;
        noStroke ();
        fill ("lime");
        rect (this.x, this.y, this.width, this.height);
        fill ("black");
        let text_height = 24;
        textSize (text_height);
        let text_width = textWidth (this.name);
        text (this.name, this.x+text_width/2.5, this.y+this.height/2+text_height/3);
    }
}

let create_window_button;

// Images
let taskbar_wifi_icon_full;
let taskbar_wifi_icon_empty;
let taskbar_battery_icon_0;
let taskbar_battery_icon_25;
let taskbar_battery_icon_50;
let taskbar_battery_icon_75;
let taskbar_battery_icon_full;
let taskbar_settings_icon;
let taskbar_location_icon;

let battery_widget;
let battery_charge_percent = 100;

let wifi_widget;
let wifi_state = 1;
let date_time_widget;

let is_location_being_requested = false;
let location_widget;

let settings_widget;

let taskbar_apps = [];

let taskbar_widgets = [];

//========================================================================

function preload ()
{
    taskbar_wifi_icon_full     = loadImage ('assets/wifi_full.png');
    taskbar_wifi_icon_empty    = loadImage ('assets/wifi_empty.png');
    taskbar_battery_icon_0     = loadImage ('assets/battery_0.png');
    taskbar_battery_icon_25    = loadImage ('assets/battery_25.png');
    taskbar_battery_icon_50    = loadImage ('assets/battery_50.png');
    taskbar_battery_icon_75    = loadImage ('assets/battery_75.png');
    taskbar_battery_icon_full  = loadImage ('assets/battery_full.png');
    taskbar_settings_icon      = loadImage ('assets/settings_icon.png');
    taskbar_location_icon      = loadImage ('assets/location.png');
}

//========================================================================

function setup ()
{
    createCanvas (windowWidth, windowHeight);

    // setup taskbar apps
    create_window_button = new TaskBarButton (5, 5, "+1");

    // setup widgets
    date_time_widget = new TaskBarWidget_DateAndTime (0, 0, {
        is_custom_display:true,
    });
    battery_widget = new TaskBarWidget_Icon (0, 0, {
        icon_width:18,
        icon_height:18,
        icon_image_states:[
            taskbar_battery_icon_full,
            taskbar_battery_icon_75,
            taskbar_battery_icon_50,
            taskbar_battery_icon_25,
            taskbar_battery_icon_0
        ],
        default_state:0
    });
    wifi_widget = new TaskBarWidget_Icon (0, 0, {
        icon_width:18,
        icon_height:18,
        icon_image_states:[
            taskbar_wifi_icon_full,
            taskbar_wifi_icon_empty
        ],
        default_state:0
    });
    location_widget = new TaskBarWidget_Icon (0, 0, {
        icon_width:18,
        icon_height:18,
        icon_image_states:[
            taskbar_location_icon
        ],
        default_state:0
    });
    settings_widget = new TaskBarWidget_Icon (0, 0, {
        icon_width:18,
        icon_height:18,
        icon_image_states:[
            taskbar_settings_icon
        ],
        default_state:0
    });

}

//========================================================================

function draw ()
{
    background (computer_off_background_color);
    cursor (ARROW);

    draw_desktop ();

    // draw_terminal ();
}

//========================================================================

function windowResized ()
{
    // scale/resize windows
    for (let window of windows)
    {
        window.resize (width, height);
    }
    createCanvas (windowWidth, windowHeight);
}

//========================================================================

function draw_desktop ()
{
    // draw desktop background
    textFont ("Arial");
    background (desktop_background_color);
    let x = windowWidth / 2;
    let y = windowHeight / 2;
    let background_text = "CeruleanOS";
    let background_text_height = 48;
    textSize (background_text_height);
    let background_text_width = textWidth (background_text);
    let background_text_color = "white";
    fill (background_text_color);
    text (background_text, x-background_text_width/2, y-background_text_height/2);

    // draw desktop icons

    // draw windows
    for (let wi = 0; wi < windows.length; ++wi)
    {
        let window = windows[wi];
        // mark window as focused if it is the last
        if (is_a_window_focused && wi+1 == windows.length)
            window.is_focused = true;
        // otherwise, it is not focused
        else
            window.is_focused = false;
        window.update ();
        window.show ();
    }

    // draw taskbar
    textFont ("Arial");
    let taskbar_width = windowWidth;
    let taskbar_color = "#222";
    y = windowHeight - taskbar_height;
    x = 0;
    fill (taskbar_color);
    noStroke ();
    rect (x, y, taskbar_width, taskbar_height);
    // taskbar: apps
    textSize (12);
    fill ("white");
    // text ("left", x, y+taskbar_height/2+6);
    create_window_button.show (x+5, y+5);
    // taskbar: time
    let widget_curr_x = windowWidth;
    fill ("white");
    let time_padding_right = 20;
    let time_text_height = 12;
    textSize (time_text_height);
    let hour_24 = hour ();
    let hour_12 = (11 + hour_24) % 12 + 1;
    let is_am = hour_24 < 12;
    let padded_minute = ("0" + minute()).slice (-2);
    let time_str = `${hour_12}:${padded_minute} ${is_am ? "AM" : "PM"}`;
    let text_width = textWidth (time_str);
    // taskbar: date
    let date_str = `${month()}/${day()}/${year()}`;
    textSize (time_text_height);
    let date_text_width = textWidth (date_str);
    widget_curr_x = widget_curr_x-date_text_width-time_padding_right;
    date_time_widget.show (widget_curr_x, y+5, width=date_text_width+time_padding_right);
    // taskbar: widgets
    // taskbar: widgets: battery
    widget_curr_x = windowWidth-date_text_width-time_padding_right-battery_widget.width;
    battery_widget.show (widget_curr_x, y+5);
    // taskbar: widgets: wifi
    widget_curr_x = widget_curr_x-wifi_widget.width;
    wifi_widget.show (widget_curr_x, y+5);
    // taskbar: widgets: location services
    if (is_location_being_requested)
    {
        widget_curr_x = widget_curr_x-location_widget.width;
        location_widget.show (widget_curr_x, y+5);
    }
    // taskbar: widgets: settings
    widget_curr_x = widget_curr_x-settings_widget.width;
    settings_widget.show (widget_curr_x, y+5);

}

//========================================================================
//=== CONTROLS ===========================================================
//========================================================================

function mousePressed ()
{
    // assume no window is focused
    // and fix it if we pressed on a window
    is_a_window_focused = false;
    // mouse press in reverse draw order
    // so we press windows in the front before back
    for (let wi = windows.length-1; wi >= 0; --wi)
    {
        let window = windows[wi];
        let was_pressed = window.pressed ();
        // check for exit button
        if (window.is_mouse_over_exit_button ())
        {
            // delete window
            windows.splice (wi, 1);
            break;
        }
        // break so we only press one window at a time
        if (was_pressed)
        {
            // we clicked this window,
            // so let's focus it and bring it to the front of the draw order
            windows.splice (wi, 1);
            windows.push (window);
            is_a_window_focused = true;
            break;
        }
    }

    // we need a better system here to ensure all apps and widgets can be pressed
    // apps
    create_window_button.pressed ();

    // widgets
    date_time_widget.pressed ();
    battery_widget.pressed ();
    wifi_widget.pressed ();
    if (is_location_being_requested)
        location_widget.pressed ();
    settings_widget.pressed ();
}

function mouseReleased ()
{
    for (let window of windows)
    {
        window.released ();
    }

    // apps
    create_window_button.released ();

    // widgets
    date_time_widget.released ();
    battery_widget.released ();
    wifi_widget.released ();
    location_widget.released ();
    settings_widget.released ();
}

//========================================================================
