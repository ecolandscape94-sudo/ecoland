// Owner-supplied examples of company work, not matched to named project sites.
export const workPhotos = [
  ['Sculpted lawns', 'Green lawn, paved paths and ornamental planting around a home'],
  ['Texture & greenery', 'Ornamental conifers arranged among decorative garden rocks'],
  ['A softer edge', 'Palms and flowering borders edged with white decorative stones'],
  ['An outdoor retreat', 'A garden seating area surrounded by lawn and palms'],
  ['Layers of colour', 'Raised garden beds with flowering plants and shaped shrubs'],
  ['Curves that connect', 'A curved stone border connecting a lawn and colourful planting'],
  ['A welcoming entrance', 'Ornamental planting and rock details beside entrance steps'],
  ['Green beside the home', 'A palm and stone-edged planting bed beside a residential lawn'],
  ['Lush by nature', 'Tropical foliage and red flowers in a densely planted garden border'],
  ['Patterns in the garden', 'A curved garden bed with decorative stone bands and shrubs'],
  ['Room to flourish', 'A broad landscaped lawn with shaped planting beds'],
  ['Details at your feet', 'Pebble borders and ornamental planting framing a green lawn'],
  ['A garden to come home to', 'A residential lawn framed by low stone-filled planting beds'],
  ['Open space, thoughtfully framed', 'An open lawn bordered by palms and white decorative stones'],
  ['Small spaces, beautiful details', 'Geometric raised planting beds beside a paved courtyard']
].map(([title, alt], index) => ({
  src: `/${index + 1}.${index === 5 ? 'png' : 'webp'}`,
  title, alt,
  width: index === 4 ? 1448 : index === 5 ? 1541 : index === 7 ? 1085 : index >= 11 && index <= 13 ? 1086 : 1254,
  height: index === 4 ? 1086 : index === 5 ? 1020 : index === 7 ? 1449 : index >= 11 && index <= 13 ? 1448 : 1254
}));
