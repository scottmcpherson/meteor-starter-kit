import { Tasks } from '/imports/api/collections';
import casual from 'casual';

if (Tasks.find().count() === 0) {

  // Create an array with 3 titles
  const taskTitles = [...Array(13).keys()].map(() => casual.title);

  taskTitles.forEach(title => {
    const id = Tasks.insert({ title });
    console.log(`Inserted task: ${id}`);
  })
}
