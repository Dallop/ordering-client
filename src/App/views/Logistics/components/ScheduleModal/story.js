import React from 'react'
import { storiesOf } from '@storybook/react'
import Schedule from './index'
import weekModel from 'App/state/logistics/dummy-data'

storiesOf('Schedule', module).add('basic', () => (
  <div>
    <Schedule weekModel={weekModel} />
  </div>
))
