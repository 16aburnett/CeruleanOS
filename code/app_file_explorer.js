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
        // this.minimum_width = this.width;
        // this.minimum_height = this.height;
        
        // app mechanics
        this.current_working_dir = "home/amyb/desktop/projects/CeruleanOS/ahhhhhhhhhhhhhhhhhhh"

        // navigation bar
        this.navigation_bar_height = 40;
        let cell_padding = 5;
        let cell_width = this.navigation_bar_height-2*cell_padding;
        this.button_undo_cd = new WindowButton  (cell_padding + 0*(cell_width+cell_padding), this.header_height+cell_padding, "<", function() {this.window_instance.undo_cd ()}     , this, {width:cell_width, height:cell_width, background_color:[0,0,0,0], mouse_over_background_color:"#555", noStroke:true, label_color:"#fff", label_text_size:15, border_radius:5}); this.clickables.push (this.button_undo_cd);
        this.button_redo_cd = new WindowButton  (cell_padding + 1*(cell_width+cell_padding), this.header_height+cell_padding, ">", function() {this.window_instance.redo_cd ()}     , this, {width:cell_width, height:cell_width, background_color:[0,0,0,0], mouse_over_background_color:"#555", noStroke:true, label_color:"#fff", label_text_size:15, border_radius:5}); this.clickables.push (this.button_redo_cd);
        this.button_parent  = new WindowButton  (cell_padding + 2*(cell_width+cell_padding), this.header_height+cell_padding, "^", function() {this.window_instance.go_to_parent ()}, this, {width:cell_width, height:cell_width, background_color:[0,0,0,0], mouse_over_background_color:"#555", noStroke:true, label_color:"#fff", label_text_size:15, border_radius:5}); this.clickables.push (this.button_parent);
        this.button_refresh = new WindowButton  (cell_padding + 3*(cell_width+cell_padding), this.header_height+cell_padding, "R", function() {this.window_instance.refresh ()}     , this, {width:cell_width, height:cell_width, background_color:[0,0,0,0], mouse_over_background_color:"#555", noStroke:true, label_color:"#fff", label_text_size:15, border_radius:5}); this.clickables.push (this.button_refresh);

        this.textbox_cwd    = new WindowTextBox (cell_padding + 4*(cell_width+cell_padding), this.header_height+cell_padding, this.current_working_dir, function() {this.window_instance.cd (this.value)}, this, {width:this.width - (cell_padding + 4*(cell_width+cell_padding)) - cell_padding, height:cell_width, background_color:"#555", noStroke:true, text_color:"#fff", text_size:15, border_radius:5}); this.clickables.push (this.textbox_cwd);


    }

    // === APP MECHANICS =================================================


    // === VISUALS =======================================================

    draw_window_content ()
    {
        push ();
        
        // draw navigation bar
        noStroke ();
        fill ("#333");
        rect (this.x, this.y+this.header_height, this.width, this.navigation_bar_height);

        // draw buttons
        for (let btn of this.clickables)
            btn.show (this.x, this.y);


        pop ();
    }
}



