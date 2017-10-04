import { lightening as l } from './utils'

export const fonts = { primary: 'Work Sans' }

export const baseFontSize = 16

export const primaryContainerWidth = '600px'

const monochrome = {
  // https://color.adobe.com/create/color-wheel/?copy=true&base=1&rule=Monochromatic&selected=2&name=Copy%20of%20KnotJustNautical&mode=rgb&rgbvalues=0.37582745098039216,0.3788705882352945,0.38039215686274513,0.8698274509803922,0.8768705882352948,0.8803921568627451,0.9686274509803922,0.9764705882352941,0.9803921568627451,0.2617098039215687,0.3408313725490286,0.38039215686274513,0.6722274509803922,0.6776705882352947,0.6803921568627451&swatchOrder=0,1,2,3,4
  corduroy: '#606161',
  iron: l('#DEE0E0', 10),
  // base of Monochromatic scheme
  aqua_haze: '#F7F9FA',
  river_bed: '#435761',
  edward: '#ABADAD'
}

// palette
const p = { ...monochrome, flamingo: '#F4513F', cornflowerBlue: '#6495ED' }

export const colors = {
  primaryCta: p.flamingo,
  secondaryCta: p.cornflowerBlue,
  lightBase: 'white',
  lightBaseHighlight: p.aqua_haze,
  lightBaseBorder: l(p.aqua_haze, -10),
  base: p.iron,
  baseHighlight: l(p.iron, -10),
  baseBorder: l(p.iron, -10),
  darkBase: p.river_bed,
  darkBaseHighlight: l(p.river_bed, -10),
  darkBaseBorder: l(p.river_bed, -10),
  textOnLight: l(p.river_bed, -20),
  textOnDark: p.aqua_haze,
  disabledBackground: p.iron,
  textOnDisabled: p.edward
}
