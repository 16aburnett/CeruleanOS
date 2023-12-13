// GameVM
// File explorer application
// Author: Amy Burnett
//========================================================================
// Globals

//========================================================================

class FileExplorerAppWindow extends Window
{
    constructor (x, y)
    {
        super (x, y);

        this.background_color = "#222";
        this.title = "File Explorer";
        this.icon = taskbar_icon_file_explorer;
        this.width = 500;
        this.height = 300;
        // move window to center of screen
        this.x = windowWidth/2-this.width/2;
        this.y = windowHeight/2-this.height/2;
        this.minimum_width = this.width;
        this.minimum_height = this.height;
        
        // app mechanics
        this.current_working_dir = "/home/Desktop/"
        this.history = [];
        this.history_limit = 10;
        this.future = [];

        // navigation bar
        this.navigation_bar_height = 40;
        let cell_padding = 5;
        let cell_width = this.navigation_bar_height-2*cell_padding;
        this.button_undo_cd = new WindowButton  (cell_padding + 0*(cell_width+cell_padding), this.header_height+cell_padding, "<", function() {this.window_instance.undo_cd ()}     , this, {width:cell_width, height:cell_width, background_color:[0,0,0,0], mouse_over_background_color:"#555", noStroke:true, label_color:"#fff", label_text_size:15, border_radius:5, is_disabled:true, popup_text:"Previous directory"}); this.interactables.push (this.button_undo_cd);
        this.button_redo_cd = new WindowButton  (cell_padding + 1*(cell_width+cell_padding), this.header_height+cell_padding, ">", function() {this.window_instance.redo_cd ()}     , this, {width:cell_width, height:cell_width, background_color:[0,0,0,0], mouse_over_background_color:"#555", noStroke:true, label_color:"#fff", label_text_size:15, border_radius:5, is_disabled:true, popup_text:"Next directory"}); this.interactables.push (this.button_redo_cd);
        this.button_parent  = new WindowButton  (cell_padding + 2*(cell_width+cell_padding), this.header_height+cell_padding, "^", function() {this.window_instance.go_to_parent ()}, this, {width:cell_width, height:cell_width, background_color:[0,0,0,0], mouse_over_background_color:"#555", noStroke:true, label_color:"#fff", label_text_size:15, border_radius:5, is_disabled:false, popup_text:"Go to parent directory"}); this.interactables.push (this.button_parent);
        this.button_refresh = new WindowButton  (cell_padding + 3*(cell_width+cell_padding), this.header_height+cell_padding, "R", function() {this.window_instance.refresh ()}     , this, {width:cell_width, height:cell_width, background_color:[0,0,0,0], mouse_over_background_color:"#555", noStroke:true, label_color:"#fff", label_text_size:15, border_radius:5, is_disabled:false, popup_text:"Refresh window"}); this.interactables.push (this.button_refresh);

        this.textbox_cwd    = new WindowTextBox (cell_padding + 4*(cell_width+cell_padding), this.header_height+cell_padding, this.current_working_dir, function() {this.window_instance.cd_from_textbox ()}, this, {width:this.width - (cell_padding + 4*(cell_width+cell_padding)) - cell_padding, height:cell_width, background_color:"#555", noStroke:true, text_color:"#fff", text_size:15, border_radius:5, is_editable:true}); this.interactables.push (this.textbox_cwd);

        this.file_display   = new WindowFileDisplay (0, this.header_height+this.navigation_bar_height, this, {width:this.width, height:this.height-this.header_height-this.navigation_bar_height, background_color:[0,0,0,0], noStroke:true, text_color:"#fff", text_size:15, border_radius:0, dir_change_callback:function(file_obj){this.window_instance.textbox_cwd.value = file_obj.get_full_path (); this.window_instance.cd_from_textbox ()}}); this.interactables.push (this.file_display);

        this.cd_from_textbox ();

        // reset history after cd
        this.history = [];
    }

    // === APP MECHANICS =================================================

    cd_from_str (path, was_undo_redo=false)
    {
        // ensure valid path and that it is a directory (not file)
        if (!is_path_valid (path))
        {
            console.log ("invalid path", path);
            return;
        }
        // ensure path is a dir (not a file)
        // we cannot navigate to a file
        let element = get_file (path);
        if (!(element instanceof Directory))
        {
            console.log (`'${path}' is a file, not a directory`);
            return;
        }
        // we know it is a directory
        let given_dir = element;

        if (!was_undo_redo)
        {
            // save to history
            this.history.push (this.current_working_dir);
            // ensure history only stores so many entries
            if (this.history.length > this.history_limit)
                this.history = this.history.slice (-this.history_limit, this.history.length);

            // clobber redo future
            this.future = [];
        }

        // change to new directory
        this.current_working_dir = given_dir.get_full_path ();
        this.textbox_cwd.value = given_dir.get_full_path ();

        // get children of the given path
        let children_file_names = given_dir.children.keys ();

        // load into displayable file objs and save to this file display
        this.file_display.files = [];
        for (let child_file_name of children_file_names)
        {
            // ignore '.' and '..' files
            if (child_file_name == '.' || child_file_name == "..")
                continue;
            this.file_display.add_file (child_file_name, given_dir.children.get (child_file_name));
        }
    }

    //====================================================================

    cd_from_textbox ()
    {
        this.cd_from_str (this.textbox_cwd.value);
    }

    //====================================================================

    // goes to the parent directory of the current directory
    go_to_parent ()
    {
        let current_dir = get_file (this.current_working_dir);
        // ensure there is a parent dir
        if (!current_dir.parent)
            return;
        // change dir
        this.cd_from_str (current_dir.parent.get_full_path ());
    }

    //====================================================================

    // reloads the children files of the cwd
    refresh ()
    {
        this.cd_from_str (this.current_working_dir, true);
    }
    
    //====================================================================

    has_parent ()
    {
        let current_dir = get_file (this.current_working_dir);
        return current_dir.parent != null;
    }
    
    //====================================================================

    undo_cd ()
    {
        // ensure there is history to undo
        if (this.history.length == 0)
            return;
        // push to future
        this.future.push (this.current_working_dir);
        // load history
        this.cd_from_str (this.history.pop (), true);
    }
    
    //====================================================================

    redo_cd ()
    {
        // ensure there is future to redo
        if (this.future.length == 0)
            return;
        // push to history
        this.history.push (this.current_working_dir);
        // load future
        this.cd_from_str (this.future.pop (), true);
    }

    // === VISUALS =======================================================

    draw_window_content ()
    {
        push ();
        
        // draw navigation bar
        noStroke ();
        fill ("#333");
        rect (this.x, this.y+this.header_height, this.width, this.navigation_bar_height);

        // disable undo if there is no history
        this.button_undo_cd.is_disabled = this.history.length == 0;

        // disable redo if there is no future
        this.button_redo_cd.is_disabled = this.future.length == 0;

        // disable parent button if no parent
        this.button_parent.is_disabled = !this.has_parent ();

        // draw interactables
        for (let interactable of this.interactables)
            interactable.show (this.x, this.y);

        pop ();
    }
}



