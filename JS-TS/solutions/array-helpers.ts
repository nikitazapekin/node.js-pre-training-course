 

export function mapArray<T, R>(source: readonly T[], mapper: (item: T, index: number) => R): R[] {

  if (source === null || source === undefined) {
    throw new TypeError('source cannot be null or undefined');
  }
  
  const result: R[] = [];
  let index = 0;
  
  for (const item of source) {
    result.push(mapper(item, index));
    index++;
  }
  
  return result;
}

export function filterArray<T>(source: readonly T[], predicate: (item: T, index: number) => boolean): T[] {
 
  if (source === null || source === undefined) {
    throw new TypeError('source cannot be null or undefined');
  }
  
  const result: T[] = [];
  let index = 0;
  
  for (const item of source) {
    if (predicate(item, index)) {
      result.push(item);
    }
    index++;
  }
  
  return result;
}

export function reduceArray<T, R>(
  source: readonly T[], 
  reducer: (acc: R, item: T, index: number) => R, 
  initial: R
): R {
  
  if (source === null || source === undefined) {
    throw new TypeError('source cannot be null or undefined');
  }
  
  let accumulator = initial;
  let index = 0;
  
  for (const item of source) {
    accumulator = reducer(accumulator, item, index);
    index++;
  }
  
  return accumulator;
}

export function partition<T>(source: readonly T[], predicate: (item: T) => boolean): [T[], T[]] {
 
  if (source === null || source === undefined) {
    throw new TypeError('source cannot be null or undefined');
  }
  
  const passed: T[] = [];
  const failed: T[] = [];
  
  for (const item of source) {
    if (predicate(item)) {
      passed.push(item);
    } else {
      failed.push(item);
    }
  }
  
  return [passed, failed];
}

export function groupBy<T, K extends PropertyKey>(
  source: readonly T[], 
  keySelector: (item: T) => K
): Record<K, T[]> {
 
  if (source === null || source === undefined) {
    throw new TypeError('source cannot be null or undefined');
  }
  
  const result = {} as Record<K, T[]>;
  
  for (const item of source) {
    const key = keySelector(item);
    
    if (!result[key]) {
      result[key] = [];
    }
    
    result[key].push(item);
  }
  
  return result;
}