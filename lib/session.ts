// Throwaway in-memory session for the hackathon demo.
// No real auth backend yet — login/signup flips this true; reload resets it.

let signedIn = false;

export function isSignedIn() {
  return signedIn;
}

export function setSignedIn(v: boolean) {
  signedIn = v;
}
