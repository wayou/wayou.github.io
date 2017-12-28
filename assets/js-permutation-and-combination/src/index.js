// /**
//  * @param {number[]} nums
//  * @return {number[][]}
//  */
// var permute = function (nums) {
//     var result = [];

// 	/**
// 	 * @param {number[]} input 输入数组
// 	 * @param {number[]} prevResult 上一次得到的结果
// 	 * @return {number[]}
// 	 */
//     function process(input, prevResult) {
//         var input = input.slice();
//         if (input.length > 1) {
//             for (var i = 0; i < input.length; i++) {
//                 var currentResult = prevResult || [];
//                 currentResult = currentResult.concat(input[i]);
//                 var nextInput = input.slice();
//                 nextInput.splice(i, 1);
//                 process(nextInput, currentResult);
//             }
//         } else {
//             var currentResult = prevResult || [];
//             var row = currentResult.concat(input);
//             result.push(row);
//         }
//     }

//     process(nums);

//     return result;
// };
// console.log(permute([1, 2, 3]))

// /**
//  * @param {number} n
//  * @param {number} k
//  * @return {number[][]}
//  */
// var combine = function (n, k) {
//     var result = [];

//     /**
//      * @param {*} i 序号
//      * @param {*} n 总数
//      * @param {*} k 要取的个数
//      * @param {*} a 上一次的结果
//      */
//     function process(i, n, k, a) {
//         i = i || 1;
//         a = a || [];
//         if (k > 1) {
//             for (var i = i; i < n + 1; i++) {
//                 var row = [];
//                 row = row.concat(a)
//                 row.push(i);
//                 process(i + 1, n, k - 1, row);
//             }
//         } else {
//             for (var i = i; i < n + 1; i++) {
//                 var row = a.slice();
//                 row.push(i)
//                 result.push(row)
//             }
//         }
//     }
//     process(1, n, k);
//     return result;
// };

// console.log(combine(4, 2))
