// GameVM - window
// Author: Amy Burnett
//========================================================================
// Globals

//========================================================================

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

    resize (prev_window_width, prev_window_height)
    {
        // let width_ratio = prev_window_width / windowWidth;
        // let height_ratio = prev_window_height / windowHeight;
        // this.width = max(this.width / width_ratio, this.minimum_width);
        // this.height = max(this.height / height_ratio, this.minimum_height);
        // // ensure dims dont get larger than window
        // this.width = min (this.width, windowWidth);
        // this.height = min (this.height, windowHeight);

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

        return was_pressed_on;
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
        fill (window_background_color);
        rect (this.x, this.y, this.width, this.height);
        // draw window header
        stroke (0);
        strokeWeight (1);
        if (this.is_focused)
            fill (this.header_color);
        else
            fill ("#333");
        rect (this.x, this.y, this.width, this.header_height);
        // draw header text
        textFont ("Arial");
        let header_text_height = 12;
        textSize (header_text_height);
        noStroke ();
        if (this.is_focused)
            fill ("white");
        else
            fill ("#ccc");
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

