export const throwIfInBrowser = (): void => {
  if ('document' in globalThis) {
    throw new Error(
      "This module cannot be used in the browser. Otherwise, your private access token would be made public, which puts customers' personal data at risk.",
    );
  }
};
