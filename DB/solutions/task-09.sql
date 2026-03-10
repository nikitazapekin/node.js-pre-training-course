-- Task 09: Implementing an Audit Log Trigger (Raw SQL)
-- File: DB/solutions/task-09.sql
 

CREATE TABLE IF NOT EXISTS audit_log (
  id SERIAL PRIMARY KEY,
  todo_id INTEGER NOT NULL,
  action TEXT NOT NULL,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

 

-- Create the trigger function for UPDATE
CREATE OR REPLACE FUNCTION log_todo_update()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_log (todo_id, action, changed_at)
  VALUES (NEW.id, 'UPDATE', CURRENT_TIMESTAMP);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger that fires on UPDATE
DROP TRIGGER IF EXISTS todo_update_trigger ON todos;
CREATE TRIGGER todo_update_trigger
AFTER UPDATE ON todos
FOR EACH ROW
EXECUTE FUNCTION log_todo_update();


-- Create the trigger function for DELETE
CREATE OR REPLACE FUNCTION log_todo_delete()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_log (todo_id, action, changed_at)
  VALUES (OLD.id, 'DELETE', CURRENT_TIMESTAMP);
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger that fires on DELETE
DROP TRIGGER IF EXISTS todo_delete_trigger ON todos;
CREATE TRIGGER todo_delete_trigger
AFTER DELETE ON todos
FOR EACH ROW
EXECUTE FUNCTION log_todo_delete();
 
-- Test UPDATE trigger:
-- UPDATE todos SET title = 'Test Update' WHERE id = 1;
-- SELECT * FROM audit_log WHERE action = 'UPDATE';

-- Test DELETE trigger:
-- DELETE FROM todos WHERE id = 1;
-- SELECT * FROM audit_log WHERE action = 'DELETE';

-- View all audit logs:
-- SELECT * FROM audit_log ORDER BY changed_at DESC;
