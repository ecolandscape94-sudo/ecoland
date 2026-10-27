// Company-authored source: COMPANY PROFILE.pdf supplied by the user, pages 1–3.
// Contact details and branding are in the raster letterhead on page 1.
export const company = {
  name: 'Eco Landscapes & Gardening Ltd',
  tagline: 'Service with diligence',
  founded: '15 March 2021',
  foundingDate: '2021-03-15',
  founder: 'Theophile Karasira',
  founderRole: 'Founder & Managing Director',
  phone: '+250788755016',
  phoneDisplay: '+250 788 755 016',
  email: 'ecolandscape94@gmail.com',
  address: 'Kagugu Cell, Kinyinya Sector, Gasabo District, Kigali, Rwanda',
  profileUrl: '/documents/eco-landscapes-company-profile.pdf',
  story: 'Founded and officially registered on 15 March 2021, Eco Landscapes & Gardening Ltd is a Rwandan company specialising in soft landscaping and gardening. From our head office in Kagugu, we serve residential, commercial and institutional spaces with planting, beautification and garden maintenance.',
  background: 'Before registering the company, founder Theophile Karasira spent more than five years providing landscaping services and supplying ornamental and indigenous tree seedlings, flowers, turf grass and shrubs to residences and small institutions.',
  nursery: 'Our own nursery brings together flowers, ornamental and indigenous tree seedlings, and shrubs. We also maintain plots of Paspalum (Turf grass) on the outskirts of Kigali, connecting the supply of planting materials with landscape installation and ongoing care.',
  mission: 'To provide affordable, high-quality landscaping and gardening services to our clients in Rwanda and beyond.',
  vision: 'To transform outdoor spaces into thriving, sustainable living ecosystems that enrich biodiversity, beautify communities, and connect people with nature throughout the year.'
};
export type ProfileProject = { name: string; category: 'Residential' | 'Commercial' | 'Institutional'; sector: string; page: 2 | 3; services: readonly string[] };
// Service scope confirmed directly by the owner on 15 October 2026.
// Dates, photographs and project outcomes have not been supplied.
const gardenCare = ['Landscaping & Gardening', 'Greening & Beautification', 'Maintenance of Gardens'];
const fullPlanting = [...gardenCare.slice(0, 2), 'Supply and Planting of Fruit Seedlings', 'Supply of Ornamental & Indigenous Tree Seedlings', gardenCare[2]];
const treePlanting = [...gardenCare.slice(0, 2), 'Supply of Ornamental & Indigenous Tree Seedlings', gardenCare[2]];
export const profileProjects: ProfileProject[] = [
  { name: 'New SOS Children’s Village in Kinyinya', category: 'Institutional', sector: 'Community', page: 2, services: fullPlanting },
  { name: 'Kepler College', category: 'Institutional', sector: 'Education', page: 2, services: fullPlanting },
  { name: 'Baho International Hospital', category: 'Institutional', sector: 'Healthcare', page: 2, services: gardenCare },
  { name: 'Kinigi IDP Model Village', category: 'Institutional', sector: 'Community', page: 2, services: fullPlanting },
  { name: 'Kampanga Secondary & Primary School', category: 'Institutional', sector: 'Education', page: 2, services: gardenCare },
  { name: 'Kinigi Early Childhood Development (ECD)', category: 'Institutional', sector: 'Early childhood development', page: 2, services: gardenCare },
  { name: 'Kinigi Health Center', category: 'Institutional', sector: 'Healthcare', page: 2, services: gardenCare },
  { name: 'Munini IDP Model Village', category: 'Institutional', sector: 'Community', page: 2, services: gardenCare },
  { name: 'Munini Secondary & Primary School', category: 'Institutional', sector: 'Education', page: 2, services: gardenCare },
  { name: 'Munini Early Childhood Development (ECD)', category: 'Institutional', sector: 'Early childhood development', page: 2, services: gardenCare },
  { name: 'Rugerero IDP Model Village', category: 'Institutional', sector: 'Community', page: 3, services: gardenCare },
  { name: 'ESSJT School of Kigali Archdiocese', category: 'Institutional', sector: 'Education', page: 3, services: treePlanting },
  { name: 'Musanze Agro Market', category: 'Commercial', sector: 'Commercial grounds', page: 3, services: fullPlanting },
  { name: 'Mechanized Division Headquarters in Gacurabwenge', category: 'Institutional', sector: 'Public institution', page: 3, services: fullPlanting },
  { name: 'Residential Premises in Kigali and Upcountry', category: 'Residential', sector: 'Residential gardens · collective reference', page: 3, services: fullPlanting }
];
