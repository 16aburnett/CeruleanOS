// GameVM
// Filesystem
// Author: Amy Burnett
//========================================================================
// Globals

//========================================================================

class Directory
{
    constructor (parent, name, children=[])
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
    constructor (parent, name, data="")
    {
        this.parent = parent;
        this.name = name;
        this.data = data;
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



