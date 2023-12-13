// CeruleanOS: popups
// Author: Amy Burnett
//========================================================================
// Globals


//========================================================================

class MouseHoverPopUpManager
{
    constructor ()
    {
        // when a popup is created,
        // dont draw until this delay is up
        this.draw_delay = 0.5 * frameRate ();
        this.popup_text = "";
        this.has_popup = false;
        this.x = 0;
        this.y = 0;
    }

    add_popup (text)
    {
        this.draw_delay = 0.5 * frameRate ();
        this.popup_text = text;
        this.has_popup = true;
        // position where the mouse is
        this.x = mouseX;
        this.y = mouseY;
    }

    remove_popup ()
    {
        this.has_popup = false;
    }

    // shows the current popup, if there is one
    show ()
    {
        // ensure we have a popup
        if (!this.has_popup || !this.popup_text)
            return;
        // ensure draw delay is not up
        if (this.draw_delay > 0)
        {
            // draw delay counts the number of frames
            // so decrement the frames and exit
            this.draw_delay--;
            return;
        }
        // ensure we have text to display
        if (this.popup_text == "")
            return;
        // we are allowed to draw the popup now
        push ();

        // figure out popup dimensions
        let text_size = 10;
        textFont ("Arial");
        textSize (text_size);
        textStyle (NORMAL);
        textAlign (LEFT, CENTER);
        textWrap (CHAR);
        let padding = 7;
        let width = textWidth (this.popup_text);

        // ensure width does not exceed the max width
        // max width is only 75% the width of the screen
        let max_width = windowWidth * .75;
        if (width > max_width) width = max_width;
        let i = 0;
        for ( ; i < this.popup_text.length; ++i)
        {
            let substr_width = textWidth (this.popup_text.substring (0, i));
            if (substr_width > max_width)
                break;
        }
        let resized_str = this.popup_text.substring (0, i);
        // add an ellipsis, if the string was too long
        if (i < this.popup_text.length)
        {
            resized_str += "...";
            width += textWidth ("...") + padding;
        }
        let height = text_size + 2*padding;

        // estimated dimensions of the cursor
        // for positioning the popup under the cursor
        let cursor_width = 10;
        let cursor_height = 15;
        // constantly move the popup with the cursor
        // let x = mouseX + cursor_width;
        // let y = mouseY + cursor_height;
        // leave popup where the cursor was initially
        let x = this.x + cursor_width;
        let y = this.y + cursor_height;

        // ensure popup does not go off the screen
        if (x + width + padding*2 > windowWidth) x = windowWidth - width - padding*2; 
        if (y + height > windowHeight) y = y - cursor_height - height;

        // draw shadow
        // this is only a single static-fill shadow, 
        // perhaps it might be better to add a gradient
        noStroke ();
        fill (0,0,0,60);
        let shadow_border_radius = 4;
        let shadow_offset_x = 2;
        let shadow_offset_y = 2;
        let shadow_spread = 4;
        rect (x+shadow_offset_x-shadow_spread/2, y+shadow_offset_y-shadow_spread/2, width+padding*2+shadow_spread, height+shadow_spread, shadow_border_radius);

        // draw background
        stroke ("#ddd");
        strokeWeight (0.25);
        // noStroke ();
        fill ("#333");
        let border_radius = 3;
        rect (x, y, width+padding*2, height, border_radius);

        // draw text
        noStroke ();
        fill (255);
        textFont ("Arial");
        textSize (text_size);
        textStyle (NORMAL);
        textAlign (LEFT, CENTER);
        textWrap (CHAR);
        text (resized_str, x+padding, y+(height/2));

        pop ();
    }
}