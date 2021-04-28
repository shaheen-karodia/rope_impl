import { Rope } from "./rope";

/**function to return a new Rope for testing that is th
 * e same as the exampl string on wikipedia */
export default function createSimonRope() {
  const E = new Rope({
    text: "Hello_",
    size: 6,
  });

  const F = new Rope({
    text: "my_",
    size: 3,
  });

  const J = new Rope({
    text: "na",
    size: 2,
  });

  const K = new Rope({
    text: "me_i",
    size: 4,
  });

  const M = new Rope({
    text: "s",
    size: 1,
  });

  const N = new Rope({
    text: "_Simon",
    size: 6,
  });

  const C = new Rope({
    size: 6,
    left: E,
    right: F,
  });

  const G = new Rope({
    size: 2,
    left: J,
    right: K,
  });

  const H = new Rope({
    size: 1,
    left: M,
    right: N,
  });

  const D = new Rope({
    size: 6,
    left: G,
    right: H,
  });

  const B = new Rope({
    size: 9,
    left: C,
    right: D,
  });

  const A = new Rope({
    size: 22,
    left: B,
  });

  return A;
}
