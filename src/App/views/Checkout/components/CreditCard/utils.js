export const isValidInput = input =>
  input === undefined || !isNaN(parseInt(input, 10))

const isAmEx = type => type === 'American Express'

export const determineFormat = type =>
  isAmEx(type) ? 'American Express' : 'standard'

export const determineCCType = ccnumber =>
  !ccnumber
    ? ''
    : /^(34)|^(37)/.test(ccnumber)
      ? 'American Express'
      : /^(6011)|^(622(1(2[6-9]|[3-9][0-9])|[2-8][0-9]{2}|9([01][0-9]|2[0-5])))|^(64[4-9])|^65/.test(
        ccnumber
      )
        ? 'Discover Card'
        : /^35(2[89]|[3-8][0-9])/.test(ccnumber)
          ? 'JCB'
          : /^(6304)|^(6706)|^(6771)|^(6709)/.test(ccnumber)
            ? 'Laser'
            : /^(5018)|^(5020)|^(5038)|^(5893)|^(6304)|^(6759)|^(6761)|^(6762)|^(6763)|^(0604)/.test(
              ccnumber
            )
              ? 'Maestro'
              : /^5[1-5]/.test(ccnumber)
                ? 'MasterCard'
                : /^4/.test(ccnumber)
                  ? 'Visa'
                  : /^(4026)|^(417500)|^(4405)|^(4508)|^(4844)|^(4913)|^(4917)/.test(
                    ccnumber
                  )
                    ? 'Visa Electron'
                    : ''
