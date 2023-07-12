function crossProduct(p1, p2, p3) {
  return (p2.x - p1.x) * (p3.y - p1.y) - (p3.x - p1.x) * (p2.y - p1.y);
}

function compareAngles(referencePoint, p1, p2) {
  const angle1 = Math.atan2(p1.y - referencePoint.y, p1.x - referencePoint.x);
  const angle2 = Math.atan2(p2.y - referencePoint.y, p2.x - referencePoint.x);
  return angle1 - angle2;
}

function findBottomLeft(points) {
  let bottomLeft = points[0];
  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    if (point.y < bottomLeft.y || (point.y === bottomLeft.y && point.x < bottomLeft.x)) {
      bottomLeft = point;
    }
  }
  return bottomLeft;
}

function sortByAngle(referencePoint, points) {
  points.sort((p1, p2) => compareAngles(referencePoint, p1, p2));
}

export function convexHull(points) {
  const bottomLeft = findBottomLeft(points);
  sortByAngle(bottomLeft, points);

  const stack = [bottomLeft];

  for (let i = 1; i < points.length; i++) {
    const point = points[i];

    while (stack.length >= 2 && crossProduct(stack[stack.length - 2], stack[stack.length - 1], point) <= 0) {
      stack.pop();
    }

    stack.push(point);
  }

  return stack;
}

//
// // 示例用法
// const points = [
//   {x: 0, y: 0},
//   {x: 1, y: 3},
//   {x: 2, y: 1},
//   {x: 4, y: 4},
//   {x: 0, y: 2},
//   {x: 3, y: 0},
// ];
//
// const convexHullPoints = convexHull(points);
// console.log(convexHullPoints);
