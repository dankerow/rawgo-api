/**
 * @description A method to validate URLs
 * @param {string} value
 * @returns {boolean}
 */
const url = (value: string): boolean => {
  const RegExp = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/i
  return (RegExp.test(encodeURI(value)))
}

/**
 * @description A method to validate strings
 * @param {*} value
 * @returns {boolean}
 */
const string = (value: any): boolean => {
  return typeof value === 'string'
}

export { url, string }
