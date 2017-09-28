import { configure } from '@storybook/react'
import '../src/App/UI/global'
function loadStories () {
  require('../src/App/UI/Collapse/story.js')
}

configure(loadStories, module)
