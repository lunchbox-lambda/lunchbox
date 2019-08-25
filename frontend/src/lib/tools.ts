/* eslint-disable import/prefer-default-export */

export function resolveEnvironment(variable: string) {
  const parts = variable.split('::');
  if (parts.length !== 2) throw new Error(`Not a synthesized variable: ${variable}`);
  return parts[0];
}
