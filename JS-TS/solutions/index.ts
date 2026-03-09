
import { ToDoManager } from './todo-manager';

async function main(): Promise<void> {
  const manager = new ToDoManager();
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    switch (command) {
      case 'init':
        await manager.init();
        console.log('Initialized with demo data');
        break;
 
      case 'add': {
        const title = args[1];
        const description = args[2] || '';
        if (!title) {
          console.error('Usage: ts-node index.ts add <title> [description]');
          process.exit(1);
        }
        await manager.add(title, description);
        console.log(`Added: ${title}`);
        break;
      }

      case 'complete': {
        const id = parseInt(args[1], 10);
        if (Number.isNaN(id)) {
          console.error('Usage: ts-node index.ts complete <id>');
          process.exit(1);
        }
        await manager.complete(id);
        console.log(`Completed todo with id: ${id}`);
        break;
      }

      case 'list': {
        const todos = await manager.list();
        if (todos.length === 0) {
          console.log('No todos found');
        } else {
          todos.forEach(todo => {
            console.log(`[${todo.id}] ${todo.title} - ${todo.status}`);
          });
        }
        break;
      }

      default:
        console.log('Usage: ts-node index.ts <command> [args]');
        console.log('Commands:');
        console.log('  init                    - Initialize with demo data');
        console.log('  add <title> [desc]      - Add a new todo');
        console.log('  complete <id>           - Mark a todo as complete');
        console.log('  list                    - List all todos');
        process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
