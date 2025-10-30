import { Building } from './building.model';

export interface Facility {
  id?: number;
  fkBuilding: number;
  roomNumber: string;
  buildingDto?: Building;
}
