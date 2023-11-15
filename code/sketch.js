// GameVM
// Author: Amy Burnett
//========================================================================
// Globals

let computer_off_background_color = "#000";
let desktop_background_color = "#333";

let taskbar_height = 50;

// resizeable feature inspired by https://codepen.io/DanielHarty/pen/vRRxxL?editors=0010
class Window
{
    constructor (x, y)
    {
        this.is_dragging = false;
        this.is_rollover_header = false;
        this.offset_x = 0;
        this.offset_y = 0;
        this.x = x;
        this.y = y;
        this.width = 500;
        this.height = 500;

        this.header_height = 25;
        this.header_color = "#222";

        this.title = "Generic Window";

        // resizing
        this.is_resizing = false;
        this.resize_box_size = 15;
        this.minimum_width = 300;
        this.minimum_height = 100;

        // header
        // exit
        // maximize
        // minimize

    }

    is_mouse_over ()
    {
        let xlow  = this.x;
        let xhigh = xlow + this.width;
        let ylow  = this.y;
        let yhigh = ylow + this.height;
        return xlow < mouseX && mouseX < xhigh && ylow < mouseY && mouseY < yhigh;
    }

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

    is_mouse_over_resize_box ()
    {
        let xlow  = this.x+this.width-this.resize_box_size;
        let xhigh = this.x + this.width;
        let ylow  = this.y+this.height-this.resize_box_size;
        let yhigh = this.y + this.height;
        return xlow < mouseX && mouseX < xhigh && ylow < mouseY && mouseY < yhigh;
    }

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

    pressed ()
    {
        // check if mouse clicked on window header
        if (this.is_mouse_over_header ())
        {
            this.is_dragging = true;
            // we probably didnt press at x, y so record the difference
            this.offset_x = this.x - mouseX;
            this.offset_y = this.y - mouseY;
        }

        if (this.is_mouse_over_resize_box ())
        {
            this.is_resizing = true;
            this.offset_x = (this.x + this.width) - mouseX;
            this.offset_y = (this.y + this.height) - mouseY;
        }
    }

    released ()
    {
        this.is_dragging = false;
        this.is_resizing = false;
    }

    show ()
    {
        // draw window background
        let window_background_color = "#eee";
        stroke (0);
        strokeWeight (1);
        fill (window_background_color);
        rect (this.x, this.y, this.width, this.height);
        // draw window header
        stroke (0);
        strokeWeight (1);
        fill (this.header_color);
        rect (this.x, this.y, this.width, this.header_height);
        // draw header text
        textFont ("Arial");
        let header_text_height = 12;
        textSize (header_text_height);
        noStroke ();
        fill ("white");
        text (this.title, this.x+header_text_height/2, this.y+header_text_height*1.5);

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
            fill ("#555");
            rect (this.x+this.width-exit_button_width-header_button_padding-maximize_button_width-header_button_padding*2-minimize_button_width-header_button_padding*2-header_button_padding, this.y, minimize_button_width+header_button_padding*2, this.header_height);
            cursor (HAND);
        }
        noStroke ();
        fill ("white");
        text (minimize_button_text, this.x+this.width-exit_button_width-header_button_padding-maximize_button_width-header_button_padding*2-minimize_button_width-header_button_padding*2, this.y+this.header_height/2+minimize_button_height/3);

    }
}

let generic_window = new Window (0, 0);

//========================================================================

function setup ()
{
    createCanvas (windowWidth, windowHeight);

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
    generic_window.update ();
    generic_window.show ();

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
    // taskbar: time
    let time_padding_right = 20;
    let time_text_height = 12;
    textSize (time_text_height);
    let time_str = `${hour()}:${minute()}`;
    let text_width = textWidth (time_str);
    text (time_str, windowWidth-text_width-time_padding_right, y+taskbar_height/3+time_text_height/2);
    // taskbar: date
    let date_str = `${month()}/${day()}/${year()}`;
    textSize (time_text_height);
    let date_text_width = textWidth (date_str);
    text (date_str, windowWidth-date_text_width-time_padding_right, y+taskbar_height*2/3+time_text_height/2);
    // taskbar: widgets

}

//========================================================================
//=== CONTROLS ===========================================================
//========================================================================

function mousePressed ()
{
    generic_window.pressed ();
}

function mouseReleased ()
{
    generic_window.released ();
}

//========================================================================
