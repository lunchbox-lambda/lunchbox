export function synthesizeVariable(env: string, variable: string) {
  return `${env}::${variable}`;
}

export function resolveVariable(variable: string) {
  const parts = variable.split('::');
  if (parts.length !== 2)
    throw new Error(`Not a synthesized variable: ${variable}`);
  return parts[1];
}

export function resolveEnvironment(variable: string) {
  const parts = variable.split('::');
  if (parts.length !== 2)
    throw new Error(`Not a synthesized variable: ${variable}`);
  return parts[0];
}

export function checkVariable(env: string, variable: string) {
  return variable.startsWith(`${env}::`);
}
