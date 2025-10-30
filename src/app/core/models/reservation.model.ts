import { Facility } from './facility.model';
import { Therapist } from './therapist.model';

export interface Reservation {
  id?: number;
  fkFacility: number;
  fkTherapist: number;
  reservationDate: string;
  facilityDto?: Facility;
  therapistDto?: Therapist;
}
