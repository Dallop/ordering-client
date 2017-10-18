import { configure } from '@storybook/react'
import '../src/App/UI/global'
function loadStories () {
  require('../src/App/UI/Collapse/story.js')
  require('../src/App/views/Logistics/components/Schedule/story.js')
}

configure(loadStories, module)
