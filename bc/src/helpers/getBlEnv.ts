export const getBlEnv = (varName: string): boolean => {
  return process.env[varName]?.toLowerCase() === 'true'
}
