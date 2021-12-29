function merge_sort(points, axis, l, r){
    l = (l === undefined)? 0: l;
    r = (r === undefined)? points.length-1: r;
    if (l < r){
        var m = l + parseInt((r-l) / 2);
        merge_sort(points, axis, l, m); // sorting left half
        merge_sort(points, axis, m+1, r); // sorting right half

        var n1 = m - l + 1;
        var n2 = r - m;
      
        // Create temp arrays
        var L = new Array(n1);
        var R = new Array(n2);
      
        // Copy data to temp arrays L[] and R[]
        for (var i = 0; i < n1; i++)
            L[i] = points[l + i];
        for (var j = 0; j < n2; j++)
            R[j] = points[m + 1 + j];
      
        // Merge the temp arrays:
        var i = 0;
        var j = 0;
        var k = l;
        while (i < n1 && j < n2) {
            if (L[i][axis] <= R[j][axis]) {
                points[k] = L[i];
                i++;
            }
            else {
                points[k] = R[j];
                j++;
            }
            k++;
        }
      
        // Copy the remaining elements
        while (i < n1) {
            points[k] = L[i];
            i++;
            k++;
        }

        while (j < n2) {
            points[k] = R[j];
            j++;
            k++;
        }
    }
    return points
}

class ListNode {
    constructor(data) {
        this.data = data;
        this.next = null;
        this.previous = null;              
    }
    move(up, axis){ // returns neighbor node that inc/decreases the value at a specific axis
        if (up){ // moving in positive direction
            // we need to check to see that next and previous is not null first:
            if (this.next && this.previous){
                var node = (this.next.data[axis] > this.previous.data[axis])? this.next: this.previous;
            } else if (this.next){ // only next exists
                var node = this.next;
            } else if (this.previous){
                var node = this.previous;
            } else{ // both are null
                var node = this;
            }
            return (node.data[axis] > this.data[axis])? node: this; // making sure that it is also larger than current node
        } else { // negative direction
            if (this.next && this.previous){
                var node = (this.next.data[axis] < this.previous.data[axis])? this.next: this.previous;
            } else if (this.next){
                var node = this.next;
            } else if (this.previous){
                var node = this.previous;
            } else{
                var node = this;
            }
            return (node.data[axis] < this.data[axis])? node: this; 
        }
    }
    move_all(up, axis){ // moves to the top or bottom of the hull (this could be a local extrema)
        var curr_node = this;
        var next_node = curr_node.move(up, axis);

        while (curr_node != next_node){ // loops until it stablizes at one node
            curr_node = next_node;
            next_node = curr_node.move(up, axis);
        }
        return curr_node;
    }
}

class LinkedList {
    constructor(head=null){
        this.head = head;
    }
    min_node(axis) {
        var curr_node = this.head;
        var min_node = curr_node;

        while (curr_node.next && curr_node.next != this.head){
            if (curr_node.data[axis] < min_node.data[axis])
                min_node = curr_node;
            curr_node = curr_node.next;
        }
        // Final check to make sure the current node isn't smaller 
        // (would've been skipped if next is head)
        if (curr_node.data[axis] < min_node.data[axis])
            min_node = curr_node;
        return min_node
    }
    max_node(axis) {
        var curr_node = this.head;
        var max_node = curr_node;

        while (curr_node.next && curr_node.next != this.head){
            if (curr_node.data[axis] > max_node.data[axis])
                max_node = curr_node;
            curr_node = curr_node.next;
        }
        // this needs to be done to check curr_node value
        // would've been skipped if curr_node.next == this.head
        if (curr_node.data[axis] > max_node.data[axis])
            max_node = curr_node;
        return max_node
    }
}

function test_render(points){
    var head = new ListNode(points[0]);
    var curr_node = new ListNode(points[1]);
    head.next = curr_node;
    curr_node.previous = head;
    
    for (let i = 2; i < points.length; i++) {
        var p = new ListNode(points[i]);
        curr_node.next = p;
        p.previous = curr_node;
        curr_node = p;
    }

    curr_node.next = head;
    head.previous = curr_node;

    return new LinkedList(head);
}

function _ch_helper(points, axis, l, r){
    if (l === r){
        var base = new ListNode(points[l]);
        base.next = base;
        base.previous = base;
        return new LinkedList(base); // base condition points to a node
    }else if (l > r){
        return new LinkedList(); // null node as head
    }

    // Divide points in half:
    var m = l + parseInt((r-l) / 2);
    // console.log(l,m,r);

    // find convex hull of left and right sets:
    // returned structure is a doubly-linked list!
    var L_set = _ch_helper(points, axis, l, m);
    var R_set = _ch_helper(points, axis, m+1, r);
    
    // merging them to form a larger convex hull:
    var L_set_max = L_set.max_node(axis);
    var R_set_min = R_set.min_node(axis);

    // moving upwards on the hull until we reach the top (along secondary axis)
    var sec_axis = (axis+1) % 2;
    var l_prime_top = L_set_max.move_all(true, sec_axis);
    var r_prime_top = R_set_min.move_all(true, sec_axis);

    // Doing the same thing except downwards:
    // TODO: fix intersecting hulls problem
    var l_prime_bot = L_set_max.move_all(false, sec_axis);
    var r_prime_bot = R_set_min.move_all(false, sec_axis);

    // Joining the top nodes and bottom nodes
    l_prime_top.next = r_prime_top;
    r_prime_top.previous = l_prime_top;

    l_prime_bot.previous = r_prime_bot;
    r_prime_bot.next = l_prime_bot;

    return new LinkedList(r_prime_top); // the head is arbritraily chosen (could be anypoint on the hull because it is circular)
}

function find_convex_hull(points){
    /* 
        For two-dimensional points in a plane the convex hull is 
        the smallest convex polygon that encloses all of the points.

        args:
            - points ([[int,int]]): a list of 2d points on a plane.
        
        returns:
            (LinkedList([int, int])): a doubly-linked list of points making up the convex hull.
    */
    // sorting along x axis (0)
    points = merge_sort(points, 0);

    // Then recursively divide and find convex hull of each point set
    return _ch_helper(points, 0, 0, points.length-1);
}

function iterative_convex_hull(points, axis, num_steps, merge_stack, hulls){
    /*
        Iterative version of convex hull in order to display points while running 

        args:
            - points ([[int,int]]): a list of 2d points on a plane.
            - merge_stack ([(int, int)]): a stack representing the typical recusive stack to ch_helper
                        (l, r).
            - num_steps (int): the number of steps to perform (number of calls to pop off from stack), 
                        setting to -1 does the entire algorithm.

        returns:
            A tuple consisting of:
            - Hash(LinkedList([int, int])): a hashmap of doubly-linked lists of points 
                        representing the convex hull(s) (multiple if num steps < max 
                        steps needed to complete the hull).
            - [(int, int, int)]: A stack representing the call stack of the recursive 
                        calls to the _ch_helper function.
    */
    var num_steps = num_steps? num_steps: -1;
    var hulls = hulls? hulls: {}; // hash map to store hulls;

    // only need to divide if merge stack isn't provided
    if (!merge_stack) {
        // Init with the first call
        var divide_stack = [[0, points.length-1]];
        var merge_stack = [];

        // divide:
        //  - divides in a breath-first style to merge in a breadth-first style. 
        while (divide_stack.length){ // will not divide if a stack is passed in.
            // Popping off the stack:
            var [l, r] = divide_stack.pop();

            if (l === r){ // "elemental hull"
                var base = new ListNode(points[l]);
                base.next = base;
                base.previous = base;
                hulls[l+'-'+r] = new LinkedList(base);
            } else{ // dividing 
                // Pushing to merge stack:
                merge_stack.push([l,r]);

                // Divide points in half:
                var m = l + parseInt((r-l) / 2);
    
                // Pushing left and right sets to stack for futher division:
                divide_stack.push([l, m]);
                divide_stack.push([m+1, r]);
            }
        }
    }
    console.log("done dividing...");

    var c = 0;
    var sec_axis = (axis+1) % 2; // secondary axis to merge on
    // conquer/merge:
    //  - Merge stack was created during division such that the final thing 
    //    in the stack is to merge the two halves of the points set.
    while (merge_stack.length && (c < num_steps || num_steps == -1)) {
        c++;
        // popping off merge stack:
        var [l, r] = merge_stack.pop();
        var m = l + parseInt((r-l) / 2);

        // Getting left and right hulls from hash map:
        var L_hull_key = l+'-'+m;
        var R_hull_key = (m+1)+'-'+r;
        var L_hull = hulls[L_hull_key];
        var R_hull = hulls[R_hull_key];

        // Merging them to form a larger convex hull:
        var L_hull_max = L_hull.max_node(axis);
        var R_hull_min = R_hull.min_node(axis);

        // Moving upwards on the hull until we reach the top (along secondary axis)
        var l_prime_top = L_hull_max.move_all(true, sec_axis);
        var r_prime_top = R_hull_min.move_all(true, sec_axis);

        // Doing the same thing except downwards:
        var l_prime_bot = L_hull_max.move_all(false, sec_axis);
        var r_prime_bot = R_hull_min.move_all(false, sec_axis);

        // Joining the top nodes and bottom nodes
        l_prime_top.next = r_prime_top;
        r_prime_top.previous = l_prime_top;

        l_prime_bot.previous = r_prime_bot;
        r_prime_bot.next = l_prime_bot;

        // Adding the new hull to the hash map and removing sub-hulls
        hulls[l+'-'+r] = new LinkedList(r_prime_top);
        delete hulls[L_hull_key];
        delete hulls[R_hull_key];
    }
    
    return [hulls, merge_stack]
}
