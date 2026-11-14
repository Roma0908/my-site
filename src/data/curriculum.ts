import { Lang } from '../types';

export interface CourseItem {
  code: string;
  trimester: 1 | 2 | 3;
  dates: Record<Lang, string>;
  title: Record<Lang, string>;
  component: 'ОК' | 'ВК'; // Обязательный / Вузовский компонент
  credits: number;
  defaultStatus: 'in_progress' | 'planned' | 'completed';
  // Связь дисциплины с навыками и профилями CareerPath AI
  relatedSkills: string[];
  boostsCareers: string[];
}

export interface TrimesterSummary {
  trimester: 1 | 2 | 3;
  period: Record<Lang, string>;
  plannedCredits: number;
  inProgressCredits: number;
  completedCredits: number;
  workloadNote: Record<Lang, string>;
}

export const TRIMESTER_SUMMARIES: TrimesterSummary[] = [
  {
    trimester: 1,
    period: {
      kk: '1 қыркүйек – 12 желтоқсан',
      ru: '1 сентября – 12 декабря',
      en: 'September 1 – December 12',
    },
    plannedCredits: 30,
    inProgressCredits: 24,
    completedCredits: 0,
    workloadNote: {
      kk: 'Базалық бейімделу триместрі: бағдарламалау және математика негіздері.',
      ru: 'Базовый адаптационный триместр: фундамент программирования и матанализа.',
      en: 'Foundational adaptation trimester: basics of programming and calculus.',
    },
  },
  {
    trimester: 2,
    period: {
      kk: '14 желтоқсан – 13 наурыз',
      ru: '14 декабря – 13 марта',
      en: 'December 14 – March 13',
    },
    plannedCredits: 35,
    inProgressCredits: 0,
    completedCredits: 0,
    workloadNote: {
      kk: 'Жоғары жүктеме (35 кредит): тілдік модульдер (20 кр.) мен ООП/Сызықтық алгебра қатар жүреді.',
      ru: 'Повышенная нагрузка (35 кредитов): тяжёлые языковые модули (20 кр.) параллельно с ООП и линейной алгеброй.',
      en: 'High workload (35 credits): intensive language modules (20 cr.) alongside OOP and Linear Algebra.',
    },
  },
  {
    trimester: 3,
    period: {
      kk: '16 наурыз – 31 тамыз',
      ru: '16 марта – 31 августа',
      en: 'March 16 – August 31',
    },
    plannedCredits: 17,
    inProgressCredits: 0,
    completedCredits: 0,
    workloadNote: {
      kk: 'Тәжірибелік триместр: алгоритмдер, деректер инженериясы және оқу практикасы.',
      ru: 'Практический триместр: алгоритмы, инженерия данных и учебная практика.',
      en: 'Practical trimester: algorithms, data engineering, and academic internship.',
    },
  },
];

export const FIRST_YEAR_CURRICULUM: CourseItem[] = [
  // ==================== 1 ТРИМЕСТР (1 сентября – 12 декабря) ====================
  {
    code: 'AIF1303',
    trimester: 1,
    dates: { kk: '1 қыр – 12 жел', ru: '1 сен – 12 дек', en: 'Sep 1 – Dec 12' },
    title: {
      kk: 'Жасанды интеллект негіздері',
      ru: 'Основы искусственного интеллекта',
      en: 'Fundamentals of Artificial Intelligence',
    },
    component: 'ВК',
    credits: 4,
    defaultStatus: 'in_progress',
    relatedSkills: ['ml_basics', 'python', 'data_analysis'],
    boostsCareers: ['ml_engineer', 'data_analyst', 'software_dev'],
  },
  {
    code: 'FC 1301',
    trimester: 1,
    dates: { kk: '1 қыр – 12 жел', ru: '1 сен – 12 дек', en: 'Sep 1 – Dec 12' },
    title: {
      kk: 'Математикалық талдау негіздері',
      ru: 'Основы математического анализа',
      en: 'Foundations of Mathematical Analysis',
    },
    component: 'ВК',
    credits: 5,
    defaultStatus: 'in_progress',
    relatedSkills: ['math', 'statistics'],
    boostsCareers: ['ml_engineer', 'data_analyst', 'fin_analyst'],
  },
  {
    code: 'HK1105',
    trimester: 1,
    dates: { kk: '1 қыр – 12 жел', ru: '1 сен – 12 дек', en: 'Sep 1 – Dec 12' },
    title: {
      kk: 'Қазақстан тарихы (Мемлекеттік емтихан)',
      ru: 'История Казахстана (Государственный экзамен)',
      en: 'History of Kazakhstan (State Exam)',
    },
    component: 'ОК',
    credits: 5,
    defaultStatus: 'in_progress',
    relatedSkills: ['communication', 'research'],
    boostsCareers: ['teacher', 'pm'],
  },
  {
    code: 'ICT1103',
    trimester: 1,
    dates: { kk: '1 қыр – 12 жел', ru: '1 сен – 12 дек', en: 'Sep 1 – Dec 12' },
    title: {
      kk: 'Ақпараттық-коммуникациялық технологиялар',
      ru: 'Информационно-коммуникационные технологии',
      en: 'Information and Communication Technologies',
    },
    component: 'ОК',
    credits: 5,
    defaultStatus: 'in_progress',
    relatedSkills: ['databases', 'cloud_devops', 'cybersecurity'],
    boostsCareers: ['cyber_analyst', 'software_dev', 'data_analyst'],
  },
  {
    code: 'IP1302',
    trimester: 1,
    dates: { kk: '1 қыр – 12 жел', ru: '1 сен – 12 дек', en: 'Sep 1 – Dec 12' },
    title: {
      kk: 'Бағдарламалауға кіріспе',
      ru: 'Введение в программирование',
      en: 'Introduction to Programming',
    },
    component: 'ВК',
    credits: 5,
    defaultStatus: 'in_progress',
    relatedSkills: ['python', 'algorithms'],
    boostsCareers: ['software_dev', 'ml_engineer', 'data_analyst'],
  },
  {
    code: 'PE 1101',
    trimester: 1,
    dates: { kk: '1 қыр – 12 жел', ru: '1 сен – 12 дек', en: 'Sep 1 – Dec 12' },
    title: {
      kk: 'Дене шынықтыру',
      ru: 'Физическая культура',
      en: 'Physical Education',
    },
    component: 'ОК',
    credits: 6,
    defaultStatus: 'planned',
    relatedSkills: ['teamwork'],
    boostsCareers: [],
  },

  // ==================== 2 ТРИМЕСТР (14 декабря – 13 марта) ====================
  {
    code: 'DMC 1304',
    trimester: 2,
    dates: { kk: '14 жел – 13 нау', ru: '14 дек – 13 мар', en: 'Dec 14 – Mar 13' },
    title: {
      kk: 'Есептеу жүйелеріне арналған дискретті математика',
      ru: 'Дискретная математика для вычислительных систем',
      en: 'Discrete Mathematics for Computing Systems',
    },
    component: 'ВК',
    credits: 5,
    defaultStatus: 'planned',
    relatedSkills: ['math', 'algorithms'],
    boostsCareers: ['software_dev', 'cyber_analyst', 'ml_engineer'],
  },
  {
    code: 'FL 1104',
    trimester: 2,
    dates: { kk: '14 жел – 13 нау', ru: '14 дек – 13 мар', en: 'Dec 14 – Mar 13' },
    title: {
      kk: 'Шетел тілі 1, 2',
      ru: 'Иностранный язык 1, 2',
      en: 'Foreign Language 1, 2',
    },
    component: 'ОК',
    credits: 10,
    defaultStatus: 'planned',
    relatedSkills: ['communication'],
    boostsCareers: ['pm', 'product_manager', 'software_dev'],
  },
  {
    code: 'K(R) L1110',
    trimester: 2,
    dates: { kk: '14 жел – 13 нау', ru: '14 дек – 13 мар', en: 'Dec 14 – Mar 13' },
    title: {
      kk: 'Қазақ (орыс) тілі 1, 2',
      ru: 'Казахский (русский) язык 1, 2',
      en: 'Kazakh (Russian) Language 1, 2',
    },
    component: 'ОК',
    credits: 10,
    defaultStatus: 'planned',
    relatedSkills: ['communication'],
    boostsCareers: ['teacher', 'pm', 'marketing'],
  },
  {
    code: 'LADS 1306',
    trimester: 2,
    dates: { kk: '14 жел – 13 нау', ru: '14 дек – 13 мар', en: 'Dec 14 – Mar 13' },
    title: {
      kk: 'Деректерді талдауға арналған сызықтық алгебра',
      ru: 'Линейная алгебра для анализа данных',
      en: 'Linear Algebra for Data Science',
    },
    component: 'ВК',
    credits: 5,
    defaultStatus: 'planned',
    relatedSkills: ['math', 'ml_basics', 'data_analysis'],
    boostsCareers: ['ml_engineer', 'data_analyst'],
  },
  {
    code: 'OOP 1305',
    trimester: 2,
    dates: { kk: '14 жел – 13 нау', ru: '14 дек – 13 мар', en: 'Dec 14 – Mar 13' },
    title: {
      kk: 'Объектіге-бағытталған бағдарламалау',
      ru: 'Объектно-ориентированное программирование',
      en: 'Object-Oriented Programming',
    },
    component: 'ВК',
    credits: 5,
    defaultStatus: 'planned',
    relatedSkills: ['python', 'web_dev', 'algorithms'],
    boostsCareers: ['software_dev', 'ml_engineer'],
  },

  // ==================== 3 ТРИМЕСТР (16 марта – 31 августа) ====================
  {
    code: 'AC1307',
    trimester: 3,
    dates: { kk: '16 нау – 31 там', ru: '16 мар – 31 авг', en: 'Mar 16 – Aug 31' },
    title: {
      kk: 'Қолданбалы математикалық талдау',
      ru: 'Прикладной математический анализ',
      en: 'Applied Mathematical Analysis',
    },
    component: 'ВК',
    credits: 5,
    defaultStatus: 'planned',
    relatedSkills: ['math', 'statistics'],
    boostsCareers: ['ml_engineer', 'fin_analyst', 'data_analyst'],
  },
  {
    code: 'ADSDS 1309',
    trimester: 3,
    dates: { kk: '16 нау – 31 там', ru: '16 мар – 31 авг', en: 'Mar 16 – Aug 31' },
    title: {
      kk: 'Деректерді талдауға арналған алгоритмдер мен деректер құрылымдары',
      ru: 'Алгоритмы и структуры данных для анализа данных',
      en: 'Algorithms and Data Structures for Data Science',
    },
    component: 'ВК',
    credits: 5,
    defaultStatus: 'planned',
    relatedSkills: ['algorithms', 'python', 'data_analysis'],
    boostsCareers: ['software_dev', 'ml_engineer', 'data_analyst'],
  },
  {
    code: 'DE 1308',
    trimester: 3,
    dates: { kk: '16 нау – 31 там', ru: '16 мар – 31 авг', en: 'Mar 16 – Aug 31' },
    title: {
      kk: 'Деректер инженериясы',
      ru: 'Инженерия данных',
      en: 'Data Engineering',
    },
    component: 'ВК',
    credits: 5,
    defaultStatus: 'planned',
    relatedSkills: ['databases', 'python', 'cloud_devops'],
    boostsCareers: ['data_analyst', 'ml_engineer', 'software_dev'],
  },
  {
    code: 'EP 1501',
    trimester: 3,
    dates: { kk: '16 нау – 31 там', ru: '16 мар – 31 авг', en: 'Mar 16 – Aug 31' },
    title: {
      kk: 'Оқу практикасы',
      ru: 'Учебная практика',
      en: 'Educational Internship / Practice',
    },
    component: 'ВК',
    credits: 2,
    defaultStatus: 'planned',
    relatedSkills: ['teamwork', 'python', 'databases'],
    boostsCareers: ['software_dev', 'ml_engineer', 'data_analyst'],
  },
];
