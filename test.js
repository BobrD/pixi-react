const tr = (preferences) => {
    let count = 0;
    for (let i = 0; i < preferences.length; i++){
        let firstIndex = i+1; // первый идекс первое значение
        let firstValue = preferences[i];// первое значение любит второй индекс
        let secondValue = preferences[firstValue-1];// второе значение любит третий индекс
        let thirdValue = preferences[secondValue-1];

        if (thirdValue === firstIndex && firstIndex !== firstValue) {
            count++;
        }
    }

    return count / 3;
};
             // 1  2  3  4  5  6  7   8   9  10  11  12 13 14
console.log(tr([2, 3, 4, 5, 3, 7, 12, 11, 1, 7,  1,  10, 1, 1]));

// 7 => 12
// 10 => 7
// 12 => 10