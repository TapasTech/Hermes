export function diffList(oldList, newList) {
  const oldSet = new Set(oldList);
  const newSet = new Set(newList);
  const remove = [];
  oldSet.forEach(item => newSet.delete(item) || remove.push(item));
  const add = [... newSet];
  return {
    add,
    remove,
  };
}
