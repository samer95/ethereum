class TableTest {
    case: string;
    input: number[];
    expectation: number[];
}

/*

  TableTest caselerine ve main() function içerisinde bir değişikliğe ihtiyaç yoktur.
  sadece gradingQuiz function içerisinde değişikliklerini yapınız.

  Tüm test caselerini göz önünde bulundurun.

  */
const Tests: TableTest[] = [
    {case: "1", input: [60, 59, 80, 80, 34], expectation: [1, 1, 1, 1]},
    {case: "2", input: [20, 70, 30, 60, 120], expectation: [0, 0, 0, 1]},
    {case: "3", input: [59, 60, 3], expectation: [1, 0]},
    {case: "4", input: [55, 55], expectation: [0]},
    {case: "5", input: [80], expectation: [1]},
    {case: "6", input: [55], expectation: [0]},
    {case: "7", input: [], expectation: []},
];

function main() {
    for (let i = 0; i < Tests.length; i++) {
        const test = Tests[i];
        const result = gradingQuiz(test.input);

        const count = test.expectation.length;
        const resultCount = result.length;
        let wrongFlag = true;

        for (let j = 0; j < count; j++) {
            if (
                (result[j] !== test.expectation[j] ||
                    result.length != test.expectation.length) &&
                wrongFlag
            ) {
                console.log(
                    test.case,
                    "hatalı",
                    "expectation:",
                    test.expectation,
                    "result:",
                    result
                );
                wrongFlag = false;
            }
        }
        if (wrongFlag && count == 0 && resultCount == 0) {
            console.log(test.case, "harikasın:", test.expectation);
            continue;
        }
        if (wrongFlag) console.log(test.case, "harikasın:", result);
    }
}

function gradingQuiz(grades: number[]): number[] {
    const avgSums: number[] = [];

    if (grades.length === 1) {
        grades.push(grades[0])
    }
    for (let i = 0; i < grades.length; i++) {
        if (i === grades.length - 1) break

        const pair = grades.slice(i, i + 2);
        const sum = pair.reduce((a, b) => a + b, 0);
        const avgSum = sum / 2;

        avgSums.push(avgSum);
    }

    const modedSums: number[] = [];

    for (let i = 0; i < avgSums.length; i++) {
        if (avgSums[i] % 5 > 1) {
            const moded = avgSums[i] + (5 - (avgSums[i] % 5));
            modedSums.push(moded);
        } else {
            modedSums.push(avgSums[i]);
        }
    }

    const results: number[] = [];
    for (let i = 0; i < modedSums.length; i++) {
        if (modedSums[i] >= 60) {
            results.push(1);
            continue;
        }
        results.push(0);
    }
    return results;
}

main();