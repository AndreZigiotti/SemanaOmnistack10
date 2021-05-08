function parseStringAsArray(arrayAsString: string) {
  return arrayAsString.split(',').map(tech => tech.trim())
}

export { parseStringAsArray }