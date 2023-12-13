// GameVM
// Filesystem
// Author: Amy Burnett
//========================================================================
// Globals

//========================================================================

class Directory
{
    constructor (parent, name, children=[], {icon=taskbar_icon_file_explorer, open_with_application=FileExplorerAppWindow}={})
    {
        this.parent = parent;
        this.name = name;
        // map of "child_elem_name":child_elem_obj
        // for fast lookup
        this.children = new Map ([
            [".", this], // self reference
            ["..", this.parent] // parent reference
        ]);
        for (let child of children)
        {
            this.children.set(child.name, child);
            // make sure child has parent dir saved
            child.parent = this;
            // update parent link
            if (child instanceof Directory)
            {
                child.children.set ("..", this);
            }
        }
        this.icon = icon;
        this.open_with_application = open_with_application;
    }

    add_child (child)
    {
        this.children.set (child.name, child);
    }

    remove_child (child)
    {
        this.children.delete (child.name);
    }

    // returns a list of children elements
    list_children ()
    {
        return Array.from (this.children.keys ()).join ("\n");
    }

    // returns the full path of this dir
    get_full_path ()
    {
        if (this.parent == null)
            return this.name;
        return this.parent.get_full_path () + "/" + this.name;
    }
}

//========================================================================

class File
{
    constructor (parent, name, {data="", icon=icon_file, open_with_application=Window}={})
    {
        this.parent = parent;
        this.name = name;
        this.data = data;
        this.icon = icon;
        this.open_with_application = open_with_application;
    }

    // returns the full path of this file
    get_full_path ()
    {
        if (this.parent == null)
            return this.name;
        return this.parent.get_full_path () + "/" + this.name;
    }
}

//========================================================================

// absolute path
function is_path_valid (path_str)
{
    // match (1 or more of any char that isnt /) or (/)
    // let tokens = path_str.match (/[^\/]+|\//g);
    let tokens = path_str.match (/[^\/]+/g);
    if (tokens == null)
        tokens = [];
    // console.log (tokens);
    let cur_element = disk0;
    for (let i = 0; i < tokens.length; ++i)
    {
        let token = tokens[i];
        // ensure current element is a dir
        // since we have more tokens
        if (!(cur_element instanceof Directory))
        {
            // not last token, they are using the file as a folder
            console.log (`'${cur_element}' is a file, not a dir`);
            return false;
        }
        // ensure token is in current directory
        if (!cur_element.children.has (token))
        {
            // token is not a file/dir name in this dir
            console.log (`'${token}' is not a file/dir in '${cur_element.get_full_path ()}'`);
            // exit fast
            return false;
        }
        // navigate to token
        cur_element = cur_element.children.get (token);
    }
    // reaches here if no problems found so I guess it is a valid path
    return true;
}

function get_file (path_str)
{
    // match (1 or more of any char that isnt /) or (/)
    // let tokens = path_str.match (/[^\/]+|\//g);
    let tokens = path_str.match (/[^\/]+/g);
    if (tokens == null)
        tokens = [];
    // console.log (tokens);
    let cur_element = disk0;
    for (let i = 0; i < tokens.length; ++i)
    {
        let token = tokens[i];
        // ensure current element is a dir
        // since we have more tokens
        if (!(cur_element instanceof Directory))
        {
            // not last token, they are using the file as a folder
            console.log (`'${cur_element}' is a file, not a dir`);
            return null;
        }
        // ensure token is in current directory
        if (!cur_element.children.has (token))
        {
            // token is not a file/dir name in this dir
            console.log (`'${token}' is not a file/directory in '${cur_element.get_full_path ()}'`);
            // exit fast
            return null;
        }
        // navigate to token
        cur_element = cur_element.children.get (token);
    }
    // cur_element should be our requested file/dir
    return cur_element;
    
}