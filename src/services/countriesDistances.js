class CountriesDistances {
  constructor() {
    // West Virginia Latitude & Longitude:
    this.lat = 39.000000;
    this.lon = -80.500000;
  }

  /**
   * Calculates the distance from `latitude` & `longitude` to USA (West Virginia).
   * @param {*} latitude of the country we want to calculate the distance to USA.
   * @param {*} longitude of the country we want to calculate the distance to USA.
   * @returns distance from country to USA using the Lat and Lang.
   */
  distanceToUSAFrom(latitude, longitude) {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(latitude - this.lat); // deg2rad below
    const dLon = this.deg2rad(longitude - this.lon);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
      + Math.cos(this.deg2rad(this.lat)) * Math.cos(this.deg2rad(latitude))
      * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return Math.round(d * 100) / 100; // round 2 decimals
  }

  // eslint-disable-next-line class-methods-use-this
  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
}

module.exports = { CountriesDistances };
