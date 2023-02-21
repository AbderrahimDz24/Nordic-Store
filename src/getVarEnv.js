export function getVarEnv(name) {
  if (!process.env[name]) {
    throw Error(`The var env ${name} is not defined.`);
  }
  return process.env[name];
}