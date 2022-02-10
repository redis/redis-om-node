import { GeoPoint } from "../../../lib";

export const A_DATE: Date = new Date('1997-07-04T16:56:55.000Z');
export const A_DATE_ISO: string = A_DATE.toISOString();
export const A_DATE_EPOCH: number = A_DATE.getTime();
export const A_DATE_EPOCH_STRING: string = A_DATE_EPOCH.toString();

export const ANOTHER_DATE: Date = new Date('1969-07-20T20:17:40.000Z');
export const ANOTHER_DATE_ISO: string = ANOTHER_DATE.toISOString();
export const ANOTHER_DATE_EPOCH: number = ANOTHER_DATE.getTime();
export const ANOTHER_DATE_EPOCH_STRING: string = ANOTHER_DATE_EPOCH.toString();

export const A_THIRD_DATE: Date = new Date('2015-07-14T11:49:57.000Z');
export const A_THIRD_DATE_ISO: string = A_THIRD_DATE.toISOString();
export const A_THIRD_DATE_EPOCH: number = A_THIRD_DATE.getTime();
export const A_THIRD_DATE_EPOCH_STRING: string = A_THIRD_DATE_EPOCH.toString();

export const A_GEOPOINT: GeoPoint = { longitude: 12.34, latitude: 56.78 };
export const A_GEOPOINT_JSON: string = JSON.stringify(A_GEOPOINT);
export const A_GEOPOINT_STRING: string = `${A_GEOPOINT.longitude},${A_GEOPOINT.latitude}`;

export const ANOTHER_GEOPOINT: GeoPoint = { longitude: 23.45, latitude: 67.89 };
export const ANOTHER_GEOPOINT_JSON: string = JSON.stringify(ANOTHER_GEOPOINT);
export const ANOTHER_GEOPOINT_STRING: string = `${ANOTHER_GEOPOINT.longitude},${ANOTHER_GEOPOINT.latitude}`;

export const A_THIRD_GEOPOINT: GeoPoint = { longitude: 34.56, latitude: 78.90 };
export const A_THIRD_GEOPOINT_JSON: string = JSON.stringify(A_THIRD_GEOPOINT);
export const A_THIRD_GEOPOINT_STRING: string = `${A_THIRD_GEOPOINT.longitude},${A_THIRD_GEOPOINT.latitude}`;

export const AN_ARRAY: string[] = [ 'foo', 'bar', 'baz' ];
export const AN_ARRAY_JSON: string = JSON.stringify(AN_ARRAY);
export const AN_ARRAY_JOINED: string = AN_ARRAY.join('|');
export const AN_ARRAY_LEN: number = AN_ARRAY.length;

export const ANOTHER_ARRAY: string[] = [ 'bar', 'baz', 'qux' ];
export const ANOTHER_ARRAY_JSON: string = JSON.stringify(ANOTHER_ARRAY);
export const ANOTHER_ARRAY_JOINED: string = ANOTHER_ARRAY.join('|');
export const ANOTHER_ARRAY_LEN: number = ANOTHER_ARRAY.length;

export const A_THIRD_ARRAY: string[] = [ 'baz', 'qux', 'quux' ];
export const A_THIRD_JSON: string = JSON.stringify(A_THIRD_ARRAY);
export const A_THIRD_ARRAY_JOINED: string = A_THIRD_ARRAY.join('|');
export const A_THIRD_ARRAY_LEN: number = ANOTHER_ARRAY.length;
