// Curated country -> region -> city data for the project location cascade.
// VAT is the headline standard rate (shown in the UI; the backend is authoritative).
// Cameroon (the default market) is covered fully; others carry their main hubs.

export interface CountryData {
  name: string;
  currency: string;
  vat: number; // decimal, e.g. 0.195 = 19.5%
  regions: { name: string; cities: string[] }[];
}

export const COUNTRIES: CountryData[] = [
  {
    name: 'Cameroon',
    currency: 'XAF',
    vat: 0.195,
    regions: [
      { name: 'Adamawa', cities: ['Ngaoundéré', 'Tibati', 'Banyo'] },
      { name: 'Centre', cities: ['Yaoundé', 'Mbalmayo', 'Obala', 'Bafia'] },
      { name: 'East', cities: ['Bertoua', 'Abong-Mbang', 'Batouri'] },
      { name: 'Far North', cities: ['Maroua', 'Kousséri', 'Mokolo'] },
      { name: 'Littoral', cities: ['Douala', 'Nkongsamba', 'Edéa', 'Loum'] },
      { name: 'North', cities: ['Garoua', 'Guider', 'Figuil'] },
      { name: 'North-West', cities: ['Bamenda', 'Kumbo', 'Ndop'] },
      { name: 'South', cities: ['Ebolowa', 'Kribi', 'Sangmélima'] },
      { name: 'South-West', cities: ['Buea', 'Limbe', 'Kumba', 'Tiko'] },
      { name: 'West', cities: ['Bafoussam', 'Dschang', 'Foumban', 'Mbouda'] },
    ],
  },
  {
    name: 'Nigeria',
    currency: 'NGN',
    vat: 0.075,
    regions: [
      { name: 'Lagos', cities: ['Lagos', 'Ikeja', 'Lekki', 'Epe'] },
      { name: 'FCT', cities: ['Abuja', 'Gwagwalada', 'Kuje'] },
      { name: 'Rivers', cities: ['Port Harcourt', 'Bonny'] },
      { name: 'Kano', cities: ['Kano', 'Wudil'] },
      { name: 'Oyo', cities: ['Ibadan', 'Ogbomosho'] },
    ],
  },
  {
    name: 'Ghana',
    currency: 'GHS',
    vat: 0.15,
    regions: [
      { name: 'Greater Accra', cities: ['Accra', 'Tema', 'Madina'] },
      { name: 'Ashanti', cities: ['Kumasi', 'Obuasi', 'Ejisu'] },
      { name: 'Western', cities: ['Sekondi-Takoradi', 'Tarkwa'] },
      { name: 'Northern', cities: ['Tamale', 'Yendi'] },
    ],
  },
  {
    name: 'Kenya',
    currency: 'KES',
    vat: 0.16,
    regions: [
      { name: 'Nairobi', cities: ['Nairobi', 'Westlands', 'Karen'] },
      { name: 'Mombasa', cities: ['Mombasa', 'Nyali'] },
      { name: 'Kisumu', cities: ['Kisumu', 'Maseno'] },
      { name: 'Nakuru', cities: ['Nakuru', 'Naivasha'] },
    ],
  },
  {
    name: 'South Africa',
    currency: 'ZAR',
    vat: 0.15,
    regions: [
      { name: 'Gauteng', cities: ['Johannesburg', 'Pretoria', 'Soweto'] },
      { name: 'Western Cape', cities: ['Cape Town', 'Stellenbosch'] },
      { name: 'KwaZulu-Natal', cities: ['Durban', 'Pietermaritzburg'] },
    ],
  },
  {
    name: "Côte d'Ivoire",
    currency: 'XOF',
    vat: 0.18,
    regions: [
      { name: 'Abidjan', cities: ['Abidjan', 'Cocody', 'Yopougon'] },
      { name: 'Yamoussoukro', cities: ['Yamoussoukro'] },
      { name: 'Bas-Sassandra', cities: ['San-Pédro'] },
    ],
  },
  {
    name: 'Senegal',
    currency: 'XOF',
    vat: 0.18,
    regions: [
      { name: 'Dakar', cities: ['Dakar', 'Pikine', 'Rufisque'] },
      { name: 'Thiès', cities: ['Thiès', 'Mbour'] },
      { name: 'Saint-Louis', cities: ['Saint-Louis'] },
    ],
  },
];

export const getCountry = (name: string) => COUNTRIES.find((c) => c.name === name);
export const getRegions = (country: string) => getCountry(country)?.regions ?? [];
export const getCities = (country: string, region: string) =>
  getRegions(country).find((r) => r.name === region)?.cities ?? [];
