export class Rope {
  text: string;
  size: number;
  left?: Rope;
  right?: Rope;

  /**SK Updated: overloaded constructor allows me to debug*/
  constructor(param) {
    //leaf node: initial code
    if (typeof param === "string") {
      this.text = param;
      this.size = param.length;
    } else {
      //generic node that lets me debug for simonRope
      this.text = param.text;
      this.size = param.size;
      this.left = param.left;
      this.right = param.right;
    }
  }

  /**SK Updated */
  characterAt(position: number) {
    if (this.size <= position && this.right) {
      return this.right.characterAt(position - this.size);
    }

    if (this.left) {
      return this.left.characterAt(position);
    }

    return this.text[position];
  }

  // prints contents including showing the hierarchy
  // it's not required for this function to work, it's just there to help with debugging
  //
  // e.g. if the  root node has ABC, the left node has DEF, and the right node has GHI,
  // the output will look like:
  // -DEF
  // ABC
  // -GHI
  toStringDebug(indentLevel: number = 0): string {
    const leftText = this.left ? this.left.toStringDebug(indentLevel + 1) : "";
    const rightText = this.right
      ? this.right.toStringDebug(indentLevel + 1)
      : "";
    return (
      leftText + Array(indentLevel + 1).join("-") + this.text + "\n" + rightText
    );
  }

  /**SK Updated method */
  toString(): string {
    const centerText = this.text ? this.text : ""; //TODO potential issues with falsey values
    const leftText = this.left ? this.left.toString() : "";
    const rightText = this.right ? this.right.toString() : "";
    return leftText + centerText + rightText;
  }

  /**SK Updated method  */
  totalSize(): number {
    const leftSize = this.size;
    const rightSize = this.right ? this.right.totalSize() : 0;
    return leftSize + rightSize;
  }

  // Helper method which converts the rope into an associative array
  //
  // Only used for debugging, this has no functional purpose
  toMap(): MapRepresentation {
    const mapVersion: MapRepresentation = {
      text: this.text,
    };
    if (this.right) mapVersion.right = this.right.toMap();
    if (this.left) mapVersion.left = this.left.toMap();
    return mapVersion;
  }
}

type MapRepresentation = {
  text: string;
  left?: MapRepresentation;
  right?: MapRepresentation;
};
export function createRopeFromMap(map: MapRepresentation): Rope {
  const rope = new Rope(map.text);
  if (map.left) rope.left = createRopeFromMap(map.left);
  if (map.right) rope.right = createRopeFromMap(map.right);
  return rope;
}

export function prepend(rope: Rope, text: string): Rope {
  if (rope.left) {
    prepend(rope.left, text);
  } else {
    rope.left = new Rope(text);
  }
  return rope;
}

export function append(rope: Rope, text: string): Rope {
  if (rope.right) {
    append(rope.right, text);
  } else {
    rope.right = new Rope(text);
  }
  return rope;
}

export function splitAt(
  rope: Rope,
  position: number
): { left: Rope; right: Rope } {
  const path = [];

  while (rope) {
    path.unshift(rope);

    if (rope.size <= position && rope.right) {
      position = position - rope.size;
      rope = rope.right;
    } else if (rope.left) {
      rope = rope.left;
    } else {
      //base case
      rope = null;
    }
  }

  console.log("new index to check", position);

  return { left: null, right: null };
}

/**SK Updated */
export function concat(rope1: Rope, rope2: Rope) {
  const combined = new Rope({
    left: rope1,
    right: rope2,
    size: rope1.totalSize(),
  });

  return combined;
}

// export function deleteRange(rope: Rope, start: number, end: number): Rope {
//   const ropeTuple1 = splitAt(rope, start);
//   const ropeTuple2 = splitAt(ropeTuple1.right, start + end);
//   return concat(ropeTuple1.left, ropeTuple2.right);
// }

// export function insert(rope: Rope, text: string, location: number): Rope {
//   const ropeTuple = splitAt(rope, location);
//   const updatedleft = concat(ropeTuple.left, new Rope(text));
//   return concat(updatedleft, ropeTuple.right);
// }
