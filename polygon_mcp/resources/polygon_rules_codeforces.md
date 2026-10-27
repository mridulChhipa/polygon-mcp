# Polygon rules for preparing a Codeforces Round

> **You MUST follow these rules to prepare a Codeforces Round. For any deviations, talk to your coordinator.**

## What’s new (also marked green below)

- July 30, 2025: Do not reuse the same variable name for a different object in the statement.
- April 13, 2025: footnotes usage.
- February 23, 2025: now `\Def*` commands also work for XOR, AND and OR.
- December 26, 2024: added `\Def*` standard phrases. The Statements section was reformatted.
- August 24, 2024: specify `mex()` and other functions to be spelled lowercase in formulas.
- May 26, 2024: pretests should be equal to tests. The limits on the number of tests have been changed.
- Feb 19, 2024: the validator should use the same variable names as the statement.
- Jan 10, 2024: all problems should have multitests.

## General

- This document is not a Polygon guide, but rather a list of standards and common practices you need to follow to minimize the likelihood of mistakes.
- Please read the document carefully, even if you have experience preparing the problems, or even prepared Codeforces rounds in the past.
- If anything is unclear, speak to your coordinator.

## Warnings

- Some things are checked automatically. Make sure to check, read carefully, and correct the problem to avoid the following warnings.
  - Working copy warnings in Polygon, displayed when you commit the changes, on the Review page, and highlighted in orange/red on the right.
  - Package warnings in Polygon, displayed on package pages and on the contest page as a yellow warning triangle.
  - Discord bot warnings, available through the `$check` command in the round server.

## Checker, validator, and interactor

- Use `testlib.h`. Read help [here](https://codeforces.com/testlib). Do not use any other sources of random.
- Take a look at examples on the respective pages in Polygon.
- Do not use `#defines`. Write understandable code.
- Make sure you don’t mix tabs and spaces: your code on the Review page should be easy to read.
- In the validator `read*()` statements, the variable name should be exactly the same as in the statement.

## Validator

- Use array-reading functions `read*s(n,...)` instead of loops whenever possible.
- Check the limit on the sum of `n` after each test case.

## Checker

- Use `std::ncmp.cpp`, `std::nyesno.cpp` or `std::wcmp.cpp` whenever possible, in this order of priority.
- If the above is not enough, use a standard checker if possible.
- If you have to use a custom checker, use the `readAns` [paradigm](https://codeforces.com/blog/entry/18431). The function must be named `readAns`.
- Do not forget to initialize all global variables at the beginning of the readAns function.
- Do not check for whitespace unless you need to.
  - Use `readToken()` instead of `readLine()`.
- Do **not** validate the input file in the checker.
  - Including the use of `inf.readSpace()` / `inf.readEoln()`.
- Always set limits when reading from `ouf` and `ans`.
- Checker comments on examples are visible to contestants. So:
  - Do not spoil anything in the comments.
  - Make the checker’s comments easy to understand.

## Tests and generators

- Use multitests in all problems. t <= 10^4.
- Do not use the "add tests from archive/files" feature. Examples should be manual tests, other tests should be generated.
- The first test after examples (typically, the second test overall) should list all possible small tests.
  - Start from the smallest possible test case (typically `n=1`) and generate all possible arrays/graphs/etc.
- Do not use the following syntax in polygon scripts: `gen > {1-100}`. Use generators that generate exactly one test on each run.
- Make distinguishable names for generators:
  - Bad names:
    `gen1`, `gen2`, `gen3`.
  - Bad names (passed as a parameter):
    `gen type=1`, `gen type=2`, `gen type=3`.
  - Good names:
    `gen_path`, `gen_binary`, `gen type=random`.
- Always make tests (at least) with minimum possible, maximum possible, and some value in between for each variable and their combinations.
- Do not use a generator with the same parameters (but different seeds) more than once.
- Pretests must be equal to tests.
- D2A: total size of input no more than 50’000. When possible, use t <= 500, n <= 100.
- The maximum number of tests:

|  | D2A | D2B | D2C | D2D |
| --- | --- | --- | --- | --- |
| Tests | 4 | 10 | 20 | 30 |

## Statements

### General

- Statements are the face of the problem. They must be correct, understandable, and tidy.
- Do not make long statements. The legend should fit into the initial size of the text area in Polygon.
- Use AI helper to correct the grammar. Use American English.
- All character names should be widespread common names. Do not use nicknames/usernames.
- Words in English titles should almost always start with a capital letter: [https://capitalizemytitle.com](https://capitalizemytitle.com).
- Use common phrases and parts to write the usual things. If you have already seen a problem having the sentence you need, copy it.
  - Many standard phrases are available through special `\Def*` macros. See the list of them in the `cf-defs` problem in Polygon examples.
  - If some of the items in the table below could be used in your statements, copy.
- Use footnotes for information you expect experienced participants to know (e.g., many of the `\Def*` macroses). When new information is provided (e.g., definition is non-standard), don’t use footnotes.
- Do not reuse the same variable name for a different object.
  - Wrong: `An array $a$ is nice if… You are given an array $a$.`
  - Correct: `An array $a$ is nice if… You are given an array $b$.`

### Examples

- At least one for each possible output format.
- At least 2 example test cases per problem, it’s better to have more examples in easier problems.
- At least two examples should have a note (explanation).
- Add a note for each tricky example that potentially causes questions.

### Formatting

- Use only lowercase letters for variables. (`$n$`, not `$N$`). Exception: sets, graphs.
- Avoid multi-letter variables. If needed, multi-letter variables should be in roman, not italic:
    `$\mathrm{dis}_{i, j}$`.
- All variables, limits, and large constants should be in TeX formulas.
  - Wrong:
    `m does not exceed one hundred.`
  - Correct:
    `$m$ does not exceed $100$.`
  - But: `there are three types of cells` (not a limit or a large number).
- Use *italic*  `\textit{}` to introduce a definition. Use **bold** `\textbf{}` to mark something important. Use them only for a word or several words. If you want to bold a sentence or a few, rewrite the statement.
- Write clear text. End statements with full stops. Start statements with capital letters. Place spaces properly.
  - Wrong:
    `word1,word2`   `word1(word2)word3`   `word1 ( word2 ) word3.`
  - Correct:
    `word1, word2`   `word1 (word2) word3.`
- Formulas are part of the sentence. Place punctuation marks as if the formulas are spelled out.
  - In particular, the display formulas should usually have a comma or a full stop at the end.

### Input format

- Make the structure of the text reflect the structure of the input. One paragraph should correspond to one line of the input.
- Give constraints on each value in parentheses right after its appearance in the input format. The parentheses should not be included in the TeX formula:
    `$n$ ($1 \le n \le 10^5$)`.
- List all numbers on a line first, then give constraints.
  - Wrong: `two integers $n$ ($1 \le n \le 100$) and $m$ ($1 \le m \le 100$)`.
  - Correct: `two integers $n$ and $m$ ($1 \le n, m \le 100$)`.
- Do not use the phrase “space-separated” unless it is needed.

### TeX formatting

- All text elements (words, spaces, punctuation marks) should not be included in TeX formulas.
  - Wrong:
    `two integers $x, y$ $(1 \le x \le 10, 2 \le y \le 5)$`.
  - Correct:
    `two integers $x$, $y$ ($1 \le x \le 10$, $2 \le y \le 5$)`.
  - Possible exception: a sequence, a list, or an array: `$x_1, x_2, \ldots, x_n$`.
- To denote a sequence, use only its id or list all elements.
  - Wrong:
    `a sequence $x_i$`.
  - Correct:
    `a sequence $x$ of length $n$`,
  - or, even better,
    `a sequence $x_1, x_2, \ldots, x_n$`.
- For dash use `~---`. Note that there should not be any space before the `~`.
- For indices use `$i$-th` and similar (`$i$-й`, `$i$-я`, `$i$-го` in Russian).
- Use `\cdot` in formulas for multiplication.
- Use `\bmod` for modulus operation:
    `In Euclid’s algorithm, you repeatedly replace $(a, b)$ with $(b, a \bmod b)$.`
- Use `\equiv` and `\pmod` to show equivalence modulo some number:
    `$a^{p - 1} \equiv 1 \pmod{p}$ holds for any prime $p$.`
    See the difference from the previous option!
- Use lowercase `$\operatorname{mex}(1, 3, 0, 2, 5)$` for all functions in formulas.
- Use `$s = \mathtt{abacaba}$` to denote string constants in formulas, and `\texttt{abacaba}` outside formulas. No need for quotation marks.
- Use square brackets to denote sequences and arrays:
    `array is $[3, 4, 5, 3]$,`
    and curly brackets to denote sets and multisets with no general order:
    `the good values are $\{3, 4, 7\}$.`

| English | Russian |
| --- | --- |
| `The first line of each test case contains a single integer $n$ ($1 \le n \le 10^5$).` | `Первая строка каждого набора входных данных содержит одно целое число $n$` `($1 \le n \le 10^5$).` |
| `The second line contains $n$ integers $a_1, a_2, \ldots, a_n$ ($1 \le a_i \le n$).` | `Вторая строка содержит $n$ целых чисел $a_1, a_2, \ldots, a_n$ ($1 \le a_i \le n$).` |
| `Each of the next $m$ lines contains two integers $x$ and $y$ ($1 \le x, y \le n$),` or `The $i$-th of the next $m$ lines contains two integers $x_i$ and $y_i$  ($1 \le x_i, y_i \le n$).` | `Каждая из следующих $m$ строк содержит два целых числа $x$ и $y$ ($1 \le x, y \le n$),` или `$i$-я из следующих $m$ строк содержит два целых числа $x_i$ и $y_i$  ($1 \le x_i, y_i \le n$).` |
| ``` You can output the answer in any case (upper or lower). For example, the strings ``\t{yEs}'', ``\t{yes}'', ``\t{Yes}'', and ``\t{YES}'' will be recognized as positive responses. ``` | `Вы можете выводить каждую букву в любом регистре (строчную или заглавную). Например, строки <<\t{yEs}>>, <<\t{yes}>>, <<\t{Yes}>> и <<\t{YES}>> будут приняты как положительный ответ.` |
| `If there are multiple solutions, print any of them.` | `Если существует несколько решений, выведите любое из них.` |
| `If there is no solution, print a single integer $-1$.` | `Если решения не существует, выведите одно целое число $-1$.` |
| `We can show that an answer always exists.` This phrase should be put in legend/output and means that for every possible input an answer exists. No additional constraints are added here. | `Можно показать, что ответ всегда существует.` Используйте это предложение в легенде или в формате вывода. Она означает, что для всех возможных тестов ответ существует и не накладывает дополнительных ограничений на тест. |
| `It is guaranteed that...`<br>It means that the input is specially prepared so that the condition holds. This should be put in the legend and input section. Example: `It is guaranteed that the given edges form a tree.` | `Гарантируется, что...`<br>Эта фраза означает, что тесты специально подобраны таким образом, чтобы условие выполнялось. Используйте ее в легенде и формате ввода. Например: `Гарантируется, что заданные ребра образуют дерево.` |
| `example` | `пример` |
| Smth `is as follows.` Always singular! |  |

## Solutions

- For each problem there should be:
  - The main correct solution -- written without the usage of non-asymptotic optimizations. It should use at most half TL and half ML.
  - If there is a possibility of Java solutions working slowly (including, but not limited to C++ solutions working more than a ¼ of TL or C++ solutions using more than 50 MB), a correct java solution is needed.
  - Other correct solutions, including at least one by another author. All correct solutions should fit half TL and half ML.
  - A stupid bruteforce solution that does exactly what is written in the statements. Make sure it only gives OK or TL (place `while (true);` if needed). Select the tag “Time Limit Exceeded” for it.
  - Slow solutions that you do not want to pass. Optimize them as much as you can, including using pragmas. These solutions should not fit double TL or ML.
- The tag “Time Limit Exceeded or Correct” can be used only for solutions on the bound of TL. For solutions that get TL, use the tag “Time Limit Exceeded”.
- For easy problems write a solution in Python and make sure it passes without any optimizations.
- Do not use g++64 in the main correct solution.
- If there is a possibility of overflow in the main solution, write one in Python.
- If there is a possibility of incorrect solutions due to overflow, add one for each variable/array/place in code where overflow can occur. Make sure they all fail on pretests.
- If possible, do not make tight limits. For harder problems, 2 seconds TL is the minimum possible.
- If there is a solution with casework, or some part of the problem requires casework, write one. Then add a wrong solution for each case commented out. Make sure they all fail on pretests.

## Stresses

- Each problem should have at least two stress tests on the Stresses tab.
  - One stress on random big tests with correct solutions: other correct solutions (e.g. tester’s) will be added to it and checked.
  - One stress with random small tests with the bruteforce solution.
- Make sure the stress generators can produce all possible tests, e.g.,
  - the `n` value is not limited to a fixed value,
  - the array elements are not limited to be distinct or limited to n,
  - the graph is not limited to be connected, etc.

## Editorial

- Editorials should be written in the Statements tab, in the Tutorial field.
  - After the round, you can quickly import them in a Codeforces blog post using `[tutorial:<round-id><problem-letter]` tags, e.g. `[tutorial:2048A].`
