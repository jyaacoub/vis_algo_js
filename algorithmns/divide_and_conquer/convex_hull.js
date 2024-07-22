function find_convex_hull(points){
    /* 
        For two-dimensional points in a plane the convex hull is 
        the smallest convex polygon that encloses all of the points.
        From - https://www.geeksforgeeks.org/convex-hull-using-divide-and-conquer-algorithm/

        args:
            - points ([[int,int]]): a list of 2d points on a plane.
        
        returns:
            (LinkedList([int, int])): a doubly-linked list of points making up the convex hull.
    */
    if (points.length < 3) {
        return points;
    }

    // sort by x-coordinate (if tie, sort by y-coordinate)
    points.sort((a, b) => a[0] !== b[0]? a[0] - b[0]: a[1] - b[1]);

    // we divide the points into two halves
    const upper = [];
    const lower = [];
    let steps = [];

    // upper hull
    for (const point of points) {
        while (upper.length >= 2 && 
               isNotRightTurn(upper[upper.length - 2], 
                              upper[upper.length - 1], point)) {
            upper.pop();
        }
        upper.push(point);
        steps.push([...upper]);
    }

    // lower hull
    for (let i = points.length - 1; i >= 0; i--) {
        const point = points[i];
        while (lower.length >= 2 && 
               isNotRightTurn(lower[lower.length - 2], 
               lower[lower.length - 1], point)) {
            lower.pop();
        }
        lower.push(point);
        steps.push([...upper,...lower]);
    }

    hull = new Set([...upper, ...lower]);
    hull = Array.from(hull)
    const first_half_len = upper.length;
    return [hull, steps, first_half_len];
}

function isNotRightTurn(a, b, c) {
    return (b[0] - a[0]) * (c[1] - a[1]) - 
           (b[1] - a[1]) * (c[0] - a[0]) <= 0;
}

function convex_hull_recursive(points){
    // see -> https://www.youtube.com/watch?v=f6Pvdxdg2XM&list=PLbQgkRqCVb7C1rGT3iSHQv0oyhPPlc0E9&index=3
    // Data structure needed is a doubly-linked list
    //
}