// GameVM
// Simple calculator app
// Author: Amy Burnett
//========================================================================
// Globals

// operators
const CALCULATOR_OP_NONE = 0;
const CALCULATOR_OP_ADD  = 1;
const CALCULATOR_OP_SUB  = 2;
const CALCULATOR_OP_MUL  = 3;
const CALCULATOR_OP_DIV  = 4;

const UNICODE_ELLIPSES = '\u2026';

//========================================================================

class CalculatorAppWindow extends Window
{
    constructor (x, y)
    {
        super (x, y);

        this.background_color = "#333";
        this.title = "Calculator";
        this.icon = taskbar_icon_calculator;
        this.width = 300;
        this.height = 460;
        this.minimum_width = this.width;
        this.minimum_height = this.height;
        // move window to center of screen
        this.x = windowWidth/2-this.width/2;
        this.y = windowHeight/2-this.height/2;
        
        // buttons
        let window_padding = 10;
        let cell_padding = 5;
        let num_buttons_wide = 4;
        let cell_width = (this.width-2*window_padding-(num_buttons_wide-1)*cell_padding) / num_buttons_wide;
        let cell_height = cell_width;

        let button_panel_x = window_padding;
        let button_panel_y = this.header_height + window_padding + 60 + cell_padding;

        // row 0
        this.button_clear  = new WindowButton (button_panel_x + 0*(cell_width+cell_padding), button_panel_y + 0*(cell_height+cell_padding), "C", function() {this.window_instance.clear ()}, this, {width:cell_width, height:cell_height, background_color:"#777", mouse_over_background_color:"#bbb", noStroke:true, label_color:"#fff"});
        this.interactables.push (this.button_clear);
        this.button_lparen = new WindowButton (button_panel_x + 1*(cell_width+cell_padding), button_panel_y + 0*(cell_height+cell_padding), "(", function() {this.window_instance.lparen ();}, this, {width:cell_width, height:cell_height, background_color:"#777", mouse_over_background_color:"#bbb", noStroke:true, label_color:"#fff"});
        this.interactables.push (this.button_lparen);
        this.button_rparen = new WindowButton (button_panel_x + 2*(cell_width+cell_padding), button_panel_y + 0*(cell_height+cell_padding), ")", function() {this.window_instance.rparen ();}, this, {width:cell_width, height:cell_height, background_color:"#777", mouse_over_background_color:"#bbb", noStroke:true, label_color:"#fff"});
        this.interactables.push (this.button_rparen);
        this.button_delete = new WindowButton (button_panel_x + 3*(cell_width+cell_padding), button_panel_y + 0*(cell_height+cell_padding), "", function() {this.window_instance.delete_digit ()}, this, {width:cell_width, height:cell_height, background_color:"#777", mouse_over_background_color:"#bbb", noStroke:true, label_color:"#fff", icon:icon_backspace});
        this.interactables.push (this.button_delete);
        // row 1
        this.button7       = new WindowButton (button_panel_x + 0*(cell_width+cell_padding), button_panel_y + 1*(cell_height+cell_padding), "7", function() {this.window_instance.insert_7();}, this, {width:cell_width, height:cell_height, background_color:"#444", mouse_over_background_color:"#666", noStroke:true, label_color:"#fff"});
        this.interactables.push (this.button7);
        this.button8       = new WindowButton (button_panel_x + 1*(cell_width+cell_padding), button_panel_y + 1*(cell_height+cell_padding), "8", function() {this.window_instance.insert_8();}, this, {width:cell_width, height:cell_height, background_color:"#444", mouse_over_background_color:"#666", noStroke:true, label_color:"#fff"});
        this.interactables.push (this.button8);
        this.button9       = new WindowButton (button_panel_x + 2*(cell_width+cell_padding), button_panel_y + 1*(cell_height+cell_padding), "9", function() {this.window_instance.insert_9();}, this, {width:cell_width, height:cell_height, background_color:"#444", mouse_over_background_color:"#666", noStroke:true, label_color:"#fff"});
        this.interactables.push (this.button9);
        this.button_div    = new WindowButton (button_panel_x + 3*(cell_width+cell_padding), button_panel_y + 1*(cell_height+cell_padding), "/", function() {this.window_instance.div ();}, this, {width:cell_width, height:cell_height, background_color:"#777", mouse_over_background_color:"#bbb", noStroke:true, label_color:"#fff"});
        this.interactables.push (this.button_div);
        // row 2
        this.button4       = new WindowButton (button_panel_x + 0*(cell_width+cell_padding), button_panel_y + 2*(cell_height+cell_padding), "4", function() {this.window_instance.insert_4();}, this, {width:cell_width, height:cell_height, background_color:"#444", mouse_over_background_color:"#666", noStroke:true, label_color:"#fff"});
        this.interactables.push (this.button4);
        this.button5       = new WindowButton (button_panel_x + 1*(cell_width+cell_padding), button_panel_y + 2*(cell_height+cell_padding), "5", function() {this.window_instance.insert_5();}, this, {width:cell_width, height:cell_height, background_color:"#444", mouse_over_background_color:"#666", noStroke:true, label_color:"#fff"});
        this.interactables.push (this.button5);
        this.button6       = new WindowButton (button_panel_x + 2*(cell_width+cell_padding), button_panel_y + 2*(cell_height+cell_padding), "6", function() {this.window_instance.insert_6();}, this, {width:cell_width, height:cell_height, background_color:"#444", mouse_over_background_color:"#666", noStroke:true, label_color:"#fff"});
        this.interactables.push (this.button6);
        this.button_mul    = new WindowButton (button_panel_x + 3*(cell_width+cell_padding), button_panel_y + 2*(cell_height+cell_padding), "*", function() {this.window_instance.mul ();}, this, {width:cell_width, height:cell_height, background_color:"#777", mouse_over_background_color:"#bbb", noStroke:true, label_color:"#fff"});
        this.interactables.push (this.button_mul);
        // row 3
        this.button1       = new WindowButton (button_panel_x + 0*(cell_width+cell_padding), button_panel_y + 3*(cell_height+cell_padding), "1", function() {this.window_instance.insert_1();}, this, {width:cell_width, height:cell_height, background_color:"#444", mouse_over_background_color:"#666", noStroke:true, label_color:"#fff"});
        this.interactables.push (this.button1);
        this.button2       = new WindowButton (button_panel_x + 1*(cell_width+cell_padding), button_panel_y + 3*(cell_height+cell_padding), "2", function() {this.window_instance.insert_2();}, this, {width:cell_width, height:cell_height, background_color:"#444", mouse_over_background_color:"#666", noStroke:true, label_color:"#fff"});
        this.interactables.push (this.button2);
        this.button3       = new WindowButton (button_panel_x + 2*(cell_width+cell_padding), button_panel_y + 3*(cell_height+cell_padding), "3", function() {this.window_instance.insert_3();}, this, {width:cell_width, height:cell_height, background_color:"#444", mouse_over_background_color:"#666", noStroke:true, label_color:"#fff"});
        this.interactables.push (this.button3);
        this.button_sub    = new WindowButton (button_panel_x + 3*(cell_width+cell_padding), button_panel_y + 3*(cell_height+cell_padding), "-", function() {this.window_instance.sub ();}, this, {width:cell_width, height:cell_height, background_color:"#777", mouse_over_background_color:"#bbb", noStroke:true, label_color:"#fff"});
        this.interactables.push (this.button_sub);
        // row 4
        this.button0       = new WindowButton (button_panel_x + 0*(cell_width+cell_padding), button_panel_y + 4*(cell_height+cell_padding), "0", function() {this.window_instance.insert_0();}, this, {width:cell_width, height:cell_height, background_color:"#444", mouse_over_background_color:"#666", noStroke:true, label_color:"#fff"});
        this.interactables.push (this.button0);
        this.button_dot    = new WindowButton (button_panel_x + 1*(cell_width+cell_padding), button_panel_y + 4*(cell_height+cell_padding), ".", function() {this.window_instance.insert_decimal_point ();}, this, {width:cell_width, height:cell_height, background_color:"#444", mouse_over_background_color:"#666", noStroke:true, label_color:"#fff"});
        this.interactables.push (this.button_dot);
        this.button_equal  = new WindowButton (button_panel_x + 2*(cell_width+cell_padding), button_panel_y + 4*(cell_height+cell_padding), "=", function() {this.window_instance.equal ();}, this, {width:cell_width, height:cell_height, background_color:"#00BCFF", mouse_over_background_color:"#22DEFF", noStroke:true, label_color:"#333"});
        this.interactables.push (this.button_equal);
        this.button_add    = new WindowButton (button_panel_x + 3*(cell_width+cell_padding), button_panel_y + 4*(cell_height+cell_padding), "+", function() {this.window_instance.add ();}, this, {width:cell_width, height:cell_height, background_color:"#777", mouse_over_background_color:"#bbb", noStroke:true, label_color:"#fff"});
        this.interactables.push (this.button_add);

        // calculator mechanics
        this.history = [];
        this.current_input_str = "0";

    }

    // === CALCULATOR MECHANICS ==========================================

    does_last_word_have_decimal_point ()
    {
        for (let i = this.current_input_str.length-1; i >= 0; --i)
        {
            // check if there is already a decimal point
            if (this.current_input_str[i] == '.')
                return true;
            // ensure current char is a digit
            if (!(this.current_input_str[i] >= '0' && this.current_input_str[i] <= '9'))
                break;
        }
        return false;
    }

    //====================================================================

    // inserts digit to the working input
    insert_digit (digit)
    {
        // ensure string is not just 0
        // we want to overwrite 0 with this new digit
        if (this.current_input_str == "0")
            this.current_input_str = "";
        this.current_input_str = this.current_input_str + digit.toString ();
    }
    insert_0 () {this.insert_digit (0)}
    insert_1 () {this.insert_digit (1)}
    insert_2 () {this.insert_digit (2)}
    insert_3 () {this.insert_digit (3)}
    insert_4 () {this.insert_digit (4)}
    insert_5 () {this.insert_digit (5)}
    insert_6 () {this.insert_digit (6)}
    insert_7 () {this.insert_digit (7)}
    insert_8 () {this.insert_digit (8)}
    insert_9 () {this.insert_digit (9)}

    //====================================================================

    delete_digit ()
    {
        this.current_input_str = this.current_input_str.slice (0, -1);
        // ensure we didnt delete the last digit/char
        if (this.current_input_str.length == 0 || this.current_input_str == '-')
            this.current_input_str = "0";
    }

    //====================================================================

    insert_decimal_point ()
    {
        // ensure a decimal point doesnt already exist
        if (this.does_last_word_have_decimal_point ())
            return;
        // add decimal point
        this.current_input_str += ".";
    }

    //====================================================================

    clear ()
    {
        // if already cleared, clear history
        if (this.current_input_str == "0")
            this.history = [];
        this.current_input_str = "0";
    }

    //====================================================================

    // 0  -> (    is reset pos
    // (  -> ((   next to lparen
    // 9+ -> 9+(  next to op
    // -  -> -(   next to minus sign (same as op)
    lparen ()
    {
        let is_start = this.current_input_str == "0";
        let is_lparen = this.current_input_str[this.current_input_str.length-1] == '(';
        let is_op = "+-*/".includes (this.current_input_str[this.current_input_str.length-1]);
        if (is_start || is_lparen || is_op)
        {
            if (is_start)
                this.current_input_str = "";
            this.current_input_str += "(";
            return;
        }
        // otherwise, do nothing
    }

    //====================================================================

    rparen ()
    {
        // ensure that we need an rparen
        let num_lparen = 0;
        let num_rparen = 0;
        for (let c of this.current_input_str)
        {
            if (c == '(')
                num_lparen++;
            if (c == ')')
                num_rparen++;
        }
        if (num_lparen <= num_rparen)
            return;
        // add rparen
        this.current_input_str += ")";
    }

    //====================================================================

    div ()
    {
        // ensure last char wasnt an op
        if ("+-/*".includes (this.current_input_str[this.current_input_str.length-1]))
            return;
        this.current_input_str += '/';
    }

    //====================================================================

    mul ()
    {
        // ensure last char wasnt an op
        if ("+-/*".includes (this.current_input_str[this.current_input_str.length-1]))
            return;
        this.current_input_str += '*';
    }

    //====================================================================

    sub ()
    {
        // ensure last char wasnt an op
        if ("+-/*".includes (this.current_input_str[this.current_input_str.length-1]))
            return;
        this.current_input_str += '-';
    }

    //====================================================================

    add ()
    {
        // ensure last char wasnt an op
        if ("+-/*".includes (this.current_input_str[this.current_input_str.length-1]))
            return;
        this.current_input_str += '+';
    }

    //====================================================================

    equal ()
    {
        // ensure all parens are matched
        let num_lparen = 0;
        let num_rparen = 0;
        for (let c of this.current_input_str)
        {
            if (c == '(')
                num_lparen++;
            if (c == ')')
                num_rparen++;
        }
        if (num_lparen != num_rparen)
        {
            console.log ("parens dont match");
            return;
        }

        let result = 0;

        // leverage Javascript interpreter to parse and eval the code
        // using Function with "use strict" as it is safer than eval
        // although unsure if this is totally safe
        try {
            result = Function (`"use strict"; return (${this.current_input_str});`)();
        } catch (error) {
            console.log (error);
            // break before completing eval
            return;
        }
        // save equation to history
        this.history.push (this.current_input_str + "=" + result);
        // load result into current working string
        this.current_input_str = result.toString ();
    }

    // === VISUALS =======================================================

    draw_window_content ()
    {
        push ();
        
        // draw display
        stroke ("#fff");
        strokeWeight (1);
        noFill ();
        // i dont like how this is implemented, this will need to change if calculator is resizeable
        let display_height = 60;
        let window_padding = 10;
        let cell_padding = 5;
        let display_width = 4*this.button0.width + 3*cell_padding;
        rect (this.x+window_padding, this.y+this.header_height+window_padding, display_width, display_height, 5);

        // show last history entry
        if (this.history.length > 0)
        {
            noStroke ();
            fill ("#fff");
            textSize (20);
            textAlign (RIGHT, TOP);
            let str = this.history[this.history.length-1];
            // only display the last chars of the string
            if (str.length > 22)
                str = UNICODE_ELLIPSES + str.substring (str.length-21, str.length);
            text (str, this.x+display_width, this.y+this.header_height+10+3);
        }

        // show current expression
        // ensure we dont exceed num digits
        noStroke ();
        fill ("#fff");
        textSize (40);
        textFont ("Consolas");
        textStyle (BOLD);
        textAlign (RIGHT, TOP);
        textWrap (CHAR);
        let str = this.current_input_str;
        // only display the last chars of the string
        if (str.length > 12)
            str = UNICODE_ELLIPSES + str.substring (str.length-11, str.length);
        text (str, this.x, this.y+this.header_height+10+20, display_width, display_height);

        // show buttons
        for (let btn of this.interactables)
        {
            btn.show (this.x, this.y);
        }

        pop ();
        
    }
}



