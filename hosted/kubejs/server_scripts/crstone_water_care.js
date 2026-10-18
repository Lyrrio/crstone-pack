// Remède fictif de gameplay : mélange 2x2, puis cuisson au feu de camp ou au four.
ServerEvents.recipes(event => {
  event.shapeless('crstone:herbal_mixture', ['toughasnails:purified_water_bottle', 'minecraft:dandelion', 'minecraft:sugar', 'minecraft:bowl']).id('crstone:herbal_mixture')
  event.campfireCooking('crstone:herbal_remedy', 'crstone:herbal_mixture').cookingTime(200).xp(0.1).id('crstone:herbal_remedy_campfire')
  event.smelting('crstone:herbal_remedy', 'crstone:herbal_mixture').cookingTime(200).xp(0.1).id('crstone:herbal_remedy_smelting')
})
