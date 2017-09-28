import React from 'react'
import { storiesOf } from '@storybook/react'
import Collapse from './index'

storiesOf('Collapse', module).add('basic', () => (
  <div>
    <Collapse trigger='open me' triggerWhenOpen='close me'>
      <div style={{ height: '400px', backgroundColor: 'red' }} />
    </Collapse>
  </div>
))
