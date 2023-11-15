// GameVM
// Terminal backend for handling terminal commands
// Author: Amy Burnett
//========================================================================
// Globals

const KEY_HOME     = 36;
const KEY_END      = 35;
const KEY_CAPSLOCK = 20;

// anytime you press a key, there should be a 1 second delay
// before the key is treated as being held down
let key_press_timer = 0;

// ** should query terminal for pwd
let terminal_prompt = "> ";

let terminal_contents = [
    "Welcome to the Terminal\n",
    "type 'help' anytime for a list of commands\n",
    terminal_prompt
];

// the current working command being typed
// this is the command after the prompt that has yet to be entered
// this should be an array of chars
// let working_line = "this working command might not be a valid command, but it may be a valid long line that will span multiple rows :)".split('');
let working_line = [];

// let cursor_i = 0;
let working_line_cursor_j = 0;

let font_size = 20;
let padding_top = 10;
let padding_right = 10;
let letter_spacing_horizontal = 2;
let letter_spacing_vertical = 4;

let background_color = "#000000";
let terminal_text_color = "#eeeeee";
let terminal_text_font = "Cascadia Code";
// let terminal_text_font = "Courier New";

let disk0 = new Directory (null, "/", [
    new Directory (null, "bin"),
    new Directory (null, "home", [
        new File (null, "hello.txt", "Hello, World!"),
        new Directory (null, "amy", [
            new File (null, "run_me", `cat "I like pizza!\\n"`)
        ])
    ])
]);
let current_working_directory = disk0;

//========================================================================

// this is super simple for right now
// we only support words separated by spaces
function tokenize (command_str)
{
    // filter for getting rid of empty strings
    let tokens = command_str.split (' ').filter (e => e);
    return tokens;
}

function run_command (command)
{
    let tokens = tokenize (command);

    // check for empty commands
    if (tokens.length == 0)
    {
        // no tokens provided,
        // do nothing
        return;
    }

    // terminal_contents.push ("term - received the following command\n");
    // terminal_contents.push (command, "\n");

    // assume first token is the command name
    let cmd = tokens[0];
    // assume rest of tokens are arguments
    tokens.shift ();
    let args = tokens;

    // terminal_contents.push (`cmd : ${cmd} \n`);
    // terminal_contents.push (`args: ${args} \n`);

    // process builtin commands
    switch (cmd)
    {
        case "help":
            terminal_contents.push (`WTTT Shell v1.0.0 x86_64\n`);
            terminal_contents.push (`The following is a list of available commands to run.\n`);
            terminal_contents.push (`\n`);
            terminal_contents.push (`help             print this message\n`);
            terminal_contents.push (`pwd              print the current working directory\n`);
            terminal_contents.push (`ls               print a list of the current directory's contents\n`);
            terminal_contents.push (`cd <path>        change the current directory to <path>\n`);
            terminal_contents.push (`mkdir <dirname>  make directory with name <dirname>\n`);
            terminal_contents.push (`cat <filename>   print the contents of <filename>\n`);
            terminal_contents.push (`rm <filename>    delete a file or directory\n`);
            terminal_contents.push (`clear            clears the terminal\n`);
            break;
        case "pwd":
            terminal_contents.push (`${current_working_directory.get_full_path ()}\n`);
            break;
        case "ls":
            terminal_contents.push (`${current_working_directory.list_children ()}\n`);
            break;
        case "cd":
            // ensure 1 arg was given
            if (args.length != 1)
            {
                terminal_contents.push (`Usage: cd <dirname>\n`);
                break;
            }
            // ensure arg matches a dirname in the cwd
            if (!current_working_directory.children.has (args[0]))
            {
                terminal_contents.push (`cd Error: '${args[0]}' - no such file or directory\n`);
                break;
            }
            // ensure arg is a dir - doesnt make sense to cd into a file
            if (!(current_working_directory.children.get (args[0]) instanceof Directory))
            {
                terminal_contents.push (`cd error: '${args[0]}' is not a directory\n`);
                break;
            }
            // switch to that dir
            current_working_directory = current_working_directory.children.get (args[0]);
            break;
        case "mkdir":
            break;
        case "rm":
            break;
        // cat <filename>
        case "cat":
            // ensure 1 arg was given
            if (args.length != 1)
            {
                terminal_contents.push (`Usage: cd <dirname>\n`);
                break;
            }
            // ensure arg matches a filename in the cwd
            if (!current_working_directory.children.has (args[0]))
            {
                terminal_contents.push (`cd Error: '${args[0]}' - no such file or directory\n`);
                break;
            }
            // ensure arg is a file
            if (!(current_working_directory.children.get (args[0]) instanceof File))
            {
                terminal_contents.push (`cat error: '${args[0]}' is not a file\n`);
                break;
            }
            // print out results/data from that file
            terminal_contents.push (current_working_directory.children.get (args[0]).data);
            break;
        case "clear":
            // ensure 0 args
            // clear terminal contents
            terminal_contents = [];
            break;
        default:
            terminal_contents.push (`error: unknown command '${cmd}'\n`);

    }
}

//========================================================================
//=== TERMINAL CONTROLS ==================================================
//========================================================================

// function keyPressed ()
// {
//     if (keyCode === LEFT_ARROW)
//     {
//         working_line_cursor_j = max (0, working_line_cursor_j-1);
//     }
//     else if (keyCode === RIGHT_ARROW)
//     {
//         working_line_cursor_j = min (working_line.length, working_line_cursor_j+1);
//     }
//     else if (keyCode === UP_ARROW)
//     {
//         // cursor_i = max (0, cursor_i-1);
//         // should go to prev in history
//     }
//     else if (keyCode === DOWN_ARROW)
//     {
//         // cursor_i = cursor_i+1;
//         // should go to next in history
//     }
//     else if (keyCode === KEY_HOME)
//     {
//         working_line_cursor_j = 0;
//     }
//     else if (keyCode === KEY_END)
//     {
//         working_line_cursor_j = working_line.length;
//     }
//     else if (keyCode === ENTER || keyCode === RETURN)
//     {
//         // append command to terminal output
//         terminal_contents.push (working_line.join (''));
//         terminal_contents.push ('\n');
//         // append command to history list
//         // **
//         // submit command to terminal to execute it
//         run_command (working_line.join (''));
//         // reset working_line + cursor pos
//         working_line = [];
//         working_line_cursor_j = 0;
//         // when terminal returns, print a new prompt
//         terminal_contents.push (terminal_prompt);

//     }
//     else if (keyCode === BACKSPACE)
//     {
//         // delete character before cursor position
//         // if exists
//         if (working_line_cursor_j != 0)
//         {
//             working_line.splice (working_line_cursor_j-1, 1);
//             working_line_cursor_j--;
//         }
//     }
//     else if (keyCode === DELETE)
//     {
//         // delete character at cursor position
//         // if exists
//         if (working_line_cursor_j < working_line.length)
//         {
//             working_line.splice (working_line_cursor_j, 1);
//         }
//     }
//     else if (keyCode === SHIFT)
//     {
//         // do nothing
//     }
//     else if (keyCode === CONTROL)
//     {
//         // do nothing
//     }
//     else if (keyCode === ALT)
//     {
//         // do nothing
//     }
//     else if (keyCode === ESCAPE)
//     {
//         // do nothing
//     }
//     else if (keyCode === KEY_CAPSLOCK)
//     {
//         // do nothing
//     }
//     else if (keyCode === TAB)
//     {
//         // reserved for autocomplete
//     }
//     else if (key == "Meta") // windows/mac key
//     {
//         // do nothing
//     }
//     else
//     {
//         // ignore char if it is >1 char
//         // we need this for function keys
//         if (key.length > 1)
//             return;
//         // add char to working prompt before cursor position
//         working_line.splice (working_line_cursor_j, 0, key);
//         // since we added a char, we need to move the cursor
//         working_line_cursor_j++;
//     }
//     // enable this if we want to prevent things like ctrl+r from refreshing
//     return false;
// }

//========================================================================
//=== TERMINAL VISUALS ===================================================
//========================================================================

function draw_terminal ()
{

    // calculate window character width
    // so we know when to line wrap
    // -1 so we have extra padding
    let char_width = (font_size + letter_spacing_horizontal) / 2;
    let char_per_row = Math.floor (windowWidth / char_width) - 1;

    // print terminal contents to the screen
    // print each string
    // terminal can have many strings but newlines will tell us when to go to the next line
    // also if we run out of horizontal space, we will break to a newline
    let line_num = 0;
    let col_num = 0;
    for (let string of terminal_contents)
    {
        // print each char of the current string
        for (let char of string)
        {
            // check for newlines
            if (char === '\n')
            {
                line_num++;
                col_num = 0;
                continue;
            }

            let x = col_num * ((font_size + letter_spacing_horizontal) / 2) + padding_right;
            let y = line_num * (font_size + letter_spacing_vertical) + font_size + padding_top;

            textFont (terminal_text_font);
            textSize (font_size);
            noStroke ();
            fill (terminal_text_color);
            text (char, x, y);
            // stroke ("lime");
            // fill ("lime");
            // point (x, y);

            // update next draw position
            col_num++;
            // ensure we wrap to a newline if needed
            if (col_num >= char_per_row)
            {
                line_num++;
                col_num = 0;
            }

        }
    }

    // print current working line
    // let working_local_i = 0;
    let working_local_j = 0;
    for (let string of working_line)
    {
        for (let char of string)
        {

            let x = col_num * ((font_size + letter_spacing_horizontal) / 2) + padding_right;
            let y = line_num * (font_size + letter_spacing_vertical) + font_size + padding_top;

            // highlight cursor position
            let is_cursor_position = working_local_j == working_line_cursor_j;
            if (is_cursor_position)
            {
                noStroke ();
                fill (terminal_text_color);
                rectMode ();
                rect (x, y-font_size*0.85, font_size/2, font_size);
            }

            textFont (terminal_text_font);
            textSize (font_size);
            noStroke ();
            if (is_cursor_position)
                fill (background_color);
            else
                fill (terminal_text_color);
            text (char, x, y);
            stroke ("red");
            fill ("red");
            point (x, y);

            // update next draw position
            col_num++;
            working_local_j++;
            // ensure we wrap to a newline if needed
            if (col_num >= char_per_row)
            {
                line_num++;
                col_num = 0;
                // no need to wrap for working_local index
            }
        }
    }

    // draw cursor highlight if cursor is at the end of the working line
    let is_cursor_position = working_local_j == working_line_cursor_j;
    if (is_cursor_position)
    {
        noStroke ();
        fill (terminal_text_color);
        rectMode ();
        let x = col_num * ((font_size + letter_spacing_horizontal) / 2) + padding_right;
        let y = line_num * (font_size + letter_spacing_vertical) + font_size + padding_top;
        rect (x, y-font_size*0.85, font_size/2, font_size);
    }
}




