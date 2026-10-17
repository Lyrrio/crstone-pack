// Cr. Stone — recettes. Modifie ce fichier puis tape /reload en jeu (pas besoin de relancer).
//
// Progression de l'âge de pierre :
//   feuillages -> bâtons · gravier -> silex -> clic droit sur de la roche -> silex taillé
//   silex taillé + bâton -> couteau en silex (Farmer's Delight)
//   couteau sur l'herbe -> paille -> corde (Farmer's Delight)
//   silex taillé + bâton + corde -> hachette en silex -> bûches -> planches
//   outils en bois et en pierre : liés avec une corde

const WINES = ['vinery:red_wine', 'vinery:apple_wine', 'vinery:cherry_wine', 'vinery:noir_wine', 'vinery:clark_wine']
const ROPE = 'farmersdelight:rope'
const KNAPPED = 'crstone:knapped_flint'

ServerEvents.recipes(event => {
  // --- Âge de pierre ---
  event.remove({ id: 'farmersdelight:flint_knife' })
  event.shaped('farmersdelight:flint_knife', [
    'F',
    'S'
  ], { F: KNAPPED, S: 'minecraft:stick' })

  // 2x2 : se fait dans l'inventaire, avant d'avoir un établi
  event.shaped('crstone:flint_hatchet', [
    'FF',
    'SR'
  ], { F: KNAPPED, S: 'minecraft:stick', R: ROPE })

  // Outils en bois et en pierre : le manche est lié par une corde
  const TOOLS = [
    ['pickaxe', ['MMM', ' S ', ' R ']],
    ['axe', ['MM', 'MS', ' R']],
    ['shovel', ['M', 'S', 'R']],
    ['hoe', ['MM', ' S', ' R']],
    ['sword', ['M ', 'M ', 'SR']]
  ]
  const MATERIALS = [['wooden', '#minecraft:planks'], ['stone', '#minecraft:stone_tool_materials']]
  MATERIALS.forEach(([material, ingredient]) => {
    TOOLS.forEach(([tool, pattern]) => {
      const id = `minecraft:${material}_${tool}`
      event.remove({ output: id })
      event.shaped(id, pattern, { M: ingredient, S: 'minecraft:stick', R: ROPE })
    })
  })

  // --- Chimie ---
  // Alcool distillé : la méthode primitive (feu de camp, lent) ...
  WINES.forEach(w => event.campfireCooking('crstone:distilled_alcohol', w).cookingTime(600).xp(0.35))

  // ... et la méthode Create (mixeur chauffé, rapide)
  event.custom({
    type: 'create:mixing',
    heat_requirement: 'heated',
    ingredients: [WINES.map(w => ({ item: w }))],
    results: [{ id: 'crstone:distilled_alcohol' }]
  })

  // Acide nitrique : salpêtre (nitrate TFMG) + acide sulfurique, comme Senku
  event.custom({
    type: 'create:mixing',
    heat_requirement: 'heated',
    ingredients: [
      { item: 'tfmg:nitrate_dust' },
      { item: 'tfmg:nitrate_dust' },
      { item: 'minecraft:glass_bottle' },
      { type: 'neoforge:single', amount: 250, fluid: 'tfmg:sulfuric_acid' }
    ],
    results: [{ id: 'crstone:nitric_acid' }]
  })

  // Fluide miracle : acide nitrique + alcool (30/70)
  event.custom({
    type: 'create:mixing',
    ingredients: [
      { item: 'crstone:nitric_acid' },
      { item: 'crstone:distilled_alcohol' },
      { item: 'crstone:distilled_alcohol' }
    ],
    results: [{ id: 'crstone:revival_fluid', count: 3 }]
  })

  // --- Sans Nether : ce que Create allait chercher là-bas ---
  // Brûleur vide : pierre au lieu de netherrack
  event.remove({ id: 'create:crafting/kinetics/empty_blaze_burner' })
  event.shaped('create:empty_blaze_burner', [
    ' I ',
    'ICI',
    ' I '
  ], { I: '#c:plates/iron', C: '#c:cobblestones' })

  // Brûleur allumé : pas de blaze à capturer, on l'alimente au charbon
  event.shapeless('create:blaze_burner', ['create:empty_blaze_burner', 'minecraft:coal_block', 'minecraft:flint_and_steel'])

  // Farine de cendre (gâteau de blaze, surchauffe) : à partir de tuf au moulin
  event.custom({
    type: 'create:milling',
    ingredients: [{ item: 'minecraft:tuff' }],
    processing_time: 150,
    results: [{ id: 'create:cinder_flour', chance: 0.5 }]
  })

  // La Medusa n'a pas de recette : à trouver (ou à ajouter ici plus tard).
})
