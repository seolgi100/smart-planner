//카테고리 타입
export type EventCategory =
  | 'exam'        //시험
  | 'assignment'  //과제
  | 'meeting'     //약속/미팅
  | 'project'     //프로젝트
  | 'personal'    //개인
  | 'other';      //기타

//중요도
export type Priority = 'high' | 'medium' | 'low';

//일정 타입
export interface Event {
  //필수
  id: string;
  title: string;
  category: EventCategory;
  dueDate: string;         //마감일 (당일 끝나는 일정은 이것만)
  isCompleted: boolean;
  createdAt: string;

  //선택
  priority?: Priority;
  startDate?: string;      //여러 날에 걸친 일정만 입력
  estimatedHours?: number; //예상 소요 시간
  location?: string;       //장소
  description?: string;    //상세 설명
  memo?: string;           //메모 (시험 범위, 포인트 등)
  materials?: string[];    //준비물
}

//일정 생성/수정 폼 타입
export type EventFormData = Omit<Event, 'id' | 'createdAt'>;

//정렬 옵션
export type SortOption =
  | 'dueDate'          //날짜
  | 'priority'         //중요도
  | 'estimatedHours';  //소요 시간

//프로젝트 태스크
export interface ProjectTask {
  id: string;
  title: string;
  isCompleted: boolean;
  dueDate?: string;
}

//프로젝트 타입
export interface Project {
  //필수
  id: string;
  title: string;
  dueDate: string;
  tasks: ProjectTask[];
  isCompleted: boolean;
  createdAt: string;

  //선택
  priority?: Priority;
  description?: string;
}

//프로젝트 생성/수정 폼 타입
export type ProjectFormData = Omit<Project, 'id' | 'createdAt'>;

// ─── 루틴 ───────────────────────────────────────────────
export type RoutineCategory = 'school' | 'work' | 'parttime' | 'exercise' | 'other';

// daily: 매일 / weekly: 특정 요일 (repeatDays = [0-6]) / monthly: 매월 (repeatDays = [dayOfMonth])
export type RepeatType = 'daily' | 'weekly' | 'monthly';

export interface DaySchedule {
  startTime?: string;  // "HH:MM"
  endTime?: string;    // "HH:MM"
}

export interface Routine {
  id: string;
  title: string;
  category: RoutineCategory;
  repeatType: RepeatType;
  repeatDays: number[];   // weekly: 요일 인덱스(0=일~6=토), monthly: [일자]
  startTime?: string;     // daily/monthly 용 공통 시작 시간
  endTime?: string;       // daily/monthly 용 공통 종료 시간
  daySchedules?: Record<number, DaySchedule>;  // weekly: 요일별 개별 시간 (키 = weekday index)
  endDate?: string;       // 루틴 종료일 (선택, 이 날 이후엔 캘린더에 표시 안 됨)
  isActive: boolean;
  createdAt: string;
  description?: string;
}

export type RoutineFormData = Omit<Routine, 'id' | 'createdAt'>;