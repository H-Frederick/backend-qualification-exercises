export type DowntimeLogs = [Date, Date][];

export function merge(...args: DowntimeLogs[]): DowntimeLogs {
    let combinedLogs: DowntimeLogs = [];

    let argLogs = args.flat();

    argLogs.sort((a, b) => { 
        return a[0].getTime() - b[0].getTime(); 
    });

    let [currentStart, currentEnd] = argLogs[0];

    argLogs.forEach((value, i) => {
        if (i === 0) {
            return;
        }

        const [start, end] = value;
        if (start > currentEnd) {
            combinedLogs.push([currentStart, currentEnd]);
            [currentStart, currentEnd] = [start, end];
        } else {
            if (end > currentEnd) {
                currentEnd = end;
            }
        }
    });

    combinedLogs.push([currentStart, currentEnd]);

    return combinedLogs;
}