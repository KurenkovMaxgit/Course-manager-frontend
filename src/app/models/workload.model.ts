import { Group } from './group.model';
import { LessonType } from './lesson-type.model';
import { Teacher } from './teacher.model';
import { Subject } from './subject.model';

export type Workload = {
  _id: string;
  teacher: Teacher;
  group: Group;
  subject: Subject;
  type: LessonType;
  hours: number;
  price: number;
};

export type WorkloadTableRow = {
  _id: string;
  teacher: string;
  group: string;
  subject: string;
  type: string;
  hours: number;
  price: string;
};
