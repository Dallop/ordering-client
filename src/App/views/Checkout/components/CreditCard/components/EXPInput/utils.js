export const format = val => {
  const $val = val.toString()

  if ($val.length < 2) {
    return '0' + val
  } else if ($val.length > 2) {
    return $val.slice(2)
  }

  return $val
}

export const createOptionValues = (start, end) => {
  let results = []
  for (let i = start; i < start + end; i++) {
    results.push(i)
  }
  return results
}
