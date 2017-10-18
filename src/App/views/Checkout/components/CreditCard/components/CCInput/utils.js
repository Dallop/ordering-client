const slice = (string, start, skip) => {
  return string.slice(start, start + skip)
}

const formatFn = { standard, AmericanExpress }

export const format = (ccNum, style) => formatFn[style.replace(' ', '')](ccNum)

function standard (ccNum) {
  const spacesNeeded = ccNum.length / 4
  let sections = []

  for (let i = 0; i <= spacesNeeded; i++) {
    const section = slice(ccNum, i * 4, 4)

    if (section) {
      sections.push(section)
    }
  }

  return sections.join(' ') || ccNum
}

function AmericanExpress (ccNum) {
  const { length } = ccNum

  if (length <= 4) return ccNum

  let sections = []

  sections.push(slice(ccNum, 0, 4))
  sections.push(slice(ccNum, 4, 6))

  if (length > 10) {
    sections.push(ccNum.slice(10))
  }

  return sections.join(' ')
}
