export class Rope {
  text: string;
  size: number;
  left?: Rope;
  right?: Rope;

  /**SK Updated: This method needs to be overloaded to allow
   * for both leafs that have text and non leaf nodes,
   * without non leaf nodes one cannot do any sort of tree manipulation
   */
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

  /**SK Updated: In the intial method the size property was not being used correctly
   * I updated this method with the algorithm in the wikipedia article
   */
  characterAt(position: number) {
    if (this.size <= position && this.right) {
      return this.right.characterAt(position - this.size);
    }

    if (this.left) {
      return this.left.characterAt(position);
    }

    return this.text[position];
  }

  /**SK Updated method: The initial method treated all nodes as if they had text,
   * Not all nodes are leaves therefore the center text needs to be conditional
   */
  toString(): string {
    const centerText = this.text ? this.text : "";
    const leftText = this.left ? this.left.toString() : "";
    const rightText = this.right ? this.right.toString() : "";
    return leftText + centerText + rightText;
  }

  /**SK Updated method: initial method does not take into account ignoring recursing down
   * the left branch given that its size is already stored
   */
  totalSize(): number {
    const leftSize = this.size;
    const rightSize = this.right ? this.right.totalSize() : 0;
    return leftSize + rightSize;
  }
}

/**SK Comment: prepend is incorrect, the weights of non leaf nodes are not being updated */
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

/**SK Updated */
function splitAt(rope: Rope, position: number): { left: Rope; right: Rope } {
  //Special case: Spliting at index 0
  if (position == 0) {
    return { left: new Rope(""), right: rope };
  }

  const splitPointEnum = {
    SPLIT_POINT_END: 0,
    SPLIT_POINT_MIDDLE: 1,
  };
  let splitPointType = null;
  const path = [];

  //build the path to the leaf containing 'position'
  while (rope) {
    path.unshift(rope);

    if (rope.size <= position && rope.right) {
      position = position - rope.size;
      rope = rope.right;
    } else if (rope.left) {
      rope = rope.left;
    } else {
      //At leaf determine if we are at end of rope or beginning of rope
      const { SPLIT_POINT_END, SPLIT_POINT_MIDDLE } = splitPointEnum;
      splitPointType = position === 0 ? SPLIT_POINT_END : SPLIT_POINT_MIDDLE;

      rope = null;
    }
  }

  //reduce SPLIT_POINT_MIDDLE CASE to SPLIT POINT END CASE
  if (splitPointType === splitPointEnum.SPLIT_POINT_MIDDLE) {
    const leaf = path[0];

    const leftText = leaf.text.slice(0, position);
    const rightText = leaf.text.slice(position);

    const left = new Rope(leftText);
    const right = new Rope(rightText);

    leaf.left = left;
    leaf.right = right;
    leaf.text = null;
    leaf.size = left.size;

    //reassign a new leaf to the end of the path
    path.unshift(right);
  }

  //traverse path from leaf to node updating weights and collecting right orphans that cover letters
  const orphans = [];
  let noOfLettersOrphaned = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const child = path[i];
    const parent = path[i + 1];

    if (i == 0) {
      //special case for the leaf node
      noOfLettersOrphaned += parent.right.totalSize();
      orphans.push(parent.right);
      parent.right = null;
    } else if (parent.left === child) {
      parent.size -= noOfLettersOrphaned;

      if (parent.right) {
        noOfLettersOrphaned += parent.right.totalSize();
        orphans.push(parent.right);
        parent.right = null;
      }
    }
  }

  //build up right branch from orphans
  let right = orphans.shift();
  while (orphans.length > 0) {
    right = concat(right, orphans.shift());
  }

  return { left: path.pop(), right: right };
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
/**SK Updated */
export function deleteRange(rope: Rope, start: number, end: number): Rope {
  const ropeTuple1 = splitAt(rope, start);
  const ropeTuple2 = splitAt(ropeTuple1.right, end - start);
  return concat(ropeTuple1.left, ropeTuple2.right);
}

export function insert(rope: Rope, text: string, location: number): Rope {
  const ropeTuple = splitAt(rope, location);
  const updatedleft = concat(ropeTuple.left, new Rope(text));
  return concat(updatedleft, ropeTuple.right);
}
