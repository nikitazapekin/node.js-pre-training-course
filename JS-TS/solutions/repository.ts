 
export class InMemoryRepository<T extends { id: number }> {
  private items: T[] = [];

  constructor(items?: T[]) {
    this.items = items ?? [];
  }
 
  add(entity: T): T {
   
    if (!entity) {
      throw new TypeError('Entity cannot be null or undefined');
    }
 
    const existing = this.items.find(item => item.id === entity.id);
    if (existing) {
      throw new Error(`Entity with id ${entity.id} already exists`);
    }

    
    this.items.push({ ...entity });
     
    return { ...entity };
  }
 
  update(id: number, patch: Partial<T>): T {
    
    if (!patch) {
      throw new TypeError('Patch cannot be null or undefined');
    }
 
    const index = this.items.findIndex(item => item.id === id);
     
    if (index === -1) {
      throw new Error(`Entity with id ${id} not found`);
    }
 
    if (patch.id !== undefined && patch.id !== id) {
      throw new Error('Cannot update entity id');
    }
 
    const updatedEntity = {
      ...this.items[index],
      ...patch
    };
 
    this.items[index] = updatedEntity;
 
    return { ...updatedEntity };
  }
 
  remove(id: number): void {
    
    const index = this.items.findIndex(item => item.id === id);
     
    if (index === -1) {
      throw new Error(`Entity with id ${id} not found`);
    }
 
    this.items.splice(index, 1);
  }
 
  findById(id: number): T | undefined {
    const entity = this.items.find(item => item.id === id);
   
    return entity ? { ...entity } : undefined;
  }
 
  findAll(): T[] {
    
    return this.items.map(item => ({ ...item }));
  }
 
  clear(): void {
    this.items = [];
  } 
  count(): number {
    return this.items.length;
  }
}