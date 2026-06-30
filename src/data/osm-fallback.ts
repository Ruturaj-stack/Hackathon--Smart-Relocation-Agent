/**
 * OpenStreetMap Fallback Dataset
 * 
 * Embedded OSM-format amenity data for all 22 Chicago neighborhoods.
 * Used when the live Overpass API is unavailable or times out.
 * Data format matches the Overpass API response structure exactly,
 * so the same parsing code works for both live and fallback data.
 * 
 * Amenity types included: subway_entrance, supermarket, hospital, pharmacy, school
 */

import type { OSMElement } from './types.ts';

/** Mapping of neighborhood ID → array of OSM amenity nodes */
export const OSM_FALLBACK: Record<number, OSMElement[]> = {
  // ── 1. Logan Square ────────────────────────────────────────────────
  1: [
    { id: 101001, lat: 41.9226, lon: -87.7073, tags: { amenity: 'subway_entrance', name: 'Logan Square Blue Line' } },
    { id: 101002, lat: 41.9244, lon: -87.7102, tags: { amenity: 'subway_entrance', name: 'California Blue Line' } },
    { id: 101003, lat: 41.9220, lon: -87.7068, tags: { amenity: 'supermarket', name: 'Mariano\'s Fresh Market' } },
    { id: 101004, lat: 41.9255, lon: -87.7120, tags: { amenity: 'supermarket', name: 'Jewel-Osco' } },
    { id: 101005, lat: 41.9180, lon: -87.7045, tags: { amenity: 'hospital', name: 'Norwegian American Hospital' } },
    { id: 101006, lat: 41.9215, lon: -87.7088, tags: { amenity: 'pharmacy', name: 'Walgreens' } },
    { id: 101007, lat: 41.9240, lon: -87.7130, tags: { amenity: 'pharmacy', name: 'CVS Pharmacy' } },
    { id: 101008, lat: 41.9200, lon: -87.7050, tags: { amenity: 'school', name: 'Logan Square Elementary School' } },
    { id: 101009, lat: 41.9260, lon: -87.7080, tags: { amenity: 'school', name: 'Northwest Middle School' } },
  ],
  // ── 2. Hyde Park ───────────────────────────────────────────────────
  2: [
    { id: 102001, lat: 41.7967, lon: -87.5963, tags: { amenity: 'subway_entrance', name: '55th-56th-57th Street Metra' } },
    { id: 102002, lat: 41.7920, lon: -87.5890, tags: { amenity: 'subway_entrance', name: '59th Street Station' } },
    { id: 102003, lat: 41.7943, lon: -87.5940, tags: { amenity: 'supermarket', name: 'Whole Foods Market' } },
    { id: 102004, lat: 41.7980, lon: -87.5920, tags: { amenity: 'supermarket', name: 'Jewel-Osco Hyde Park' } },
    { id: 102005, lat: 41.7900, lon: -87.6050, tags: { amenity: 'hospital', name: 'University of Chicago Medical Center' } },
    { id: 102006, lat: 41.7950, lon: -87.5960, tags: { amenity: 'pharmacy', name: 'Walgreens Hyde Park' } },
    { id: 102007, lat: 41.7961, lon: -87.5898, tags: { amenity: 'school', name: 'University of Chicago Lab Schools' } },
    { id: 102008, lat: 41.7934, lon: -87.5955, tags: { amenity: 'school', name: 'Kenwood Academy High School' } },
  ],
  // ── 3. Lincoln Park ────────────────────────────────────────────────
  3: [
    { id: 103001, lat: 41.9222, lon: -87.6531, tags: { amenity: 'subway_entrance', name: 'Fullerton Red/Brown Line' } },
    { id: 103002, lat: 41.9330, lon: -87.6473, tags: { amenity: 'subway_entrance', name: 'Diversey Brown Line' } },
    { id: 103003, lat: 41.9278, lon: -87.6490, tags: { amenity: 'supermarket', name: 'Trader Joe\'s Lincoln Park' } },
    { id: 103004, lat: 41.9200, lon: -87.6510, tags: { amenity: 'supermarket', name: 'Whole Foods Halsted' } },
    { id: 103005, lat: 41.9190, lon: -87.6550, tags: { amenity: 'hospital', name: 'Northwestern Medicine-Lincoln Park' } },
    { id: 103006, lat: 41.9215, lon: -87.6495, tags: { amenity: 'pharmacy', name: 'CVS Lincoln Park' } },
    { id: 103007, lat: 41.9240, lon: -87.6520, tags: { amenity: 'pharmacy', name: 'Walgreens Lincoln Park' } },
    { id: 103008, lat: 41.9195, lon: -87.6480, tags: { amenity: 'school', name: 'Lincoln Park High School' } },
    { id: 103009, lat: 41.9260, lon: -87.6490, tags: { amenity: 'school', name: 'Francis W. Parker School' } },
  ],
  // ── 4. Rogers Park ─────────────────────────────────────────────────
  4: [
    { id: 104001, lat: 42.0085, lon: -87.6733, tags: { amenity: 'subway_entrance', name: 'Loyola Red Line' } },
    { id: 104002, lat: 42.0183, lon: -87.6723, tags: { amenity: 'subway_entrance', name: 'Howard Red Line Terminal' } },
    { id: 104003, lat: 42.0088, lon: -87.6750, tags: { amenity: 'supermarket', name: 'Aldi Rogers Park' } },
    { id: 104004, lat: 42.0120, lon: -87.6698, tags: { amenity: 'supermarket', name: 'Jewel-Osco Rogers Park' } },
    { id: 104005, lat: 42.0130, lon: -87.6770, tags: { amenity: 'hospital', name: 'St. Francis Hospital' } },
    { id: 104006, lat: 42.0076, lon: -87.6740, tags: { amenity: 'pharmacy', name: 'Walgreens Rogers Park' } },
    { id: 104007, lat: 42.0095, lon: -87.6715, tags: { amenity: 'school', name: 'Rogers School' } },
  ],
  // ── 5. Wicker Park ─────────────────────────────────────────────────
  5: [
    { id: 105001, lat: 41.9099, lon: -87.6777, tags: { amenity: 'subway_entrance', name: 'Damen Blue Line' } },
    { id: 105002, lat: 41.9099, lon: -87.6777, tags: { amenity: 'subway_entrance', name: 'Division Blue Line' } },
    { id: 105003, lat: 41.9110, lon: -87.6800, tags: { amenity: 'supermarket', name: 'Mariano\'s Wicker Park' } },
    { id: 105004, lat: 41.9090, lon: -87.6750, tags: { amenity: 'supermarket', name: 'Whole Foods Wicker Park' } },
    { id: 105005, lat: 41.9130, lon: -87.6820, tags: { amenity: 'pharmacy', name: 'Walgreens Wicker Park' } },
    { id: 105006, lat: 41.9080, lon: -87.6760, tags: { amenity: 'pharmacy', name: 'CVS Wicker Park' } },
    { id: 105007, lat: 41.9120, lon: -87.6790, tags: { amenity: 'school', name: 'Pritzker Elementary School' } },
  ],
  // ── 6. Avondale ────────────────────────────────────────────────────
  6: [
    { id: 106001, lat: 41.9438, lon: -87.7058, tags: { amenity: 'subway_entrance', name: 'Belmont Blue Line' } },
    { id: 106002, lat: 41.9350, lon: -87.7014, tags: { amenity: 'subway_entrance', name: 'Addison Blue Line' } },
    { id: 106003, lat: 41.9430, lon: -87.7040, tags: { amenity: 'supermarket', name: 'Pete\'s Fresh Market' } },
    { id: 106004, lat: 41.9460, lon: -87.7090, tags: { amenity: 'supermarket', name: 'Aldi Avondale' } },
    { id: 106005, lat: 41.9400, lon: -87.7020, tags: { amenity: 'pharmacy', name: 'Walgreens Avondale' } },
    { id: 106006, lat: 41.9455, lon: -87.7060, tags: { amenity: 'school', name: 'Avondale Elementary School' } },
  ],
  // ── 7. Bridgeport ──────────────────────────────────────────────────
  7: [
    { id: 107001, lat: 41.8381, lon: -87.6472, tags: { amenity: 'subway_entrance', name: 'Halsted Orange Line' } },
    { id: 107002, lat: 41.8281, lon: -87.6520, tags: { amenity: 'subway_entrance', name: 'Sox-35th Red Line' } },
    { id: 107003, lat: 41.8370, lon: -87.6490, tags: { amenity: 'supermarket', name: 'Jewel-Osco Bridgeport' } },
    { id: 107004, lat: 41.8350, lon: -87.6460, tags: { amenity: 'pharmacy', name: 'Walgreens Bridgeport' } },
    { id: 107005, lat: 41.8400, lon: -87.6510, tags: { amenity: 'school', name: 'Armour Elementary School' } },
  ],
  // ── 8. Albany Park ─────────────────────────────────────────────────
  8: [
    { id: 108001, lat: 41.9680, lon: -87.7192, tags: { amenity: 'subway_entrance', name: 'Kimball Brown Line Terminal' } },
    { id: 108002, lat: 41.9740, lon: -87.7121, tags: { amenity: 'subway_entrance', name: 'Kedzie Brown Line' } },
    { id: 108003, lat: 41.9690, lon: -87.7210, tags: { amenity: 'supermarket', name: 'Aldi Albany Park' } },
    { id: 108004, lat: 41.9700, lon: -87.7250, tags: { amenity: 'supermarket', name: 'Local grocery stores' } },
    { id: 108005, lat: 41.9670, lon: -87.7230, tags: { amenity: 'pharmacy', name: 'Walgreens Albany Park' } },
    { id: 108006, lat: 41.9715, lon: -87.7200, tags: { amenity: 'school', name: 'Albany Park Multicultural Academy' } },
  ],
  // ── 9. Pilsen ──────────────────────────────────────────────────────
  9: [
    { id: 109001, lat: 41.8564, lon: -87.6619, tags: { amenity: 'subway_entrance', name: '18th Street Pink Line' } },
    { id: 109002, lat: 41.8564, lon: -87.6619, tags: { amenity: 'supermarket', name: 'Cermak Fresh Market' } },
    { id: 109003, lat: 41.8570, lon: -87.6600, tags: { amenity: 'supermarket', name: 'Aldi Pilsen' } },
    { id: 109004, lat: 41.8550, lon: -87.6650, tags: { amenity: 'hospital', name: 'Stroger Hospital (nearby)' } },
    { id: 109005, lat: 41.8580, lon: -87.6630, tags: { amenity: 'pharmacy', name: 'Walgreens Pilsen' } },
    { id: 109006, lat: 41.8540, lon: -87.6610, tags: { amenity: 'school', name: 'Benito Juarez High School' } },
  ],
  // ── 10. Andersonville ──────────────────────────────────────────────
  10: [
    { id: 110001, lat: 41.9735, lon: -87.6701, tags: { amenity: 'subway_entrance', name: 'Berwyn Red Line' } },
    { id: 110002, lat: 41.9793, lon: -87.6699, tags: { amenity: 'subway_entrance', name: 'Bryn Mawr Red Line' } },
    { id: 110003, lat: 41.9752, lon: -87.6697, tags: { amenity: 'supermarket', name: 'Jewel-Osco Andersonville' } },
    { id: 110004, lat: 41.9760, lon: -87.6680, tags: { amenity: 'supermarket', name: 'Whole Foods Andersonville' } },
    { id: 110005, lat: 41.9745, lon: -87.6710, tags: { amenity: 'pharmacy', name: 'CVS Andersonville' } },
    { id: 110006, lat: 41.9770, lon: -87.6685, tags: { amenity: 'pharmacy', name: 'Walgreens Berwyn' } },
    { id: 110007, lat: 41.9755, lon: -87.6695, tags: { amenity: 'school', name: 'Ravenswood Elementary School' } },
  ],
  // ── 11. Humboldt Park ──────────────────────────────────────────────
  11: [
    { id: 111001, lat: 41.9014, lon: -87.7157, tags: { amenity: 'subway_entrance', name: 'Pulaski Blue Line' } },
    { id: 111002, lat: 41.9014, lon: -87.7250, tags: { amenity: 'subway_entrance', name: 'Cicero Blue Line' } },
    { id: 111003, lat: 41.9005, lon: -87.7220, tags: { amenity: 'supermarket', name: 'Pete\'s Fresh Market' } },
    { id: 111004, lat: 41.8990, lon: -87.7190, tags: { amenity: 'pharmacy', name: 'Walgreens Humboldt Park' } },
    { id: 111005, lat: 41.9020, lon: -87.7200, tags: { amenity: 'school', name: 'Brentano Math & Science Academy' } },
  ],
  // ── 12. South Loop ─────────────────────────────────────────────────
  12: [
    { id: 112001, lat: 41.8671, lon: -87.6284, tags: { amenity: 'subway_entrance', name: 'Roosevelt Red/Green/Orange Line' } },
    { id: 112002, lat: 41.8790, lon: -87.6280, tags: { amenity: 'subway_entrance', name: 'Harrison Red Line' } },
    { id: 112003, lat: 41.8660, lon: -87.6270, tags: { amenity: 'supermarket', name: 'Mariano\'s South Loop' } },
    { id: 112004, lat: 41.8680, lon: -87.6300, tags: { amenity: 'supermarket', name: 'Trader Joe\'s Roosevelt' } },
    { id: 112005, lat: 41.8700, lon: -87.6220, tags: { amenity: 'hospital', name: 'Rush University Medical Center' } },
    { id: 112006, lat: 41.8655, lon: -87.6275, tags: { amenity: 'pharmacy', name: 'CVS South Loop' } },
    { id: 112007, lat: 41.8640, lon: -87.6285, tags: { amenity: 'pharmacy', name: 'Walgreens Roosevelt' } },
    { id: 112008, lat: 41.8690, lon: -87.6310, tags: { amenity: 'school', name: 'South Loop Elementary School' } },
  ],
  // ── 13. Uptown ─────────────────────────────────────────────────────
  13: [
    { id: 113001, lat: 41.9659, lon: -87.6547, tags: { amenity: 'subway_entrance', name: 'Lawrence Red Line' } },
    { id: 113002, lat: 41.9581, lon: -87.6545, tags: { amenity: 'subway_entrance', name: 'Sheridan Red Line' } },
    { id: 113003, lat: 41.9665, lon: -87.6550, tags: { amenity: 'supermarket', name: 'Jewel-Osco Uptown' } },
    { id: 113004, lat: 41.9640, lon: -87.6530, tags: { amenity: 'pharmacy', name: 'Walgreens Uptown' } },
    { id: 113005, lat: 41.9650, lon: -87.6560, tags: { amenity: 'school', name: 'Uplift Community High School' } },
  ],
  // ── 14. Bucktown ───────────────────────────────────────────────────
  14: [
    { id: 114001, lat: 41.9177, lon: -87.6877, tags: { amenity: 'subway_entrance', name: 'Western Blue Line' } },
    { id: 114002, lat: 41.9177, lon: -87.6877, tags: { amenity: 'supermarket', name: 'Whole Foods Bucktown' } },
    { id: 114003, lat: 41.9160, lon: -87.6840, tags: { amenity: 'supermarket', name: 'Mariano\'s Bucktown' } },
    { id: 114004, lat: 41.9190, lon: -87.6860, tags: { amenity: 'pharmacy', name: 'CVS Bucktown' } },
    { id: 114005, lat: 41.9180, lon: -87.6890, tags: { amenity: 'school', name: 'Pulaski International School' } },
  ],
  // ── 15. Ukrainian Village ──────────────────────────────────────────
  15: [
    { id: 115001, lat: 41.8873, lon: -87.6705, tags: { amenity: 'subway_entrance', name: 'Damen Blue Line' } },
    { id: 115002, lat: 41.8890, lon: -87.6750, tags: { amenity: 'supermarket', name: 'Pete\'s Market Ukrainian Village' } },
    { id: 115003, lat: 41.8880, lon: -87.6720, tags: { amenity: 'pharmacy', name: 'Walgreens Ukrainian Village' } },
    { id: 115004, lat: 41.8870, lon: -87.6730, tags: { amenity: 'school', name: 'Ukrainian Village School' } },
  ],
  // ── 16. Ravenswood ─────────────────────────────────────────────────
  16: [
    { id: 116001, lat: 41.9776, lon: -87.6747, tags: { amenity: 'subway_entrance', name: 'Ravenswood Brown Line' } },
    { id: 116002, lat: 41.9820, lon: -87.6730, tags: { amenity: 'subway_entrance', name: 'Damen Brown Line' } },
    { id: 116003, lat: 41.9780, lon: -87.6750, tags: { amenity: 'supermarket', name: 'Jewel-Osco Ravenswood' } },
    { id: 116004, lat: 41.9760, lon: -87.6740, tags: { amenity: 'pharmacy', name: 'Walgreens Ravenswood' } },
    { id: 116005, lat: 41.9790, lon: -87.6745, tags: { amenity: 'school', name: 'McPherson Elementary School' } },
  ],
  // ── 17. Edgewater ──────────────────────────────────────────────────
  17: [
    { id: 117001, lat: 41.9878, lon: -87.6622, tags: { amenity: 'subway_entrance', name: 'Thorndale Red Line' } },
    { id: 117002, lat: 41.9793, lon: -87.6699, tags: { amenity: 'subway_entrance', name: 'Bryn Mawr Red Line' } },
    { id: 117003, lat: 41.9850, lon: -87.6615, tags: { amenity: 'supermarket', name: 'Jewel-Osco Edgewater' } },
    { id: 117004, lat: 41.9860, lon: -87.6630, tags: { amenity: 'pharmacy', name: 'CVS Edgewater' } },
    { id: 117005, lat: 41.9840, lon: -87.6620, tags: { amenity: 'school', name: 'Edgewater International Montessori School' } },
  ],
  // ── 18. Near West Side ─────────────────────────────────────────────
  18: [
    { id: 118001, lat: 41.8760, lon: -87.6530, tags: { amenity: 'subway_entrance', name: 'UIC-Halsted Blue Line' } },
    { id: 118002, lat: 41.8780, lon: -87.6500, tags: { amenity: 'subway_entrance', name: 'Clinton Blue Line' } },
    { id: 118003, lat: 41.8770, lon: -87.6520, tags: { amenity: 'supermarket', name: 'Mariano\'s Near West' } },
    { id: 118004, lat: 41.8730, lon: -87.6600, tags: { amenity: 'hospital', name: 'Rush University Medical Center' } },
    { id: 118005, lat: 41.8750, lon: -87.6540, tags: { amenity: 'pharmacy', name: 'Walgreens Near West' } },
    { id: 118006, lat: 41.8780, lon: -87.6560, tags: { amenity: 'school', name: 'William H. Cardenas Elementary' } },
  ],
  // ── 19. Beverly ────────────────────────────────────────────────────
  19: [
    { id: 119001, lat: 41.7133, lon: -87.6703, tags: { amenity: 'subway_entrance', name: 'Beverly/91st Metra' } },
    { id: 119002, lat: 41.7155, lon: -87.6710, tags: { amenity: 'supermarket', name: 'Mariano\'s Beverly' } },
    { id: 119003, lat: 41.7125, lon: -87.6690, tags: { amenity: 'pharmacy', name: 'Walgreens Beverly' } },
    { id: 119004, lat: 41.7140, lon: -87.6700, tags: { amenity: 'school', name: 'Beverly Elementary School' } },
  ],
  // ── 20. Lakeview ───────────────────────────────────────────────────
  20: [
    { id: 120001, lat: 41.9481, lon: -87.6553, tags: { amenity: 'subway_entrance', name: 'Belmont Red/Brown Line' } },
    { id: 120002, lat: 41.9400, lon: -87.6557, tags: { amenity: 'subway_entrance', name: 'Addison Red Line' } },
    { id: 120003, lat: 41.9450, lon: -87.6540, tags: { amenity: 'supermarket', name: 'Trader Joe\'s Lakeview' } },
    { id: 120004, lat: 41.9465, lon: -87.6570, tags: { amenity: 'supermarket', name: 'Whole Foods Lakeview' } },
    { id: 120005, lat: 41.9490, lon: -87.6520, tags: { amenity: 'hospital', name: 'Advocate Illinois Masonic' } },
    { id: 120006, lat: 41.9430, lon: -87.6545, tags: { amenity: 'pharmacy', name: 'CVS Lakeview' } },
    { id: 120007, lat: 41.9455, lon: -87.6560, tags: { amenity: 'pharmacy', name: 'Walgreens Clark/Belmont' } },
    { id: 120008, lat: 41.9445, lon: -87.6535, tags: { amenity: 'school', name: 'Lake View High School' } },
  ],
  // ── 21. Lincoln Square ─────────────────────────────────────────────
  21: [
    { id: 121001, lat: 41.9677, lon: -87.6877, tags: { amenity: 'subway_entrance', name: 'Western Brown Line' } },
    { id: 121002, lat: 41.9740, lon: -87.6875, tags: { amenity: 'subway_entrance', name: 'Damen Brown Line' } },
    { id: 121003, lat: 41.9680, lon: -87.6860, tags: { amenity: 'supermarket', name: 'Jewel-Osco Lincoln Square' } },
    { id: 121004, lat: 41.9690, lon: -87.6880, tags: { amenity: 'pharmacy', name: 'Walgreens Lincoln Square' } },
    { id: 121005, lat: 41.9675, lon: -87.6850, tags: { amenity: 'school', name: 'Lincoln Square Elementary School' } },
  ],
  // ── 22. Bronzeville ────────────────────────────────────────────────
  22: [
    { id: 122001, lat: 41.8267, lon: -87.6177, tags: { amenity: 'subway_entrance', name: '35th-Bronzeville-IIT Green Line' } },
    { id: 122002, lat: 41.8349, lon: -87.6177, tags: { amenity: 'subway_entrance', name: '43rd Street Green Line' } },
    { id: 122003, lat: 41.8260, lon: -87.6160, tags: { amenity: 'supermarket', name: 'Aldi Bronzeville' } },
    { id: 122004, lat: 41.8280, lon: -87.6190, tags: { amenity: 'pharmacy', name: 'Walgreens Bronzeville' } },
    { id: 122005, lat: 41.8270, lon: -87.6180, tags: { amenity: 'school', name: 'Bronzeville Lighthouse Charter School' } },
  ],
};

/**
 * Counts amenity types for a given neighborhood from the fallback data.
 * Returns the same shape as the live OSM API processing.
 */
export function getNeighborhoodAmenitiesFromFallback(neighborhoodId: number) {
  const elements = OSM_FALLBACK[neighborhoodId] || [];
  return {
    trainStations: elements.filter(e => e.tags.amenity === 'subway_entrance'),
    groceries: elements.filter(e => e.tags.amenity === 'supermarket' || e.tags.amenity === 'grocery'),
    hospitals: elements.filter(e => e.tags.amenity === 'hospital'),
    pharmacies: elements.filter(e => e.tags.amenity === 'pharmacy'),
    schools: elements.filter(e => e.tags.amenity === 'school'),
    osmSource: 'fallback' as const,
  };
}

export default OSM_FALLBACK;
