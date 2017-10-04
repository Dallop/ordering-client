import { baseFontSize } from './settings'

export const pxToEm = px => `${px / baseFontSize}em`

export const createPlaceholderStyles = props => ({
  '::-webkit-input-placeholder': props,
  '::-moz-placeholder': props,
  ':-ms-input-placeholder': props,
  ':-moz-placeholder': props
})

// taken from https://github.com/scottcorgan/hex-to-rgb
export const hexToRgb = hex => {
  if (hex.charAt && hex.charAt(0) === '#') {
    hex = removeHash(hex)
  }

  if (hex.length === 3) {
    hex = expand(hex)
  }

  const bigint = parseInt(hex, 16)
  const r = bigint >> 16 & 255
  const g = bigint >> 8 & 255
  const b = bigint & 255

  return [ r, g, b ]
}

function removeHash (hex) {
  const arr = hex.split('')
  arr.shift()
  return arr.join('')
}

function expand (hex) {
  return hex
    .split('')
    .reduce((accum, value) => accum.concat([ value, value ]), [])
    .join('')
}

export const opacity = (hex, opacity) => {
  const rgb = hexToRgb(hex)
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`
}

// https://css-tricks.com/snippets/javascript/lighten-darken-color/
export function lightening (col, amt) {
  var usePound = false

  if (col[0] === '#') {
    col = col.slice(1)
    usePound = true
  }

  var num = parseInt(col, 16)

  var r = (num >> 16) + amt

  if (r > 255) r = 255
  else if (r < 0) r = 0

  var b = (num >> 8 & 0x00FF) + amt

  if (b > 255) b = 255
  else if (b < 0) b = 0

  var g = (num & 0x0000FF) + amt

  if (g > 255) g = 255
  else if (g < 0) g = 0

  return (usePound ? '#' : '') + (g | b << 8 | r << 16).toString(16)
}
