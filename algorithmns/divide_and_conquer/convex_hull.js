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
            var curr_node = this.head;
            if (curr_node.data[axis] < min_node.data[axis]){
                min_node = curr_node;
            }
        }
        return min_node
    }
    max_node(axis) {
        var curr_node = this.head;
        var max_node = curr_node;

        while (curr_node.next && curr_node.next != this.head){
            var curr_node = this.head;
            if (curr_node.data[axis] > max_node.data[axis]){
                max_node = curr_node;
            }
        }
        return max_node
    }
}

function _ch_helper(points, axis, l, r){
    if (l === r){
        var base = new ListNode(points[l]);
        // base.next = base;
        // base.previous = base;
        return new LinkedList(base); // base condition points to a node
    }else if (l > r){
        console.log('NULL NODE!');
        return new LinkedList(); // null node as head
    }

    // Divide points in half:
    var m = l + parseInt((r-l) / 2);

    // find convex hull of left and right sets:
    // returned structure is a doubly-linked list!
    var L = _ch_helper(points, axis, l, m);
    var R = _ch_helper(points, axis, m+1, r);

    // merging them to form a larger convex hull:
    var l = L.max_node(axis);
    var r = R.min_node(axis);

    // moving upwards on the hull until we reach the top (along secondary axis)
    var sec_axis = (axis+1) % 2;
    var l_prime = l.move_all(true, sec_axis);
    var r_prime = r.move_all(true, sec_axis);

    // Joining the top nodes
    // if (l_prime.next.data[axis] > l_prime.previous.data[axis]){
    //     l_prime.next = r_prime;
    // } else{
    //     l_prime.previous = r_prime;
    // }
    // if (r_prime.next.data[axis] < r_prime.previous.data[axis]){
    //     r_prime.next = l_prime;
    // } else{
    //     r_prime.previous = l_prime;
    // }
    l_prime.next = r_prime;
    r_prime.previous = l_prime;

    // Doing the same thing except downwards:
    var l_prime = l.move_all(false, sec_axis);
    var r_prime = r.move_all(false, sec_axis);
    l_prime.next = r_prime;
    r_prime.previous = l_prime;

    return new LinkedList(r_prime); // the head is arbritraily chosen (could be anypoint on the hull because it is circular)
}

function find_convex_hull(points){
    /* 
        For two-dimensional points in a plane the convex hull is 
        the smallest convex polygon that encloses all of the points.

        args:
            - points ([[int,int]]): a list of 2d points on a plane.
        
        returns:
            ([[int,int]]): a doubly-linked list of points making up the convex hull.
    */

    // Sorting the points by one axis (x-axis):
    sorted_points = merge_sort(points, 0);

    // Then recursively divide and find convex hull of each point set
    return _ch_helper(sorted_points, 0, 0, sorted_points.length-1);
}