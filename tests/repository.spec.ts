import { InMemoryRepository } from '../JS-TS/solutions/repository';

interface TestEntity {
  id: number;
  name: string;
  value?: string;
}

describe('InMemoryRepository', () => {
  let repository: InMemoryRepository<TestEntity>;

  beforeEach(() => {
    repository = new InMemoryRepository<TestEntity>();
  });

  describe('add', () => {
    it('should successfully add a new entity', () => {
      const entity: TestEntity = { id: 1, name: 'Test' };

      const result = repository.add(entity);

      expect(result).toEqual({ id: 1, name: 'Test' });
      expect(result).not.toBe(entity);  
    });

    it('should throw error when entity is null', () => {
      expect(() => repository.add(null as any)).toThrow(
        'Entity cannot be null or undefined'
      );
    });

    it('should throw error when entity is undefined', () => {
      expect(() => repository.add(undefined as any)).toThrow(
        'Entity cannot be null or undefined'
      );
    });

    it('should throw error when adding duplicate id', () => {
      const entity: TestEntity = { id: 1, name: 'Test' };
      repository.add(entity);

      expect(() => repository.add(entity)).toThrow(
        'Entity with id 1 already exists'
      );
    });

    it('should add multiple entities with different ids', () => {
      const entity1: TestEntity = { id: 1, name: 'Test1' };
      const entity2: TestEntity = { id: 2, name: 'Test2' };

      repository.add(entity1);
      repository.add(entity2);

      expect(repository.count()).toBe(2);
    });
  });

  describe('update', () => {
    it('should successfully update an existing entity', () => {
      const entity: TestEntity = { id: 1, name: 'Test', value: 'initial' };
      repository.add(entity);

      const result = repository.update(1, { name: 'Updated', value: 'new' });

      expect(result).toEqual({ id: 1, name: 'Updated', value: 'new' });
      expect(result).not.toBe(entity); // Should return a copy
    });

    it('should throw error when patch is null', () => {
      const entity: TestEntity = { id: 1, name: 'Test' };
      repository.add(entity);

      expect(() => repository.update(1, null as any)).toThrow(
        'Patch cannot be null or undefined'
      );
    });

    it('should throw error when patch is undefined', () => {
      const entity: TestEntity = { id: 1, name: 'Test' };
      repository.add(entity);

      expect(() => repository.update(1, undefined as any)).toThrow(
        'Patch cannot be null or undefined'
      );
    });

    it('should throw error when entity not found', () => {
      expect(() => repository.update(999, { name: 'Updated' })).toThrow(
        'Entity with id 999 not found'
      );
    });

    it('should throw error when trying to change entity id', () => {
      const entity: TestEntity = { id: 1, name: 'Test' };
      repository.add(entity);

      expect(() => repository.update(1, { id: 2 })).toThrow(
        'Cannot update entity id'
      );
    });

    it('should allow partial update', () => {
      const entity: TestEntity = { id: 1, name: 'Test', value: 'initial' };
      repository.add(entity);

      const result = repository.update(1, { value: 'updated' });

      expect(result).toEqual({ id: 1, name: 'Test', value: 'updated' });
    });

    it('should not affect original entity', () => {
      const entity: TestEntity = { id: 1, name: 'Test' };
      repository.add(entity);

      repository.update(1, { name: 'Updated' });

      expect(entity.name).toBe('Test');  
    });
  });

  describe('remove', () => {
    it('should successfully remove an existing entity', () => {
      const entity: TestEntity = { id: 1, name: 'Test' };
      repository.add(entity);

      repository.remove(1);

      expect(repository.count()).toBe(0);
    });

    it('should throw error when entity not found', () => {
      expect(() => repository.remove(999)).toThrow(
        'Entity with id 999 not found'
      );
    });

    it('should remove only the specified entity', () => {
      const entity1: TestEntity = { id: 1, name: 'Test1' };
      const entity2: TestEntity = { id: 2, name: 'Test2' };
      repository.add(entity1);
      repository.add(entity2);

      repository.remove(1);

      expect(repository.count()).toBe(1);
      expect(repository.findById(2)).toEqual({ id: 2, name: 'Test2' });
    });
  });

  describe('findById', () => {
    it('should return entity by id', () => {
      const entity: TestEntity = { id: 1, name: 'Test' };
      repository.add(entity);

      const result = repository.findById(1);

      expect(result).toEqual({ id: 1, name: 'Test' });
    });

    it('should return undefined for non-existent id', () => {
      const result = repository.findById(999);

      expect(result).toBeUndefined();
    });

    it('should return a copy of the entity', () => {
      const entity: TestEntity = { id: 1, name: 'Test' };
      repository.add(entity);

      const result = repository.findById(1);
      result!.name = 'Modified';

      expect(repository.findById(1)?.name).toBe('Test'); 
    });
  });

  describe('findAll', () => {
    it('should return all entities', () => {
      const entity1: TestEntity = { id: 1, name: 'Test1' };
      const entity2: TestEntity = { id: 2, name: 'Test2' };
      repository.add(entity1);
      repository.add(entity2);

      const result = repository.findAll();

      expect(result).toHaveLength(2);
      expect(result).toEqual([
        { id: 1, name: 'Test1' },
        { id: 2, name: 'Test2' }
      ]);
    });

    it('should return empty array when no entities', () => {
      const result = repository.findAll();

      expect(result).toEqual([]);
    });

    it('should return copies of entities', () => {
      const entity: TestEntity = { id: 1, name: 'Test' };
      repository.add(entity);

      const all = repository.findAll();
      all[0].name = 'Modified';

      expect(repository.findById(1)?.name).toBe('Test');  
    });
  });

  describe('clear', () => {
    it('should remove all entities', () => {
      repository.add({ id: 1, name: 'Test1' });
      repository.add({ id: 2, name: 'Test2' });

      repository.clear();

      expect(repository.count()).toBe(0);
      expect(repository.findAll()).toEqual([]);
    });

    it('should work when already empty', () => {
      expect(() => repository.clear()).not.toThrow();
    });
  });

  describe('count', () => {
    it('should return 0 when empty', () => {
      expect(repository.count()).toBe(0);
    });

    it('should return correct count after adding entities', () => {
      repository.add({ id: 1, name: 'Test1' });
      repository.add({ id: 2, name: 'Test2' });
      repository.add({ id: 3, name: 'Test3' });

      expect(repository.count()).toBe(3);
    });

    it('should return correct count after removing entities', () => {
      repository.add({ id: 1, name: 'Test1' });
      repository.add({ id: 2, name: 'Test2' });
      repository.remove(1);

      expect(repository.count()).toBe(1);
    });
  });

  describe('edge cases', () => {
    it('should handle entities with optional fields', () => {
      const entity: TestEntity = { id: 1, name: 'Test' };
      repository.add(entity);

      const result = repository.findById(1);
      expect(result?.value).toBeUndefined();
    });

    it('should handle entities with special characters', () => {
      const entity: TestEntity = { id: 1, name: 'Test @#$%', value: '!@#$%' };
      repository.add(entity);

      const result = repository.findById(1);
      expect(result).toEqual(entity);
    });

    it('should handle large ids', () => {
      const entity: TestEntity = { id: Number.MAX_SAFE_INTEGER, name: 'Large' };
      repository.add(entity);

      const result = repository.findById(Number.MAX_SAFE_INTEGER);
      expect(result).toEqual(entity);
    });
  });
});
