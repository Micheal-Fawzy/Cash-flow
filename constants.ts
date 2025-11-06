import { Transaction } from './types.ts';

export const MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

export const CASH_INFLOW_CATEGORIES: string[] = [
  'مبيعات نقدية',
  'تحصيلات من مبيعات آجلة',
  'إيرادات تشغيلية أخرى',
  'قروض مستلمة',
  'زيادة رأس المال',
  'مبيعات أصول',
  'فوائد مكتسبة',
  'مردودات / استردادات ضريبية'
];

export const CASH_OUTFLOW_CATEGORIES: string[] = [
  'مدفوعات مواد خام',
  'رواتب وأجور',
  'إيجار',
  'خدمات (كهرباء، ماء، إلخ)',
  'مصاريف مكتبية',
  'شراء قطع غيار',
  'صيانة',
  'نقل / وقود',
  'تسويق وإعلان',
  'ضرائب مدفوعة',
  'مدفوعات تأمين'
];

// Function to generate some initial data for demonstration
export const generateInitialData = (): Transaction[] => {
  return [
    
  ];
};