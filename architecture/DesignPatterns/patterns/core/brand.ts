type NominalTyped<Type, Brand> = Type & { __type: Brand };

type Point2d = { x: number; y: number };

function distance1(first: Point2d, second: Point2d) {
  return Math.sqrt(
    Math.pow(first.x - second.x, 2) + Math.pow(first.y - second.y, 2)
  );
}

console.log(distance1({ x: 1, y: 2 }, { x: 3, y: 4 }));

function distance2(
  first: NominalTyped<Point2d, "Point2d">,
  second: NominalTyped<Point2d, "Point2d">
) {
  return Math.sqrt(
    Math.pow(first.x - second.x, 2) + Math.pow(first.y - second.y, 2)
  );
}
