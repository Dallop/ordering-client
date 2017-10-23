import { css } from 'glamor'
import WebFont from 'webfontloader'
import { baseFontSize } from './settings'

css.global('html', { fontSize: baseFontSize })

WebFont.load({ google: { families: [ 'Work+Sans:400,700', 'sans-serif' ] } })
