import {
  addEntitiesToStore,
  docToEntity,
  orgRef,
  makeEntityDux
} from 'App/state/utils'

const getMenu = menuId => state => {
  const menuItemIds = state.menuItems[menuId]
  const categoryIds = state.menuCategories[menuId]
  let categoryItems = {}

  if (!menuItemIds || !categoryIds) {
    return { menuCategories: [], menuItems: {} }
  }

  const menuItemMap = state.entities.menuItems
  const categoryMap = state.entities.categories

  // {[catId]: [itemId, itemId]}
  menuItemIds.forEach(id => {
    const item = menuItemMap[id]
    categoryItems[item.categoryId] = [
      ...(categoryItems[item.categoryId] || []),
      id
    ]
  })

  // [{name: categoryName, items: [menuItemId]}]
  const menuCategories = categoryIds
    .filter(catId => categoryItems[catId])
    .map(catId => ({ ...categoryMap[catId], items: categoryItems[catId] }))

  return { menuItems: menuItemMap, menuCategories }
}

export const selectors = { getMenu }

const entityConfig = [
  { name: 'categories' },
  { name: 'menuItems' },
  { name: 'optionSets' },
  { name: 'options' }
]

const configMap = makeEntityDux('menus')(entityConfig)

export const getMenuEntities = ids => dispatch => {
  orgRef
    .doc(ids.orgId)
    .collection('menus')
    .doc(ids.menuId)
    .onSnapshot(doc => dispatch(addEntitiesToStore('menus', docToEntity(doc))))
  entityConfig.forEach(
    e => dispatch(configMap[e.name].getter({ ...ids, id: ids.menuId }))
  )
}

export default {
  menuCategories: configMap.categories.reducer,
  optionSets: configMap.optionSets.reducer,
  options: configMap.options.reducer,
  menuItems: configMap.menuItems.reducer
}
