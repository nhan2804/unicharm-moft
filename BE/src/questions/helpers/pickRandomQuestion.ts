const getRandomElements = (arr: any, type: string, count: number) => {
  const filteredArr = arr.filter((element) => element?.category === type);
  const randomElements = [];
  const totalElements = filteredArr.length;

  if (totalElements === 0) {
    throw new Error(`No elements with type '${type}' in the array.`);
  }

  const actualCount = Math.min(count, totalElements);

  while (randomElements.length < actualCount) {
    const randomIndex = Math.floor(Math.random() * totalElements);
    const randomElement = filteredArr[randomIndex];

    if (!randomElements.includes(randomElement)) {
      randomElements.push(randomElement);
    }
  }

  return randomElements;
};

const pickRandomQuestion = (arr, counts) => {
  const randomElements = [];

  for (const [type, count] of Object.entries(counts)) {
    const typeElements = getRandomElements(arr, type, count as number);
    randomElements.push(...typeElements);
  }

  return randomElements;
};

export default pickRandomQuestion;
