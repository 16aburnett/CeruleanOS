// GameVM
// Author: Amy Burnett
//========================================================================
// Globals

let computer_off_background_color = "#000";
let desktop_background_color = "#333";

let taskbar_height = 50;

let windows = [];

let is_a_window_focused = true;

let generic_window_button0;
let generic_window_button1;
let generic_window_button2;
let generic_window_button3;

let terminal_window_button;

// Images
let taskbar_icon_generic_window;
let taskbar_icon_wifi_full;
let taskbar_icon_wifi_empty;
let taskbar_icon_battery_0;
let taskbar_icon_battery_25;
let taskbar_icon_battery_50;
let taskbar_icon_battery_75;
let taskbar_icon_battery_full;
let taskbar_icon_settings;
let taskbar_icon_location;
let taskbar_icon_terminal;
let taskbar_icon_file_explorer;
let taskbar_icon_calculator;
let taskbar_icon_messages;
let taskbar_icon_sound0;
let taskbar_icon_sound1;
let taskbar_icon_sound2;
let taskbar_icon_sound3;
let icon_trash_bin;
let icon_file;
let icon_backspace;

// Date and time
let date_time_widget;

// Battery
let battery_charge_percent = 100;
let battery_widget;

// Sound
let sound_volume_level = 35;
let sound_widget;

// Wifi/internet
const WIFI_DISCONNECTED = 0;
const WIFI_CONNECTED    = 1;
let wifi_state = WIFI_CONNECTED;
let wifi_widget;

// Location services
let is_location_being_requested = true;
let location_widget;

let settings_widget;

let taskbar_apps = [];
let taskbar_widgets = [];

let desktop_apps = [];

let desktop_app_trash;
let desktop_app_generic;
let desktop_app_messages;
let desktop_app_calculator;
let desktop_app_file_explorer;
let desktop_app_terminal;
let desktop_app_folder0;
let desktop_app_folder1;
let desktop_app_folder2;
let desktop_app_file0;
let desktop_app_file1;
let desktop_app_file2;
let desktop_app_file3;
let desktop_app_file4;

//========================================================================

// preload all images before drawing canvas
function preload ()
{
    taskbar_icon_generic_window = loadImage ('assets/window.png');
    taskbar_icon_wifi_full      = loadImage ('assets/wifi_full.png');
    taskbar_icon_wifi_empty     = loadImage ('assets/wifi_empty.png');
    taskbar_icon_battery_0      = loadImage ('assets/battery_0.png');
    taskbar_icon_battery_25     = loadImage ('assets/battery_25.png');
    taskbar_icon_battery_50     = loadImage ('assets/battery_50.png');
    taskbar_icon_battery_75     = loadImage ('assets/battery_75.png');
    taskbar_icon_battery_full   = loadImage ('assets/battery_full.png');
    taskbar_icon_settings       = loadImage ('assets/settings_icon.png');
    taskbar_icon_location       = loadImage ('assets/location.png');
    taskbar_icon_terminal       = loadImage ('assets/terminal.png');
    taskbar_icon_file_explorer  = loadImage ('assets/file_explorer.png');
    taskbar_icon_calculator     = loadImage ('assets/calculator_light.png');
    taskbar_icon_messages       = loadImage ('assets/messages.png');
    taskbar_icon_sound0         = loadImage ('assets/sound0.png');
    taskbar_icon_sound1         = loadImage ('assets/sound1.png');
    taskbar_icon_sound2         = loadImage ('assets/sound2.png');
    taskbar_icon_sound3         = loadImage ('assets/sound3.png');
    icon_trash_bin              = loadImage ('assets/trash_bin.png');
    icon_file                   = loadImage ('assets/file.png');
    icon_backspace              = loadImage ('assets/backspace.png');
}

//========================================================================

function setup ()
{
    createCanvas (windowWidth, windowHeight);

    // setup taskbar apps
    generic_window_button0 = new TaskBarApp (0, 0, {
        app_icon_image:taskbar_icon_generic_window,
        app_window:Window
    });
    generic_window_button1 = new TaskBarApp (0, 0, {
        app_icon_image:taskbar_icon_messages,
        app_window:Window,
        name:"Messages"
    });
    generic_window_button2 = new TaskBarApp (0, 0, {
        app_icon_image:taskbar_icon_calculator,
        app_window:CalculatorAppWindow,
        name:"Calculator"
    });
    generic_window_button3 = new TaskBarApp (0, 0, {
        app_icon_image:taskbar_icon_file_explorer,
        app_window:Window,
        name:"File Explorer"
    });
    terminal_window_button = new TaskBarApp (0, 0, {
        app_icon_image:taskbar_icon_terminal,
        app_window:TerminalAppWindow,
        name:"Terminal"
    });

    // setup desktop apps
    desktop_app_trash = new DesktopApp (0, 0, {
        app_icon_image: icon_trash_bin,
        app_window:Window,
        name:"Trash Bin"
    });
    desktop_apps.push (desktop_app_trash);
    desktop_app_generic = new DesktopApp (0, 0, {
        app_icon_image: taskbar_icon_generic_window,
        app_window:Window,
        name:"Generic Desktop App"
    });
    desktop_apps.push (desktop_app_generic);
    desktop_app_messages = new DesktopApp (0, 0, {
        app_icon_image: taskbar_icon_messages,
        app_window:Window,
        name:"Messages"
    });
    desktop_apps.push (desktop_app_messages);
    desktop_app_calculator = new DesktopApp (0, 0, {
        app_icon_image: taskbar_icon_calculator,
        app_window:CalculatorAppWindow,
        name:"Calculator"
    });
    desktop_apps.push (desktop_app_calculator);
    desktop_app_file_explorer = new DesktopApp (0, 0, {
        app_icon_image: taskbar_icon_file_explorer,
        app_window:Window,
        name:"File Explorer"
    });
    desktop_apps.push (desktop_app_file_explorer);
    desktop_app_terminal = new DesktopApp (0, 0, {
        app_icon_image: taskbar_icon_terminal,
        app_window:TerminalAppWindow,
        name:"Terminal"
    });
    desktop_apps.push (desktop_app_terminal);
    desktop_app_folder0 = new DesktopApp (0, 0, {
        app_icon_image: taskbar_icon_file_explorer,
        app_window:Window,
        name:"Folder 0"
    });
    desktop_apps.push (desktop_app_folder0);
    desktop_app_folder1 = new DesktopApp (0, 0, {
        app_icon_image: taskbar_icon_file_explorer,
        app_window:Window,
        name:"Folder 1"
    });
    desktop_apps.push (desktop_app_folder1);
    desktop_app_folder2 = new DesktopApp (0, 0, {
        app_icon_image: taskbar_icon_file_explorer,
        app_window:Window,
        name:"Folder 2"
    });
    desktop_apps.push (desktop_app_folder2);
    desktop_app_file0 = new DesktopApp (0, 0, {
        app_icon_image: icon_file,
        app_window:Window,
        name:"File 0"
    });
    desktop_apps.push (desktop_app_file0);
    desktop_app_file1 = new DesktopApp (0, 0, {
        app_icon_image: icon_file,
        app_window:Window,
        name:"File 1"
    });
    desktop_apps.push (desktop_app_file1);
    desktop_app_file2 = new DesktopApp (0, 0, {
        app_icon_image: icon_file,
        app_window:Window,
        name:"File 2"
    });
    desktop_apps.push (desktop_app_file2);
    desktop_app_file3 = new DesktopApp (0, 0, {
        app_icon_image: icon_file,
        app_window:Window,
        name:"File 3"
    });
    desktop_apps.push (desktop_app_file3);
    desktop_app_file4 = new DesktopApp (0, 0, {
        app_icon_image: icon_file,
        app_window:Window,
        name:"File 4"
    });
    desktop_apps.push (desktop_app_file4);
    // align all desktop apps into non-overlapping rows/cols
    let desktop_app_padding = 4;
    let current_desktop_app_x = desktop_app_padding;
    let current_desktop_app_y = desktop_app_padding;
    for (let desktop_app of desktop_apps)
    {
        desktop_app.x = current_desktop_app_x;
        desktop_app.y = current_desktop_app_y;
        // go to next icon position below the current
        current_desktop_app_y += desktop_app.height + desktop_app_padding;
        // go to next column if we passed the taskbar
        if (current_desktop_app_y + desktop_app.height + desktop_app_padding >= (windowHeight-taskbar_height))
        {
            // increment column
            current_desktop_app_x += desktop_app.width + desktop_app_padding;
            current_desktop_app_y = desktop_app_padding;
        }

    }

    // setup widgets
    date_time_widget = new TaskBarWidget_DateAndTime (0, 0, {
        is_custom_display:true,
        name:"Date & Time"
    });
    battery_widget = new TaskBarWidget_Icon (0, 0, {
        icon_width:18,
        icon_height:18,
        icon_image_states:[
            taskbar_icon_battery_full,
            taskbar_icon_battery_75,
            taskbar_icon_battery_50,
            taskbar_icon_battery_25,
            taskbar_icon_battery_0
        ],
        default_state:0,
        name:"Battery"
    });
    sound_widget = new TaskBarWidget_Icon (0, 0, {
        icon_width:25,
        icon_height:25,
        icon_image_states:[
            taskbar_icon_sound0,
            taskbar_icon_sound1,
            taskbar_icon_sound2,
            taskbar_icon_sound3
        ],
        default_state:0,
        name:"Sound"
    });
    wifi_widget = new TaskBarWidget_Icon (0, 0, {
        icon_width:18,
        icon_height:18,
        icon_image_states:[
            taskbar_icon_wifi_full,
            taskbar_icon_wifi_empty
        ],
        default_state:0,
        name:"WiFi/Internet"
    });
    location_widget = new TaskBarWidget_Icon (0, 0, {
        icon_width:18,
        icon_height:18,
        icon_image_states:[
            taskbar_icon_location
        ],
        default_state:0,
        name:"Location Tracking"
    });
    settings_widget = new TaskBarWidget_Icon (0, 0, {
        icon_width:18,
        icon_height:18,
        icon_image_states:[
            taskbar_icon_settings
        ],
        default_state:0,
        name:"Settings"
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
    noStroke ();
    text (background_text, x-background_text_width/2, y-background_text_height/2);

    // draw desktop icons
    // draw in reverse order
    for (let desktop_app_i = desktop_apps.length-1; desktop_app_i >= 0; --desktop_app_i)
    {
        let desktop_app = desktop_apps[desktop_app_i];
        desktop_app.update ();
        desktop_app.show (desktop_app.x, desktop_app.y);
    }

    // draw windows
    for (let wi = 0; wi < windows.length; ++wi)
    {
        let window = windows[wi];
        // mark window as focused if it is the last
        if (is_a_window_focused && wi+1 == windows.length)
        {
            // mark window as focused
            window.is_focused = true;
        }
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
    let current_taskbar_app_x = x+5;
    generic_window_button0.show (current_taskbar_app_x, y+5);
    current_taskbar_app_x = current_taskbar_app_x + generic_window_button0.width;
    generic_window_button1.show (current_taskbar_app_x, y+5);
    current_taskbar_app_x = current_taskbar_app_x + generic_window_button1.width;
    generic_window_button2.show (current_taskbar_app_x, y+5);
    current_taskbar_app_x = current_taskbar_app_x + generic_window_button2.width;
    generic_window_button3.show (current_taskbar_app_x, y+5);
    current_taskbar_app_x = current_taskbar_app_x + generic_window_button3.width;
    terminal_window_button.show (current_taskbar_app_x, y+5);
    current_taskbar_app_x = current_taskbar_app_x + terminal_window_button.width;

    // taskbar: widgets
    let widget_curr_x = windowWidth;
    // taskbar: widgets: date & time
    widget_curr_x = widget_curr_x-date_time_widget.width;
    date_time_widget.show (widget_curr_x, y+5);
    // taskbar: widgets: battery
    widget_curr_x = widget_curr_x-battery_widget.width;
    battery_widget.show (widget_curr_x, y+5);
    // taskbar: widgets: sound
    widget_curr_x = widget_curr_x-sound_widget.width;
    sound_widget.show (widget_curr_x, y+5);
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

function minimize_window (window)
{
    // unfocus window
    window.is_focused = false;
    // move window to the start of the draw order list
    windows.splice (wi, 1);
    windows.unshift (window);
    // edge case: if there is only one window
    // then this window becomes focused again
    if (windows.length == 1)
    {
        is_a_window_focused = false;
    }
}

function mousePressed ()
{
    // we need a better system here to ensure all apps and widgets can be pressed
    // taskbar apps
    let was_pressed = generic_window_button0.pressed ();
    if (was_pressed) return;
    was_pressed = generic_window_button1.pressed ();
    if (was_pressed) return;
    was_pressed = generic_window_button2.pressed ();
    if (was_pressed) return;
    was_pressed = generic_window_button3.pressed ();
    if (was_pressed) return;
    was_pressed = terminal_window_button.pressed ();
    if (was_pressed) return;

    // taskbar widgets
    was_pressed = date_time_widget.pressed ();
    if (was_pressed) return;
    was_pressed = battery_widget.pressed ();
    if (was_pressed) return;
    was_pressed = sound_widget.pressed ();
    if (was_pressed) return;
    was_pressed = wifi_widget.pressed ();
    if (was_pressed) return;
    if (is_location_being_requested)
        was_pressed = location_widget.pressed ();
    if (was_pressed) return;
    was_pressed = settings_widget.pressed ();
    if (was_pressed) return;

    // windows
    // assume no window is focused
    // and fix it if we pressed on a window
    is_a_window_focused = false;
    // mouse press in reverse draw order
    // so we press windows in the front before back
    for (let wi = windows.length-1; wi >= 0; --wi)
    {
        let window = windows[wi];
        was_pressed = window.pressed ();
        // check for exit button
        if (window.is_mouse_over_exit_button ())
        {
            was_pressed = true;
            // update taskbar app (if there was one)
            if (windows[wi].taskbar_app)
                windows[wi].taskbar_app.current_app_window = null;
            // delete window
            windows.splice (wi, 1);
            return;
        }
        if (window.is_mouse_over_minimize_button ())
        {
            was_pressed = true;
            // unfocus window
            window.is_focused = false;
            // move window to the start of the draw order list
            windows.splice (wi, 1);
            windows.unshift (window);
            // edge case: if there is only one window
            // then this window becomes focused again
            if (windows.length == 1)
            {
                is_a_window_focused = false;
            }
            return;
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
    if (was_pressed) return;
    
    // desktop apps
    // this comes after windows because windows go infront of the desktop
    for (let desktop_app of desktop_apps)
    {
        was_pressed = desktop_app.pressed ();
        if (was_pressed) return;
    }
}

function mouseReleased ()
{
    // taskbar apps
    generic_window_button0.released ();
    generic_window_button1.released ();
    generic_window_button2.released ();
    generic_window_button3.released ();
    terminal_window_button.released ();

    // desktop apps
    for (let desktop_app of desktop_apps)
    {
        desktop_app.released ();
    }

    // taskbar widgets
    date_time_widget.released ();
    battery_widget.released ();
    sound_widget.released ();
    wifi_widget.released ();
    location_widget.released ();
    settings_widget.released ();

    for (let window of windows)
    {
        window.released ();
    }
}

function doubleClicked ()
{
    // we need a better system here to ensure all apps and widgets can be pressed
    // taskbar apps
    let was_pressed = generic_window_button0.doubleClicked ();
    if (was_pressed) return;
    was_pressed = generic_window_button1.doubleClicked ();
    if (was_pressed) return;
    was_pressed = generic_window_button2.doubleClicked ();
    if (was_pressed) return;
    was_pressed = generic_window_button3.doubleClicked ();
    if (was_pressed) return;
    was_pressed = terminal_window_button.doubleClicked ();
    if (was_pressed) return;

    // taskbar widgets
    was_pressed = date_time_widget.doubleClicked ();
    if (was_pressed) return;
    was_pressed = battery_widget.doubleClicked ();
    if (was_pressed) return;
    was_pressed = sound_widget.doubleClicked ();
    if (was_pressed) return;
    was_pressed = wifi_widget.doubleClicked ();
    if (was_pressed) return;
    if (is_location_being_requested)
        was_pressed = location_widget.doubleClicked ();
    if (was_pressed) return;
    was_pressed = settings_widget.doubleClicked ();
    if (was_pressed) return;

    // windows
    // assume no window is focused
    // and fix it if we pressed on a window
    is_a_window_focused = false;
    // mouse press in reverse draw order
    // so we press windows in the front before back
    for (let wi = windows.length-1; wi >= 0; --wi)
    {
        let window = windows[wi];
        was_pressed = window.doubleClicked ();
        // check for exit button
        if (window.is_mouse_over_exit_button ())
        {
            was_pressed = true;
            // update taskbar app (if there was one)
            if (windows[wi].taskbar_app)
                windows[wi].taskbar_app.current_app_window = null;
            // delete window
            windows.splice (wi, 1);
            return;
        }
        if (window.is_mouse_over_minimize_button ())
        {
            was_pressed = true;
            // unfocus window
            window.is_focused = false;
            // move window to the start of the draw order list
            windows.splice (wi, 1);
            windows.unshift (window);
            // edge case: if there is only one window
            // then this window becomes focused again
            if (windows.length == 1)
            {
                is_a_window_focused = false;
            }
            return;
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
    if (was_pressed) return;
    
    // desktop apps
    // this comes after windows because windows go infront of the desktop
    for (let desktop_app of desktop_apps)
    {
        was_pressed = desktop_app.doubleClicked ();
        if (was_pressed) return;
    }

}

//========================================================================
